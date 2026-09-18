-- Modelo analítico para la prestación de bienestar laboral.
-- Compatible con MySQL 8.0+. Ejecutar sobre la base configurada en backend/.env.

CREATE TABLE IF NOT EXISTS empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    departamento VARCHAR(80) NOT NULL,
    correo VARCHAR(160) NULL,
    estatus ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
    fecha_alta DATE NOT NULL DEFAULT (CURRENT_DATE),
    INDEX idx_empleados_departamento_estatus (departamento, estatus)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS slots_disponibles (
    id_slot BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    dia_semana ENUM('Martes', 'Jueves') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    servicio_ofrecido ENUM('Masaje', 'Fisioterapia') NOT NULL,
    capacidad SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    UNIQUE KEY uq_slot (fecha, hora_inicio, servicio_ofrecido),
    INDEX idx_slots_fecha_servicio (fecha, servicio_ofrecido),
    CONSTRAINT chk_slot_horario CHECK (hora_fin > hora_inicio),
    CONSTRAINT chk_slot_dia CHECK (DAYOFWEEK(fecha) IN (3, 5))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reservas_asistencias (
    id_reserva BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_slot BIGINT UNSIGNED NOT NULL,
    id_empleado INT NOT NULL,
    fecha_reserva DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estatus_cita ENUM('Atendida', 'No-Show', 'Cancelada a tiempo') NOT NULL DEFAULT 'Atendida',
    motivo_cancelacion VARCHAR(255) NULL,
    UNIQUE KEY uq_reserva_slot_empleado (id_slot, id_empleado),
    INDEX idx_reservas_empleado_fecha (id_empleado, fecha_reserva),
    INDEX idx_reservas_estatus (estatus_cita),
    CONSTRAINT fk_reservas_slot FOREIGN KEY (id_slot) REFERENCES slots_disponibles (id_slot),
    CONSTRAINT fk_reservas_empleado FOREIGN KEY (id_empleado) REFERENCES empleados (id_empleado)
) ENGINE=InnoDB;

-- Catálogo mínimo para instalaciones nuevas. Si ya existe, no modifica el catálogo actual.
CREATE TABLE IF NOT EXISTS servicios (
    id_servicio INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_servicio VARCHAR(60) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

INSERT IGNORE INTO servicios (nombre_servicio) VALUES ('Masaje'), ('Fisioterapia');
