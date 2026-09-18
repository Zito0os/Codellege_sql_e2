-- Generador de escenarios de estrés.
-- Escenarios: 1 = éxito/saturado, 2 = fuga por No-Show, 3 = subutilizado/acaparamiento.
-- Uso: CALL sp_generar_escenario(1, '2026-09-01', 4);

DROP PROCEDURE IF EXISTS sp_generar_escenario;
DELIMITER $$

CREATE PROCEDURE sp_generar_escenario(
    IN p_escenario TINYINT,
    IN p_fecha_inicio DATE,
    IN p_semanas TINYINT
)
BEGIN
    DECLARE v_fecha DATE;
    DECLARE v_fecha_fin DATE;
    DECLARE v_hora TINYINT DEFAULT 9;
    DECLARE v_servicio VARCHAR(20);
    DECLARE v_dia VARCHAR(10);
    DECLARE v_id_slot BIGINT;
    DECLARE v_contador INT DEFAULT 0;
    DECLARE v_empleado INT;
    DECLARE v_reservar BOOLEAN;
    DECLARE v_no_show BOOLEAN;
    DECLARE v_ocupacion TINYINT;
    DECLARE v_no_show_pct TINYINT;
    DECLARE v_servicio_index TINYINT;

    IF p_escenario NOT IN (1, 2, 3) OR p_semanas < 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Escenario inválido. Use 1, 2 o 3 y al menos una semana.';
    END IF;

    SET v_ocupacion = CASE p_escenario WHEN 1 THEN 90 WHEN 2 THEN 80 ELSE 35 END;
    SET v_no_show_pct = CASE p_escenario WHEN 1 THEN 3 WHEN 2 THEN 35 ELSE 8 END;
    SET v_fecha_fin = DATE_ADD(p_fecha_inicio, INTERVAL p_semanas WEEK);

    -- El generador recrea únicamente las reservas/slots de la demo.
    DELETE FROM reservas_asistencias;
    DELETE FROM slots_disponibles;

    WITH RECURSIVE numeros AS (
        SELECT 1 AS n
        UNION ALL SELECT n + 1 FROM numeros WHERE n < 200
    )
    INSERT IGNORE INTO empleados (id_empleado, nombre, departamento, estatus)
    SELECT n,
           CONCAT('Empleado Demo ', LPAD(n, 3, '0')),
           ELT(1 + MOD(n - 1, 8), 'Finanzas', 'Operaciones', 'Tecnología', 'Recursos Humanos', 'Ventas', 'Marketing', 'Legal', 'Logística'),
           'Activo'
    FROM numeros;

    SET v_fecha = p_fecha_inicio;
    WHILE v_fecha < v_fecha_fin DO
        IF DAYOFWEEK(v_fecha) IN (3, 5) THEN
            SET v_dia = IF(DAYOFWEEK(v_fecha) = 3, 'Martes', 'Jueves');
            SET v_hora = 9;
            WHILE v_hora < 17 DO
                SET v_servicio_index = 1;
                WHILE v_servicio_index <= IF(p_escenario = 2, 1, 2) DO
                    -- En el escenario 2 se ofrece una mezcla 85/15 de slots antes de reservarlos.
                    SET v_servicio = IF(p_escenario = 2, IF(MOD(v_contador, 20) < 17, 'Masaje', 'Fisioterapia'), IF(v_servicio_index = 1, 'Masaje', 'Fisioterapia'));
                    SET v_contador = v_contador + 1;
                    SET v_reservar = MOD(v_contador * 37, 100) < v_ocupacion;
                    IF p_escenario = 3 THEN
                        SET v_empleado = 1 + MOD(v_contador - 1, 15);
                    ELSE
                        SET v_empleado = 1 + MOD(v_contador * 13, 200);
                    END IF;

                    INSERT INTO slots_disponibles (fecha, dia_semana, hora_inicio, hora_fin, servicio_ofrecido)
                    VALUES (v_fecha, v_dia, MAKETIME(v_hora, 0, 0), MAKETIME(v_hora + 1, 0, 0), v_servicio);
                    SET v_id_slot = LAST_INSERT_ID();

                    IF v_reservar THEN
                        SET v_no_show = MOD(v_contador * 19, 100) < v_no_show_pct;
                        INSERT INTO reservas_asistencias (id_slot, id_empleado, fecha_reserva, estatus_cita)
                        VALUES (v_id_slot, v_empleado, DATE_SUB(v_fecha, INTERVAL 3 DAY), IF(v_no_show, 'No-Show', 'Atendida'));
                    END IF;
                    SET v_servicio_index = v_servicio_index + 1;
                END WHILE;
                SET v_hora = v_hora + 1;
            END WHILE;
        END IF;
        SET v_fecha = DATE_ADD(v_fecha, INTERVAL 1 DAY);
    END WHILE;
END$$

DELIMITER ;
