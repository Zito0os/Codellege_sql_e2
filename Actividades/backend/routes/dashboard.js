const express = require("express");
const database = require("../config/database");

const router = express.Router();

router.get("/", (req, res) => {
    const fechaInicio = req.query.fechaInicio || "2026-09-01";
    const fechaFin = req.query.fechaFin || "2026-09-30";
    const connection = database.promise();
    const queries = [
        connection.query(`SELECT e.id_empleado, e.nombre, e.departamento, COUNT(a.id_asistencia) AS total_asistencias, SUM(s.nombre_servicio = 'Masaje') AS uso_masaje, SUM(s.nombre_servicio = 'Fisioterapia') AS uso_fisioterapia FROM empleados e LEFT JOIN asistencias a ON e.id_empleado = a.id_empleado AND a.fecha BETWEEN ? AND ? LEFT JOIN servicios s ON a.id_servicio = s.id_servicio GROUP BY e.id_empleado, e.nombre, e.departamento ORDER BY e.id_empleado`, [fechaInicio, fechaFin]),
        connection.query(`SELECT e.departamento, COUNT(a.id_asistencia) AS total_asistencias, SUM(s.nombre_servicio = 'Masaje') AS uso_masaje, SUM(s.nombre_servicio = 'Fisioterapia') AS uso_fisioterapia FROM empleados e LEFT JOIN asistencias a ON e.id_empleado = a.id_empleado AND a.fecha BETWEEN ? AND ? LEFT JOIN servicios s ON a.id_servicio = s.id_servicio GROUP BY e.departamento ORDER BY total_asistencias DESC`, [fechaInicio, fechaFin]),
        connection.query(`SELECT DAYNAME(a.fecha) AS dia_semana, COUNT(*) AS total_asistencias, SUM(s.nombre_servicio = 'Masaje') AS total_masajes, SUM(s.nombre_servicio = 'Fisioterapia') AS total_fisioterapia FROM asistencias a INNER JOIN servicios s ON a.id_servicio = s.id_servicio WHERE a.fecha BETWEEN ? AND ? GROUP BY DAYOFWEEK(a.fecha), DAYNAME(a.fecha) ORDER BY DAYOFWEEK(a.fecha)`, [fechaInicio, fechaFin]),
        connection.query(`SELECT COUNT(*) AS total_empleados, SUM(COALESCE(t.uso_masaje, 0) > 0 AND COALESCE(t.uso_fisioterapia, 0) > 0) AS usan_ambos, SUM(COALESCE(t.uso_masaje, 0) > 0 AND COALESCE(t.uso_fisioterapia, 0) = 0) AS solo_masaje, SUM(COALESCE(t.uso_masaje, 0) = 0 AND COALESCE(t.uso_fisioterapia, 0) > 0) AS solo_fisioterapia, SUM(COALESCE(t.uso_masaje, 0) = 0 AND COALESCE(t.uso_fisioterapia, 0) = 0) AS no_usan_nada FROM empleados e LEFT JOIN (SELECT id_empleado, SUM(id_servicio = 1) AS uso_masaje, SUM(id_servicio = 2) AS uso_fisioterapia FROM asistencias WHERE fecha BETWEEN ? AND ? GROUP BY id_empleado) t ON e.id_empleado = t.id_empleado`, [fechaInicio, fechaFin]),
        connection.query(`SELECT e.nombre, e.departamento, s.nombre_servicio AS servicio, a.fecha, 'Completada' AS estado FROM asistencias a INNER JOIN empleados e ON e.id_empleado = a.id_empleado INNER JOIN servicios s ON s.id_servicio = a.id_servicio WHERE a.fecha BETWEEN ? AND ? ORDER BY a.fecha DESC, a.id_asistencia DESC LIMIT 50`, [fechaInicio, fechaFin])
    ];

    Promise.all(queries)
        .then(([usuarios, departamentos, dias, resumen, actividades]) => res.json({ usuarios: usuarios[0], departamentos: departamentos[0], dias: dias[0], resumen: resumen[0][0] || {}, actividades: actividades[0] }))
        .catch((error) => res.status(500).json({ error: error.message }));
});

module.exports = router;
