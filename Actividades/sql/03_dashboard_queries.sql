-- Consultas parametrizadas del dashboard.
-- Parámetros esperados: :fecha_inicio, :fecha_fin, :departamento, :servicio.

-- 1) KPIs superiores: plantilla, adopción real, ocupación, No-Show y preferencia.
SELECT
    COUNT(DISTINCT e.id_empleado) AS total_empleados,
    COUNT(DISTINCT CASE WHEN r.estatus_cita = 'Atendida' THEN r.id_empleado END) AS empleados_usuarios,
    ROUND(100 * COUNT(DISTINCT CASE WHEN r.estatus_cita = 'Atendida' THEN r.id_empleado END) / NULLIF(COUNT(DISTINCT e.id_empleado), 0), 1) AS tasa_adopcion_real,
    COUNT(DISTINCT s.id_slot) AS slots_contratados,
    COUNT(DISTINCT r.id_slot) AS slots_reservados,
    ROUND(100 * COUNT(DISTINCT r.id_slot) / NULLIF(COUNT(DISTINCT s.id_slot), 0), 1) AS tasa_ocupacion,
    COUNT(r.id_reserva) AS reservas,
    SUM(r.estatus_cita = 'No-Show') AS no_shows,
    ROUND(100 * SUM(r.estatus_cita = 'No-Show') / NULLIF(COUNT(r.id_reserva), 0), 1) AS tasa_no_show,
    SUM(s.servicio_ofrecido = 'Masaje' AND r.id_reserva IS NOT NULL) AS reservas_masaje,
    SUM(s.servicio_ofrecido = 'Fisioterapia' AND r.id_reserva IS NOT NULL) AS reservas_fisioterapia,
    ROUND(100 * SUM(s.servicio_ofrecido = 'Masaje' AND r.id_reserva IS NOT NULL) / NULLIF(COUNT(r.id_reserva), 0), 1) AS preferencia_masaje
FROM empleados e
LEFT JOIN slots_disponibles s ON s.fecha BETWEEN :fecha_inicio AND :fecha_fin
LEFT JOIN reservas_asistencias r ON r.id_slot = s.id_slot AND r.id_empleado = e.id_empleado
WHERE e.estatus = 'Activo'
  AND (:departamento = '' OR e.departamento = :departamento)
  AND (:servicio = '' OR s.servicio_ofrecido = :servicio);

-- 2) Heatmap de capacidad por día y hora.
SELECT s.dia_semana, TIME_FORMAT(s.hora_inicio, '%H:%i') AS franja_horaria,
       COUNT(DISTINCT s.id_slot) * MAX(s.capacidad) AS capacidad_maxima,
       COUNT(DISTINCT r.id_reserva) AS reservas,
       SUM(r.estatus_cita = 'Atendida') AS atendidas,
       ROUND(100 * COUNT(DISTINCT r.id_reserva) / NULLIF(COUNT(DISTINCT s.id_slot) * MAX(s.capacidad), 0), 1) AS ocupacion_pct
FROM slots_disponibles s
LEFT JOIN reservas_asistencias r ON r.id_slot = s.id_slot
WHERE s.fecha BETWEEN :fecha_inicio AND :fecha_fin
  AND (:servicio = '' OR s.servicio_ofrecido = :servicio)
GROUP BY s.dia_semana, s.hora_inicio
ORDER BY FIELD(s.dia_semana, 'Martes', 'Jueves'), s.hora_inicio;

-- 3) Distribución departamental incluyendo departamentos sin uso.
SELECT e.departamento, COUNT(DISTINCT e.id_empleado) AS plantilla,
       COUNT(DISTINCT CASE WHEN r.estatus_cita = 'Atendida' THEN e.id_empleado END) AS usuarios_unicos,
       COUNT(r.id_reserva) AS citas,
       ROUND(100 * COUNT(DISTINCT CASE WHEN r.estatus_cita = 'Atendida' THEN e.id_empleado END) / NULLIF(COUNT(DISTINCT e.id_empleado), 0), 1) AS adopcion_pct
FROM empleados e
LEFT JOIN reservas_asistencias r ON r.id_empleado = e.id_empleado
LEFT JOIN slots_disponibles s ON s.id_slot = r.id_slot AND s.fecha BETWEEN :fecha_inicio AND :fecha_fin
WHERE e.estatus = 'Activo'
GROUP BY e.departamento
ORDER BY adopcion_pct DESC, e.departamento;

-- 4) Histograma de recurrencia mensual.
WITH citas_por_empleado AS (
    SELECT r.id_empleado, COUNT(*) AS citas
    FROM reservas_asistencias r
    INNER JOIN slots_disponibles s ON s.id_slot = r.id_slot
    WHERE s.fecha BETWEEN :fecha_inicio AND :fecha_fin
      AND r.estatus_cita = 'Atendida'
    GROUP BY r.id_empleado
)
SELECT CASE WHEN COALESCE(c.citas, 0) >= 4 THEN '4+' ELSE CAST(COALESCE(c.citas, 0) AS CHAR) END AS frecuencia,
       COUNT(e.id_empleado) AS empleados
FROM empleados e
LEFT JOIN citas_por_empleado c ON c.id_empleado = e.id_empleado
WHERE e.estatus = 'Activo'
GROUP BY CASE WHEN COALESCE(c.citas, 0) >= 4 THEN '4+' ELSE CAST(COALESCE(c.citas, 0) AS CHAR) END
ORDER BY FIELD(frecuencia, '0', '1', '2', '3', '4+');
