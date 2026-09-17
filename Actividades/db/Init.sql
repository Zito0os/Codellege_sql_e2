create database softtek;
use softtek;

-- 1. TABLA DE EMPLEADOS
CREATE TABLE empleados (
    id_empleado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    departamento VARCHAR(50)
);

-- 2. TABLA DE SERVICIOS
CREATE TABLE servicios (
    id_servicio INT PRIMARY KEY AUTO_INCREMENT,
    nombre_servicio VARCHAR(50)
);

-- 3. TABLA DE ASISTENCIAS (Registro de citas)
CREATE TABLE asistencias (
    id_asistencia INT PRIMARY KEY AUTO_INCREMENT,
    id_empleado INT,
    id_servicio INT,
    fecha DATE,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);


-- Insertar los dos servicios
INSERT INTO servicios (nombre_servicio) VALUES ('Masaje'), ('Fisioterapia');

INSERT INTO empleados (nombre, departamento) VALUES
('Ana Gómez', 'Tecnología'),
('Carlos López', 'Recursos Humanos'),
('Mariana Ruiz', 'Finanzas'),
('Sofía Hernández', 'Ventas'),
('Roberto Díaz', 'Operaciones'),
('Laura Martínez', 'Tecnología'),
('Javier Rodríguez', 'Recursos Humanos'),
('Lucía Fernández', 'Finanzas'),
('Diego Sánchez', 'Ventas'),
('Elena Pérez', 'Operaciones'),
('Alejandro González', 'Tecnología'),
('Valeria Ramírez', 'Recursos Humanos'),
('Gabriel Torres', 'Finanzas'),
('Camila Flores', 'Ventas'),
('Mateo Rivera', 'Operaciones'),
('Isabella Gómez', 'Tecnología'),
('Daniel Díaz', 'Recursos Humanos'),
('Paula Morales', 'Finanzas'),
('Nicolás Ortiz', 'Ventas'),
('Sara Gutiérrez', 'Operaciones'),
('Samuel Castro', 'Tecnología'),
('Victoria Vargas', 'Recursos Humanos'),
('David Mendoza', 'Finanzas'),
('Andrea Aguilar', 'Ventas'),
('Santiago Silva', 'Operaciones'),
('Natalia Romero', 'Tecnología'),
('Sebastián Navarro', 'Recursos Humanos'),
('Daniela Torres', 'Finanzas'),
('Adrián Domínguez', 'Ventas'),
('Fernanda Ramos', 'Operaciones'),
('Joaquín Gil', 'Tecnología'),
('Romina Serrano', 'Recursos Humanos'),
('Lucas Blanco', 'Finanzas'),
('Aitana Molina', 'Ventas'),
('Hugo Morales', 'Operaciones'),
('Manuela Suárez', 'Tecnología'),
('Leo Delgado', 'Recursos Humanos'),
('Zoe Castro', 'Finanzas'),
('Álvaro Ortiz', 'Ventas'),
('Sonia Marín', 'Operaciones'),
('Erick Luna', 'Tecnología'),
('Regina Medina', 'Recursos Humanos'),
('Tomás Peña', 'Finanzas'),
('Renata Flores', 'Ventas'),
('Guillermo Benítez', 'Operaciones'),
('Ximena Cabrera', 'Tecnología'),
('Martín Ríos', 'Recursos Humanos'),
('Paloma Santander', 'Finanzas'),
('Ignacio Bravo', 'Ventas'),
('Paulina Orozco', 'Operaciones'),
('Francisco Lara', 'Tecnología'),
('Alicia Rivas', 'Recursos Humanos'),
('Rodrigo Rangel', 'Finanzas'),
('Estefanía Soto', 'Ventas'),
('Emilio Córdoba', 'Operaciones'),
('Lorena Ibarra', 'Tecnología'),
('Gonzalo Parra', 'Recursos Humanos'),
('Claudia Varela', 'Finanzas'),
('César Gallegos', 'Ventas'),
('Silvia Pineda', 'Operaciones'),
('Manuel Aranda', 'Tecnología'),
('Montserrat Escamilla', 'Recursos Humanos'),
('Oscar Franco', 'Finanzas'),
('Karla Beltrán', 'Ventas'),
('Rubén Valenzuela', 'Operaciones'),
('Verónica Solares', 'Tecnología'),
('Marcos Leyva', 'Recursos Humanos'),
('Adriana Trejo', 'Finanzas'),
('Héctor Palacios', 'Ventas'),
('Gloria Coronado', 'Operaciones'),
('Iván Salgado', 'Tecnología'),
('Giselle Naranjo', 'Recursos Humanos'),
('Jaime Alarcón', 'Finanzas'),
('Vanessa Zambrano', 'Ventas'),
('Felipe Olvera', 'Operaciones'),
('Teresa Becerra', 'Tecnología'),
('Saúl Barrientos', 'Recursos Humanos'),
('Yolanda Carvajal', 'Finanzas'),
('Arturo Hurtado', 'Ventas'),
('Patricia Espinoza', 'Operaciones'),
('Raúl Cárdenas', 'Tecnología'),
('Lidia Santillán', 'Recursos Humanos'),
('Enrique Lemus', 'Finanzas'),
('Mónica Verdugo', 'Ventas'),
('Jorge Tamayo', 'Operaciones'),
('Brenda Ceballos', 'Tecnología'),
('Julio Zúñiga', 'Recursos Humanos'),
('Irene Villalobos', 'Finanzas'),
('Mauricio Godoy', 'Ventas'),
('Miriam Cepeda', 'Operaciones'),
('Omar Valadez', 'Tecnología'),
('Nuria Quezada', 'Recursos Humanos'),
('Esteban Barba', 'Finanzas'),
('Diana Escalante', 'Ventas'),
('Guido Paredes', 'Operaciones'),
('Guadalupe Soria', 'Tecnología'),
('Salvador Tapia', 'Recursos Humanos'),
('Rocío Gamboa', 'Finanzas'),
('Armando Manrique', 'Ventas'),
('Luz De la Cruz', 'Operaciones'),
('Emanuel Rosales', 'Tecnología'),
('Karen Ojeda', 'Recursos Humanos'),
('Alonso Guajardo', 'Finanzas'),
('Nadia Camacho', 'Ventas'),
('Claudio Solís', 'Operaciones'),
('Jimena Nava', 'Tecnología'),
('Braulio Macías', 'Recursos Humanos'),
('Melisa Portillo', 'Finanzas'),
('Ariel Trujillo', 'Ventas'),
('Rebeca Villarreal', 'Operaciones'),
('Aarón Montiel', 'Tecnología'),
('Dulce Galván', 'Recursos Humanos'),
('Vicente Samaniego', 'Finanzas'),
('Lourdes Banderas', 'Ventas'),
('Fabián Montes', 'Operaciones'),
('Lilia Covarrubias', 'Tecnología'),
('Abelardo Leal', 'Recursos Humanos'),
('Yazmín Jaimes', 'Finanzas'),
('Ramiro Archundia', 'Ventas'),
('Ofelia Centeno', 'Operaciones'),
('Darío Ballesteros', 'Tecnología'),
('Maité Terán', 'Recursos Humanos'),
('Lázaro Bustos', 'Finanzas'),
('Irma Castañeda', 'Ventas'),
('Aurelio Reséndiz', 'Operaciones'),
('Magdalena Rendón', 'Tecnología'),
('Ciro Villegas', 'Recursos Humanos'),
('Amalia Pedraza', 'Finanzas'),
('Benjamín Luque', 'Ventas'),
('Débora Osorio', 'Operaciones'),
('Gustavo Frías', 'Tecnología'),
('Griselda Loera', 'Recursos Humanos'),
('Ezequiel Amador', 'Finanzas'),
('Flor Mares', 'Ventas'),
('Marcos Granados', 'Operaciones'),
('Guillermina Palomino', 'Tecnología'),
('Oswaldo Tejeda', 'Recursos Humanos'),
('Cecilia Solano', 'Finanzas'),
('Efrén Alanís', 'Ventas'),
('Noemí Santamaría', 'Operaciones'),
('Fidel Valero', 'Tecnología'),
('Perla Saldaña', 'Recursos Humanos'),
('Baltazar Barajas', 'Finanzas'),
('Josefina Cisneros', 'Ventas'),
('Rigoberto Esquivel', 'Operaciones'),
('Gema Meléndez', 'Tecnología'),
('Homero Vaca', 'Recursos Humanos'),
('Consuelo Padrón', 'Finanzas'),
('Máximo Nájera', 'Ventas'),
('Aurora Maya', 'Operaciones'),
('Agustín Ceballos', 'Tecnología'),
('Dalia Montalvo', 'Recursos Humanos'),
('Moisas Cienfuegos', 'Finanzas'),
('Aída Berlanga', 'Ventas'),
('Elías Uribe', 'Operaciones'),
('Angélica Arredondo', 'Tecnología'),
('Adolfo Treviño', 'Recursos Humanos'),
('Celia Chapa', 'Finanzas'),
('Uriel Garay', 'Ventas'),
('Hilda Anaya', 'Operaciones'),
('Bernardo Téllez', 'Tecnología'),
('Socorro Galindo', 'Recursos Humanos'),
('Fructuoso Zepeda', 'Finanzas'),
('Soledad Ponce', 'Ventas'),
('Rodolfo Botello', 'Operaciones'),
('Rosario Valles', 'Tecnología'),
('Mariano Elizondo', 'Recursos Humanos'),
('Blanca Nuncio', 'Finanzas'),
('Gael Venegas', 'Ventas'),
('Margarita Del Río', 'Operaciones'),
('Leopoldo Villaseñor', 'Tecnología'),
('Maricela Cantú', 'Recursos Humanos'),
('Dante Cavazos', 'Finanzas'),
('Catalina Hinojosa', 'Ventas'),
('Demetrio Garza', 'Operaciones'),
('Minerva Sada', 'Tecnología'),
('Octavio Zamudio', 'Recursos Humanos'),
('Estela Pichardo', 'Finanzas'),
('Aníbal Ledesma', 'Ventas'),
('Evangelina Borrego', 'Operaciones'),
('Israel Marroquín', 'Tecnología'),
('Beatriz Cossío', 'Recursos Humanos'),
('Hernán Jáuregui', 'Finanzas'),
('Juana Del Valle', 'Ventas'),
('Santos Almonte', 'Operaciones'),
('Inés Carmona', 'Tecnología'),
('Casimiro Aburto', 'Recursos Humanos'),
('Leticia Brizuela', 'Finanzas'),
('Fausto Calderón', 'Ventas'),
('Esperanza Duarte', 'Operaciones'),
('Gonzalo Escudero', 'Tecnología'),
('Maritza Gamez', 'Recursos Humanos'),
('Helio Huerta', 'Finanzas'),
('Eloísa Illescas', 'Ventas'),
('Eugenio Jurado', 'Operaciones'),
('Ariadna Kuri', 'Tecnología'),
('Heriberto Linares', 'Recursos Humanos'),
('Graciela Mansilla', 'Finanzas'),
('Nicanor Negrete', 'Ventas'),
('Olga Nepomuceno', 'Operaciones');

INSERT INTO asistencias (id_empleado, id_servicio, fecha) VALUES
-- 1. Empleados que van a AMBOS servicios (del empleado 1 al 40)
(1, 1, '2026-09-08'), (1, 2, '2026-09-10'),
(2, 1, '2026-09-08'), (2, 2, '2026-09-10'),
(3, 1, '2026-09-08'), (3, 2, '2026-09-15'),
(4, 1, '2026-09-10'), (4, 2, '2026-09-15'),
(5, 1, '2026-09-08'), (5, 2, '2026-09-10'),
(6, 1, '2026-09-15'), (6, 2, '2026-09-17'),
(7, 1, '2026-09-08'), (7, 2, '2026-09-10'),
(8, 1, '2026-09-10'), (8, 2, '2026-09-17'),
(9, 1, '2026-09-08'), (9, 2, '2026-09-10'),
(10, 1, '2026-09-15'), (10, 2, '2026-09-17'),
(11, 1, '2026-09-08'), (11, 2, '2026-09-10'),
(12, 1, '2026-09-10'), (12, 2, '2026-09-15'),
(13, 1, '2026-09-08'), (13, 2, '2026-09-10'),
(14, 1, '2026-09-15'), (14, 2, '2026-09-17'),
(15, 1, '2026-09-08'), (15, 2, '2026-09-10'),
(16, 1, '2026-09-08'), (16, 2, '2026-09-15'),
(17, 1, '2026-09-10'), (17, 2, '2026-09-17'),
(18, 1, '2026-09-08'), (18, 2, '2026-09-10'),
(19, 1, '2026-09-15'), (19, 2, '2026-09-17'),
(20, 1, '2026-09-08'), (20, 2, '2026-09-10'),

-- 2. Empleados que van SOLO A MASAJE (Servicio 1) (del empleado 41 al 100)
(41, 1, '2026-09-08'), (42, 1, '2026-09-08'), (43, 1, '2026-09-08'),
(44, 1, '2026-09-10'), (45, 1, '2026-09-10'), (46, 1, '2026-09-10'),
(47, 1, '2026-09-15'), (48, 1, '2026-09-15'), (49, 1, '2026-09-15'),
(50, 1, '2026-09-17'), (51, 1, '2026-09-08'), (52, 1, '2026-09-08'),
(53, 1, '2026-09-10'), (54, 1, '2026-09-10'), (55, 1, '2026-09-15'),
(56, 1, '2026-09-15'), (57, 1, '2026-09-17'), (58, 1, '2026-09-17'),
(59, 1, '2026-09-08'), (60, 1, '2026-09-10'), (61, 1, '2026-09-15'),
(62, 1, '2026-09-17'), (63, 1, '2026-09-08'), (64, 1, '2026-09-10'),
(65, 1, '2026-09-15'), (66, 1, '2026-09-17'), (67, 1, '2026-09-08'),
(68, 1, '2026-09-10'), (69, 1, '2026-09-15'), (70, 1, '2026-09-17'),

-- 3. Empleados que van SOLO A FISIOTERAPIA (Servicio 2) (del empleado 101 al 150)
(101, 2, '2026-09-08'), (102, 2, '2026-09-08'), (103, 2, '2026-09-10'),
(104, 2, '2026-09-10'), (105, 2, '2026-09-15'), (106, 2, '2026-09-15'),
(107, 2, '2026-09-17'), (108, 2, '2026-09-17'), (109, 2, '2026-09-08'),
(110, 2, '2026-09-10'), (111, 2, '2026-09-15'), (112, 2, '2026-09-17'),
(113, 2, '2026-09-08'), (114, 2, '2026-09-10'), (115, 2, '2026-09-15'),
(116, 2, '2026-09-17'), (117, 2, '2026-09-08'), (118, 2, '2026-09-10'),
(119, 2, '2026-09-15'), (120, 2, '2026-09-17'), (121, 2, '2026-09-08'),
(122, 2, '2026-09-10'), (123, 2, '2026-09-15'), (124, 2, '2026-09-17');

-- Los empleados del 151 al 200 no se insertan en la tabla, lo que significa que "NO HAN USADO NINGÚN SERVICIO".



-- ============================================================
-- CONSULTA PARA VER QUÉ EMPLEADO USA CADA SERVICIO
-- ============================================================

SELECT 
    e.nombre,
    e.departamento,
    CASE 
        WHEN COUNT(DISTINCT CASE WHEN s.nombre_servicio = 'Masaje' THEN a.id_asistencia END) > 0 
         AND COUNT(DISTINCT CASE WHEN s.nombre_servicio = 'Fisioterapia' THEN a.id_asistencia END) > 0 THEN 'Ambos'
        WHEN COUNT(DISTINCT CASE WHEN s.nombre_servicio = 'Masaje' THEN a.id_asistencia END) > 0 THEN 'Solo Masaje'
        WHEN COUNT(DISTINCT CASE WHEN s.nombre_servicio = 'Fisioterapia' THEN a.id_asistencia END) > 0 THEN 'Solo Fisioterapia'
        ELSE 'Ninguno'
    END AS categoria_servicio
FROM empleados e
LEFT JOIN asistencias a ON e.id_empleado = a.id_empleado
LEFT JOIN servicios s ON a.id_servicio = s.id_servicio
GROUP BY e.id_empleado, e.nombre, e.departamento;



SELECT 
    e.departamento,
    COUNT(a.id_asistencia) AS total_asistencias,
    COUNT(DISTINCT CASE WHEN s.nombre_servicio = 'Masaje' THEN a.id_asistencia END) AS uso_masaje,
    COUNT(DISTINCT CASE WHEN s.nombre_servicio = 'Fisioterapia' THEN a.id_asistencia END) AS uso_fisioterapia
FROM empleados e
LEFT JOIN asistencias a ON e.id_empleado = a.id_empleado
LEFT JOIN servicios s ON a.id_servicio = s.id_servicio
GROUP BY e.departamento
ORDER BY total_asistencias DESC;


SELECT 
    DAYNAME(a.fecha) AS dia_semana,
    COUNT(a.id_asistencia) AS total_asistencias,
    COUNT(DISTINCT CASE WHEN s.nombre_servicio = 'Masaje' THEN a.id_asistencia END) AS total_masajes,
    COUNT(DISTINCT CASE WHEN s.nombre_servicio = 'Fisioterapia' THEN a.id_asistencia END) AS total_fisioterapia
FROM asistencias a
JOIN servicios s ON a.id_servicio = s.id_servicio
GROUP BY dia_semana
ORDER BY total_asistencias DESC;

SELECT 
    COUNT(DISTINCT e.id_empleado) AS total_empleados,
    
    -- Empleados que usan AMBOS
    COUNT(DISTINCT CASE WHEN t.uso_masaje > 0 AND t.uso_fisioterapia > 0 THEN e.id_empleado END) AS usan_ambos,
    
    -- Empleados que usan SOLO MASAJE
    COUNT(DISTINCT CASE WHEN t.uso_masaje > 0 AND t.uso_fisioterapia = 0 THEN e.id_empleado END) AS solo_masaje,
    
    -- Empleados que usan SOLO FISIOTERAPIA
    COUNT(DISTINCT CASE WHEN t.uso_masaje = 0 AND t.uso_fisioterapia > 0 THEN e.id_empleado END) AS solo_fisioterapia,
    
    -- Empleados que NO usan NINGUNO
    COUNT(DISTINCT CASE WHEN t.uso_masaje = 0 AND t.uso_fisioterapia = 0 THEN e.id_empleado END) AS no_usan_nada

FROM empleados e
LEFT JOIN (
    SELECT 
        id_empleado,
        COUNT(CASE WHEN id_servicio = 1 THEN 1 END) AS uso_masaje,
        COUNT(CASE WHEN id_servicio = 2 THEN 1 END) AS uso_fisioterapia
    FROM asistencias
    GROUP BY id_empleado
) t ON e.id_empleado = t.id_empleado;