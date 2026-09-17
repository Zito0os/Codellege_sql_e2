const express = require("express");
const database = require("../config/database");

const router = express.Router();

router.get("/", (req, res) => {
    const fechaInicio = req.query.fechaInicio || "2026-09-01";
    const fechaFin = req.query.fechaFin || "2026-09-30";
    const department = req.query.departamento || "%";
    const connection = database.promise();
    const employeeQuery = `SELECT e.id_empleado, e.nombre, e.departamento, COUNT(a.id_asistencia) AS total_asistencias, SUM(s.nombre_servicio = 'Masaje') AS total_masajes, SUM(s.nombre_servicio = 'Fisioterapia') AS total_fisioterapia FROM empleados e LEFT JOIN asistencias a ON e.id_empleado = a.id_empleado AND a.fecha BETWEEN ? AND ? LEFT JOIN servicios s ON a.id_servicio = s.id_servicio WHERE e.departamento LIKE ? GROUP BY e.id_empleado, e.nombre, e.departamento ORDER BY e.id_empleado`;
    const detailQuery = `SELECT a.id_empleado, a.id_asistencia, a.fecha, s.nombre_servicio AS servicio FROM asistencias a INNER JOIN servicios s ON a.id_servicio = s.id_servicio INNER JOIN empleados e ON e.id_empleado = a.id_empleado WHERE a.fecha BETWEEN ? AND ? AND e.departamento LIKE ? ORDER BY a.fecha DESC`;
    Promise.all([connection.query(employeeQuery, [fechaInicio, fechaFin, department]), connection.query(detailQuery, [fechaInicio, fechaFin, department])])
        .then(([[employees], [details]]) => {
            const attendanceByEmployee = details.reduce((groups, detail) => { (groups[detail.id_empleado] ||= []).push(detail); return groups; }, {});
            res.json({ departments: employees.map((employee) => employee.departamento).filter((value, index, values) => values.indexOf(value) === index), employees: employees.map((employee) => ({ ...employee, asistencias: attendanceByEmployee[employee.id_empleado] || [] })) });
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

module.exports = router;
