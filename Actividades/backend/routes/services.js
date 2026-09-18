const express = require("express");
const database = require("../config/database");

const router = express.Router();

router.get("/registro", (req, res) => {
    const connection = database.promise();
    const query = `
        SELECT a.id_asistencia, a.id_empleado, e.nombre, e.departamento,
            s.nombre_servicio AS servicio, a.fecha
        FROM asistencias a
        INNER JOIN empleados e ON e.id_empleado = a.id_empleado
        INNER JOIN servicios s ON s.id_servicio = a.id_servicio
        ORDER BY a.fecha DESC, a.id_asistencia DESC
        LIMIT 100
    `;
    connection.query(query)
        .then(([records]) => res.json({ records }))
        .catch((error) => res.status(500).json({ error: error.message }));
});

router.post("/registro", async (req, res) => {
    const { idEmpleado, idServicio, fecha } = req.body;
    const employeeId = Number(idEmpleado);
    const serviceId = Number(idServicio);

    if (!Number.isInteger(employeeId) || !Number.isInteger(serviceId) || !/^\d{4}-\d{2}-\d{2}$/.test(fecha || "")) {
        return res.status(400).json({ error: "Empleado, servicio y fecha son obligatorios." });
    }

    const connection = database.promise();
    try {
        const [resultSets] = await connection.query(
            "CALL sp_registrar_servicio(?, ?, ?)",
            [employeeId, serviceId, fecha]
        );
        const result = resultSets[0]?.[0] || {};
        res.status(201).json({ id_asistencia: result.id_asistencia, message: result.mensaje });
    } catch (error) {
        const status = error.sqlState === "45000" ? (error.message.includes("no existe") ? 404 : 409) : 500;
        res.status(status).json({ error: error.message });
    }
});

router.get("/", (req, res) => {
    const fechaInicio = req.query.fechaInicio || "2026-09-01";
    const fechaFin = req.query.fechaFin || "2026-09-30";
    const connection = database.promise();
    const totalsQuery = `SELECT s.id_servicio, s.nombre_servicio AS servicio, COUNT(a.id_asistencia) AS total_asistencias, COUNT(DISTINCT a.id_empleado) AS empleados_usuarios, COUNT(DISTINCT e.departamento) AS departamentos_usuarios FROM servicios s LEFT JOIN asistencias a ON s.id_servicio = a.id_servicio AND a.fecha BETWEEN ? AND ? LEFT JOIN empleados e ON e.id_empleado = a.id_empleado GROUP BY s.id_servicio, s.nombre_servicio ORDER BY s.id_servicio`;
    const departmentQuery = `SELECT s.nombre_servicio AS servicio, e.departamento, COUNT(a.id_asistencia) AS total_asistencias, COUNT(DISTINCT e.id_empleado) AS empleados_usuarios FROM asistencias a INNER JOIN servicios s ON s.id_servicio = a.id_servicio INNER JOIN empleados e ON e.id_empleado = a.id_empleado WHERE a.fecha BETWEEN ? AND ? GROUP BY s.id_servicio, s.nombre_servicio, e.departamento ORDER BY s.id_servicio, total_asistencias DESC`;
    Promise.all([connection.query(totalsQuery, [fechaInicio, fechaFin]), connection.query(departmentQuery, [fechaInicio, fechaFin])])
        .then(([[totals], [departments]]) => res.json({ services: totals.map((service) => ({ ...service, departments: departments.filter((department) => department.servicio === service.servicio) })) }))
        .catch((error) => res.status(500).json({ error: error.message }));
});

module.exports = router;
