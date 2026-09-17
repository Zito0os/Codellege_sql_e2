const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const defaultStartDate = "2026-09-01";
const defaultEndDate = "2026-09-30";

const activityQuery = `
    SELECT
        e.nombre,
        e.departamento,
        s.nombre_servicio AS servicio,
        a.fecha,
        'Completada' AS estado
    FROM asistencias a
    INNER JOIN empleados e ON e.id_empleado = a.id_empleado
    INNER JOIN servicios s ON s.id_servicio = a.id_servicio
    WHERE a.fecha BETWEEN ? AND ?
    ORDER BY a.fecha DESC, a.id_asistencia DESC
    LIMIT 50
`;

async function queryDashboardDirect(fechaInicio, fechaFin) {
    const connection = db.promise();
    const [usuarios] = await connection.query(`
        SELECT e.id_empleado, e.nombre, e.departamento,
            CASE
                WHEN SUM(CASE WHEN s.nombre_servicio = 'Masaje' THEN 1 ELSE 0 END) > 0
                 AND SUM(CASE WHEN s.nombre_servicio = 'Fisioterapia' THEN 1 ELSE 0 END) > 0 THEN 'Ambos'
                WHEN SUM(CASE WHEN s.nombre_servicio = 'Masaje' THEN 1 ELSE 0 END) > 0 THEN 'Solo Masaje'
                WHEN SUM(CASE WHEN s.nombre_servicio = 'Fisioterapia' THEN 1 ELSE 0 END) > 0 THEN 'Solo Fisioterapia'
                ELSE 'Ninguno'
            END AS categoria_servicio
        FROM empleados e
        LEFT JOIN asistencias a ON e.id_empleado = a.id_empleado AND a.fecha BETWEEN ? AND ?
        LEFT JOIN servicios s ON a.id_servicio = s.id_servicio
        GROUP BY e.id_empleado, e.nombre, e.departamento
        ORDER BY e.id_empleado
    `, [fechaInicio, fechaFin]);
    const [departamentos] = await connection.query(`
        SELECT e.departamento, COUNT(a.id_asistencia) AS total_asistencias,
            SUM(CASE WHEN s.nombre_servicio = 'Masaje' THEN 1 ELSE 0 END) AS uso_masaje,
            SUM(CASE WHEN s.nombre_servicio = 'Fisioterapia' THEN 1 ELSE 0 END) AS uso_fisioterapia
        FROM empleados e
        LEFT JOIN asistencias a ON e.id_empleado = a.id_empleado AND a.fecha BETWEEN ? AND ?
        LEFT JOIN servicios s ON a.id_servicio = s.id_servicio
        GROUP BY e.departamento
        ORDER BY total_asistencias DESC
    `, [fechaInicio, fechaFin]);
    const [dias] = await connection.query(`
        SELECT DAYNAME(a.fecha) AS dia_semana, COUNT(a.id_asistencia) AS total_asistencias,
            SUM(CASE WHEN s.nombre_servicio = 'Masaje' THEN 1 ELSE 0 END) AS total_masajes,
            SUM(CASE WHEN s.nombre_servicio = 'Fisioterapia' THEN 1 ELSE 0 END) AS total_fisioterapia
        FROM asistencias a
        INNER JOIN servicios s ON a.id_servicio = s.id_servicio
        WHERE a.fecha BETWEEN ? AND ?
        GROUP BY DAYOFWEEK(a.fecha), DAYNAME(a.fecha)
        ORDER BY total_asistencias DESC
    `, [fechaInicio, fechaFin]);
    const [resumen] = await connection.query(`
        SELECT COUNT(*) AS total_empleados,
            SUM(CASE WHEN COALESCE(t.uso_masaje, 0) > 0 AND COALESCE(t.uso_fisioterapia, 0) > 0 THEN 1 ELSE 0 END) AS usan_ambos,
            SUM(CASE WHEN COALESCE(t.uso_masaje, 0) > 0 AND COALESCE(t.uso_fisioterapia, 0) = 0 THEN 1 ELSE 0 END) AS solo_masaje,
            SUM(CASE WHEN COALESCE(t.uso_masaje, 0) = 0 AND COALESCE(t.uso_fisioterapia, 0) > 0 THEN 1 ELSE 0 END) AS solo_fisioterapia,
            SUM(CASE WHEN COALESCE(t.uso_masaje, 0) = 0 AND COALESCE(t.uso_fisioterapia, 0) = 0 THEN 1 ELSE 0 END) AS no_usan_nada
        FROM empleados e
        LEFT JOIN (
            SELECT id_empleado,
                SUM(CASE WHEN id_servicio = 1 THEN 1 ELSE 0 END) AS uso_masaje,
                SUM(CASE WHEN id_servicio = 2 THEN 1 ELSE 0 END) AS uso_fisioterapia
            FROM asistencias
            WHERE fecha BETWEEN ? AND ?
            GROUP BY id_empleado
        ) t ON e.id_empleado = t.id_empleado
    `, [fechaInicio, fechaFin]);
    const [actividades] = await connection.query(activityQuery, [fechaInicio, fechaFin]);

    return { usuarios, departamentos, dias, resumen: resumen[0] || {}, actividades };
}

db.connect((error) => {
    if (error) {
        console.log("Error al conectar con MySQL:", error);
        return;
    }

    console.log("Conectado a MySQL");
});

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.get("/api/dashboard", (req, res) => {
    const fechaInicio = req.query.fechaInicio || defaultStartDate;
    const fechaFin = req.query.fechaFin || defaultEndDate;

    const dashboardQuery = "CALL sp_dashboard_resumen(?, ?)";

    db.query(dashboardQuery, [fechaInicio, fechaFin], (error, resultSets) => {
        if (error) {
            if (error.code !== "ER_SP_DOES_NOT_EXIST") {
                return res.status(500).json({ error: error.message });
            }

            return queryDashboardDirect(fechaInicio, fechaFin)
                .then((data) => res.json(data))
                .catch((queryError) => res.status(500).json({ error: queryError.message }));
        }

        db.query(activityQuery, [fechaInicio, fechaFin], (activityError, activities) => {
            if (activityError) {
                return res.status(500).json({ error: activityError.message });
            }

            const [usuarios, departamentos, dias, resumen] = resultSets;
            res.json({
                usuarios,
                departamentos,
                dias,
                resumen: resumen[0] || {},
                actividades: activities
            });
        });
    });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});