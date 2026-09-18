const express = require("express");
const database = require("../config/database");

const router = express.Router();

function number(value) {
    return Number(value || 0);
}

function normalizeRow(row) {
    return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, typeof value === "bigint" ? Number(value) : value]));
}

router.get("/", async (req, res) => {
    const fechaInicio = req.query.fechaInicio || "2026-09-01";
    const fechaFin = req.query.fechaFin || "2026-09-30";
    const departamento = req.query.departamento || "";
    const servicio = req.query.servicio || "";
    const connection = database.promise();
    const departmentFilter = departamento ? " AND e.departamento = ?" : "";
    const serviceFilter = servicio ? " AND s.servicio_ofrecido = ?" : "";
    const scopeParams = [fechaInicio, fechaFin, ...(departamento ? [departamento] : []), ...(servicio ? [servicio] : [])];

    const queries = [
        connection.query(`
            SELECT
                (SELECT COUNT(*) FROM empleados WHERE estatus = 'Activo'${departamento ? " AND departamento = ?" : ""}) AS total_empleados,
                COUNT(DISTINCT CASE WHEN r.estatus_cita = 'Atendida' THEN r.id_empleado END) AS empleados_usuarios,
                COUNT(DISTINCT s.id_slot) AS slots_contratados,
                COUNT(DISTINCT r.id_slot) AS slots_reservados,
                COUNT(r.id_reserva) AS reservas,
                SUM(r.estatus_cita = 'Atendida') AS atendidas,
                SUM(r.estatus_cita = 'No-Show') AS no_shows,
                SUM(r.estatus_cita = 'Cancelada a tiempo') AS canceladas,
                SUM(s.servicio_ofrecido = 'Masaje' AND r.id_reserva IS NOT NULL) AS reservas_masaje,
                SUM(s.servicio_ofrecido = 'Fisioterapia' AND r.id_reserva IS NOT NULL) AS reservas_fisioterapia
            FROM slots_disponibles s
            LEFT JOIN reservas_asistencias r ON r.id_slot = s.id_slot
            LEFT JOIN empleados e ON e.id_empleado = r.id_empleado
            WHERE s.fecha BETWEEN ? AND ?${departmentFilter}${serviceFilter}
        `, [departamento || undefined, ...scopeParams.slice(0, 2), ...(departamento ? [departamento] : []), ...(servicio ? [servicio] : [])].filter((value) => value !== undefined)),
        connection.query(`
            SELECT s.dia_semana, TIME_FORMAT(s.hora_inicio, '%H:%i') AS franja_horaria,
                   COUNT(DISTINCT s.id_slot) * MAX(s.capacidad) AS capacidad_maxima,
                   COUNT(DISTINCT r.id_reserva) AS reservas,
                   SUM(r.estatus_cita = 'Atendida') AS atendidas,
                   SUM(r.estatus_cita = 'No-Show') AS no_shows
            FROM slots_disponibles s
            LEFT JOIN reservas_asistencias r ON r.id_slot = s.id_slot
            LEFT JOIN empleados e ON e.id_empleado = r.id_empleado
            WHERE s.fecha BETWEEN ? AND ?${departmentFilter}${serviceFilter}
            GROUP BY s.dia_semana, s.hora_inicio
            ORDER BY FIELD(s.dia_semana, 'Martes', 'Jueves'), s.hora_inicio
        `, scopeParams),
        connection.query(`
            SELECT YEARWEEK(s.fecha, 3) AS semana, DATE_FORMAT(MIN(s.fecha), '%Y-%m-%d') AS inicio_semana,
                   COUNT(DISTINCT s.id_slot) * MAX(s.capacidad) AS capacidad_maxima,
                   SUM(r.estatus_cita = 'Atendida') AS atendidas,
                   SUM(r.estatus_cita = 'No-Show') AS no_shows,
                   COUNT(r.id_reserva) AS reservas
            FROM slots_disponibles s
            LEFT JOIN reservas_asistencias r ON r.id_slot = s.id_slot
            LEFT JOIN empleados e ON e.id_empleado = r.id_empleado
            WHERE s.fecha BETWEEN ? AND ?${departmentFilter}${serviceFilter}
            GROUP BY YEARWEEK(s.fecha, 3)
            ORDER BY semana
        `, scopeParams),
        connection.query(`
            SELECT e.departamento, COUNT(DISTINCT e.id_empleado) AS plantilla,
                   COUNT(DISTINCT CASE WHEN r.estatus_cita = 'Atendida' THEN e.id_empleado END) AS usuarios_unicos,
                   COUNT(r.id_reserva) AS citas
            FROM empleados e
            LEFT JOIN reservas_asistencias r ON r.id_empleado = e.id_empleado
            LEFT JOIN slots_disponibles s ON s.id_slot = r.id_slot AND s.fecha BETWEEN ? AND ?${serviceFilter}
            WHERE e.estatus = 'Activo'
            GROUP BY e.departamento
            ORDER BY usuarios_unicos DESC, e.departamento
        `, [fechaInicio, fechaFin, ...(servicio ? [servicio] : [])]),
        connection.query(`
            SELECT CASE WHEN COUNT(r.id_reserva) >= 4 THEN '4+' ELSE CAST(COUNT(r.id_reserva) AS CHAR) END AS frecuencia,
                   COUNT(DISTINCT e.id_empleado) AS empleados
            FROM empleados e
            LEFT JOIN reservas_asistencias r ON r.id_empleado = e.id_empleado
            LEFT JOIN slots_disponibles s ON s.id_slot = r.id_slot AND s.fecha BETWEEN ? AND ?${serviceFilter}
            WHERE e.estatus = 'Activo'
            GROUP BY e.id_empleado
        `, [fechaInicio, fechaFin, ...(servicio ? [servicio] : [])]),
        connection.query(`
            SELECT categoria, COUNT(*) AS empleados
            FROM (
                SELECT r.id_empleado,
                       CASE
                           WHEN SUM(s.servicio_ofrecido = 'Masaje') > 0 AND SUM(s.servicio_ofrecido = 'Fisioterapia') > 0 THEN 'Ambos'
                           WHEN SUM(s.servicio_ofrecido = 'Masaje') > 0 THEN 'Solo Masaje'
                           WHEN SUM(s.servicio_ofrecido = 'Fisioterapia') > 0 THEN 'Solo Fisioterapia'
                       END AS categoria
                FROM reservas_asistencias r
                INNER JOIN slots_disponibles s ON s.id_slot = r.id_slot
                INNER JOIN empleados e ON e.id_empleado = r.id_empleado
                WHERE s.fecha BETWEEN ? AND ? AND r.estatus_cita = 'Atendida'${departmentFilter}${serviceFilter}
                GROUP BY r.id_empleado
            ) usuarios
            WHERE categoria IS NOT NULL
            GROUP BY categoria
            ORDER BY empleados DESC
        `, [fechaInicio, fechaFin, ...(departamento ? [departamento] : []), ...(servicio ? [servicio] : [])]),
    ];

    try {
        const [[summaryRows], [heatmap], [weekly], [departments], [recurrenceRows], [serviceMix]] = await Promise.all(queries);
        const summary = summaryRows[0] || {};
        const recurrence = ['0', '1', '2', '3', '4+'].map((frequency) => ({ frecuencia: frequency, empleados: 0 }));
        recurrenceRows.forEach((row) => {
            const item = recurrence.find((entry) => entry.frecuencia === row.frecuencia);
            if (item) item.empleados += number(row.empleados);
        });
        res.json({
            filtros: { fechaInicio, fechaFin, departamento, servicio },
            kpis: {
                total_empleados: number(summary.total_empleados),
                empleados_usuarios: number(summary.empleados_usuarios),
                tasa_adopcion_real: number(summary.total_empleados) ? (number(summary.empleados_usuarios) / number(summary.total_empleados)) * 100 : 0,
                slots_contratados: number(summary.slots_contratados),
                slots_reservados: number(summary.slots_reservados),
                tasa_ocupacion: number(summary.slots_contratados) ? (number(summary.slots_reservados) / number(summary.slots_contratados)) * 100 : 0,
                reservas: number(summary.reservas),
                atendidas: number(summary.atendidas),
                no_shows: number(summary.no_shows),
                canceladas: number(summary.canceladas),
                tasa_no_show: number(summary.reservas) ? (number(summary.no_shows) / number(summary.reservas)) * 100 : 0,
                reservas_masaje: number(summary.reservas_masaje),
                reservas_fisioterapia: number(summary.reservas_fisioterapia),
                preferencia_masaje: number(summary.reservas) ? (number(summary.reservas_masaje) / number(summary.reservas)) * 100 : 0,
            },
            heatmap: heatmap.map(normalizeRow),
            weekly: weekly.map(normalizeRow),
            departments: departments.map(normalizeRow).map((row) => ({ ...row, plantilla: number(row.plantilla), usuarios_unicos: number(row.usuarios_unicos), citas: number(row.citas) })),
            recurrence,
            serviceMix: serviceMix.map(normalizeRow),
        });
    } catch (error) {
        res.status(500).json({ error: error.message, code: error.code });
    }
});

module.exports = router;
