# Modelo analítico de bienestar laboral

## Orden de ejecución

1. `01_schema.sql`: crea `slots_disponibles` y `reservas_asistencias`, además del catálogo mínimo.
2. `02_generate_scenarios.sql`: crea `sp_generar_escenario`.
3. Genera datos: `CALL sp_generar_escenario(1, '2026-09-01', 4);`.
4. Usa `03_dashboard_queries.sql` como referencia de las consultas parametrizadas.

Los escenarios están diseñados para validar decisiones:

| Escenario | Ocupación | No-Show | Mezcla | Concentración |
|---|---:|---:|---|---|
| 1. Éxito/saturado | 90% | 3% | equilibrada | distribuida |
| 2. Fuga de dinero | 80% | 35% | 85% Masaje | demanda sesgada |
| 3. Subutilizado | 35% | 8% | mixta | 15 empleados |

## Fases 3 y 4 implementadas

El componente `src/components/dashboard/DashboardOverview.jsx` consume `/api/analytics` y organiza el dashboard así:

- Header ejecutivo y filtros de fechas, departamento y servicio.
- KPIs de adopción, ocupación, No-Show y preferencia con semáforo.
- Heatmap Martes/Jueves por hora y comparación semanal de capacidad, atendidas y No-Show.
- Dona de mezcla de usuarios, barras divergentes por departamento e histograma de recurrencia.
- Diagnóstico automático: `MANTENER`, `REDUCIR`, `REESTRUCTURAR` o `CANCELAR`.

Reglas de decisión:

1. **Cancelar un día**: ocupación menor a 40% durante al menos 3 semanas; cancelar solo si el día sigue debajo del umbral al separar Martes y Jueves.
2. **Cambiar cancelación/penalización**: ocupación alta con No-Show mayor a 15%; priorizar recordatorios, lista de espera y penalización progresiva.
3. **Reasignar a Masaje**: preferencia de Masaje mayor a 80% y Fisioterapia debajo de 25% del volumen; mover slots gradualmente y conservar un mínimo piloto de Fisio.
