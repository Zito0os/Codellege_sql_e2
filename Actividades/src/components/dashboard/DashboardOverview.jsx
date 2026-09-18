import { useEffect, useMemo, useState } from 'react'
import { getAnalytics } from '../../api/dashboardApi'
import PanelHeading from '../layout/PanelHeading'

const defaultFilters = { fechaInicio: '2026-09-01', fechaFin: '2026-09-30', departamento: '', servicio: '' }

function toNumber(value) { return Number(value || 0) }

function fallbackAnalytics(dashboard) {
    const summary = dashboard?.resumen || {}
    const departments = dashboard?.departamentos || []
    const totalEmployees = toNumber(summary.total_empleados)
    const users = Math.max(0, totalEmployees - toNumber(summary.no_usan_nada))
    const total = departments.reduce((sum, item) => sum + toNumber(item.total_asistencias), 0)
    const massage = departments.reduce((sum, item) => sum + toNumber(item.uso_masaje), 0)
    const physio = departments.reduce((sum, item) => sum + toNumber(item.uso_fisioterapia), 0)
    return {
        kpis: { total_empleados: totalEmployees, empleados_usuarios: users, tasa_adopcion_real: totalEmployees ? users / totalEmployees * 100 : 0, slots_contratados: 0, slots_reservados: 0, tasa_ocupacion: 0, reservas: total, atendidas: total, no_shows: 0, tasa_no_show: 0, reservas_masaje: massage, reservas_fisioterapia: physio, preferencia_masaje: total ? massage / total * 100 : 0 },
        heatmap: (dashboard?.dias || []).map((item) => ({ dia_semana: item.dia_semana, franja_horaria: 'Total', capacidad_maxima: 0, reservas: toNumber(item.total_asistencias), atendidas: toNumber(item.total_asistencias), no_shows: 0 })),
        weekly: [],
        departments: departments.map((item) => ({ departamento: item.departamento, plantilla: 0, usuarios_unicos: 0, citas: toNumber(item.total_asistencias) })),
        recurrence: [],
        serviceMix: [['Solo Masaje', toNumber(summary.solo_masaje)], ['Solo Fisioterapia', toNumber(summary.solo_fisioterapia)], ['Ambos', toNumber(summary.usan_ambos)]].map(([categoria, empleados]) => ({ categoria, empleados })),
    }
}

function getDecision(kpis) {
    const adoption = toNumber(kpis.tasa_adopcion_real)
    const occupancy = toNumber(kpis.tasa_ocupacion)
    const noShow = toNumber(kpis.tasa_no_show)
    const massageShare = toNumber(kpis.preferencia_masaje)
    if (noShow >= 25) return { label: 'REESTRUCTURAR', tone: 'danger', reason: 'El No-Show está destruyendo capacidad contratada.' }
    if (occupancy < 20 && adoption < 10) return { label: 'CANCELAR', tone: 'danger', reason: 'La prestación está prácticamente inactiva en el periodo analizado.' }
    if (occupancy < 40 || adoption < 20) return { label: 'REDUCIR', tone: 'warning', reason: 'La demanda no justifica mantener toda la capacidad.' }
    if (massageShare >= 80 && toNumber(kpis.reservas_fisioterapia) < toNumber(kpis.reservas_masaje) * .25) return { label: 'REESTRUCTURAR', tone: 'warning', reason: 'La mezcla está concentrada; conviene reasignar slots antes de cancelar.' }
    if (occupancy >= 75 && noShow <= 5) return { label: 'MANTENER', tone: 'success', reason: 'La capacidad se usa y la fuga por ausentismo es controlada.' }
    return { label: 'MANTENER', tone: 'info', reason: 'La señal es estable; continuar observando adopción y capacidad.' }
}

function statusFor(type, value) {
    if (type === 'noShow') return value <= 5 ? 'success' : value <= 15 ? 'warning' : 'danger'
    if (type === 'occupancy') return value >= 75 && value <= 95 ? 'success' : value >= 40 ? 'warning' : 'danger'
    if (type === 'adoption') return value >= 60 ? 'success' : value >= 35 ? 'warning' : 'danger'
    return value >= 70 ? 'success' : value >= 45 ? 'warning' : 'info'
}

function formatPercent(value) { return `${toNumber(value).toFixed(1)}%` }

function DashboardOverview({ dashboard }) {
    const [filters, setFilters] = useState(defaultFilters)
    const [draftFilters, setDraftFilters] = useState(defaultFilters)
    const [analytics, setAnalytics] = useState(() => fallbackAnalytics(dashboard))
    const [loading, setLoading] = useState(false)
    const [analyticsError, setAnalyticsError] = useState('')
    const departments = useMemo(() => [...new Set((dashboard?.departamentos || []).map((item) => item.departamento))], [dashboard])

    useEffect(() => {
        let active = true
        getAnalytics(filters)
            .then((result) => { if (active) { setAnalytics(result); setAnalyticsError('') } })
            .catch(() => { if (active) { setAnalytics(fallbackAnalytics(dashboard)); setAnalyticsError('Mostrando datos disponibles mientras se habilitan las tablas analíticas.') } })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [dashboard, filters])

    const kpis = analytics?.kpis || {}
    const decision = getDecision(kpis)
    const heatmap = analytics?.heatmap || []
    const weekly = analytics?.weekly || []
    const maxWeekly = Math.max(...weekly.map((item) => Math.max(toNumber(item.atendidas), toNumber(item.no_shows))), 1)
    const maxDepartment = Math.max(...(analytics?.departments || []).map((item) => Math.max(toNumber(item.plantilla), toNumber(item.usuarios_unicos))), 1)
    const maxRecurrence = Math.max(...(analytics?.recurrence || []).map((item) => toNumber(item.empleados)), 1)
    const mixTotal = Math.max((analytics?.serviceMix || []).reduce((sum, item) => sum + toNumber(item.empleados), 0), 1)
    const donutStops = (analytics?.serviceMix || []).reduce((result, item, index) => {
        const start = index === 0 ? 0 : result[index - 1].end
        const end = start + toNumber(item.empleados) / mixTotal * 100
        result.push({ ...item, start, end, color: ['#7568e6', '#f29b7d', '#6dbda6'][index % 3] })
        return result
    }, [])
    const donutBackground = donutStops.length ? `conic-gradient(${donutStops.map((item) => `${item.color} ${item.start}% ${item.end}%`).join(', ')})` : '#ececf4'

    function updateDraft(event) { setDraftFilters((current) => ({ ...current, [event.target.name]: event.target.value })) }
    function applyFilters(event) { event.preventDefault(); setLoading(true); setFilters({ ...draftFilters }) }

    return <section className="analytics-dashboard">
        <div className="analytics-toolbar">
            <div><p className="eyebrow">DECISIÓN EJECUTIVA</p><h2>Rendimiento de la prestación</h2><p className="analytics-lead">Evalúa en menos de 10 segundos si conviene mantener, reducir o reestructurar el beneficio.</p></div>
            <div className={`decision-badge ${decision.tone}`}><span>DECISIÓN SUGERIDA</span><strong>{decision.label}</strong><small>{decision.reason}</small></div>
        </div>
        <form className="analytics-filters" onSubmit={applyFilters}>
            <label>Desde<input type="date" name="fechaInicio" value={draftFilters.fechaInicio} onChange={updateDraft} /></label>
            <label>Hasta<input type="date" name="fechaFin" value={draftFilters.fechaFin} onChange={updateDraft} /></label>
            <label>Departamento<select name="departamento" value={draftFilters.departamento} onChange={updateDraft}><option value="">Todos los departamentos</option>{departments.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label>Servicio<select name="servicio" value={draftFilters.servicio} onChange={updateDraft}><option value="">Todos los servicios</option><option>Masaje</option><option>Fisioterapia</option></select></label>
            <button className="export-btn" type="submit">Actualizar análisis</button>
        </form>
        {analyticsError && <p className="analytics-note">{analyticsError}</p>}
        <div className="analytics-kpis">
            <KpiCard label="Adopción real" value={formatPercent(kpis.tasa_adopcion_real)} detail={`${toNumber(kpis.empleados_usuarios)} de ${toNumber(kpis.total_empleados)} empleados`} tone={statusFor('adoption', toNumber(kpis.tasa_adopcion_real))} />
            <KpiCard label="Ocupación de slots" value={formatPercent(kpis.tasa_ocupacion)} detail={`${toNumber(kpis.slots_reservados)} reservas / ${toNumber(kpis.slots_contratados)} slots`} tone={statusFor('occupancy', toNumber(kpis.tasa_ocupacion))} />
            <KpiCard label="No-Show / fuga" value={formatPercent(kpis.tasa_no_show)} detail={`${toNumber(kpis.no_shows)} citas perdidas`} tone={statusFor('noShow', toNumber(kpis.tasa_no_show))} />
            <KpiCard label="Preferencia Masaje" value={formatPercent(kpis.preferencia_masaje)} detail={`${toNumber(kpis.reservas_masaje)} Masaje · ${toNumber(kpis.reservas_fisioterapia)} Fisio`} tone={statusFor('preference', toNumber(kpis.preferencia_masaje))} />
        </div>
        <div className="analytics-grid analytics-grid-operational">
            <article className="panel analytics-card"><PanelHeading title="Mapa de calor de capacidad" subtitle="Ocupación por día y franja horaria" /><Heatmap data={heatmap} /></article>
            <article className="panel analytics-card"><PanelHeading title="Atendidas vs. perdidas" subtitle="Comparación semanal contra la capacidad contratada" />{loading ? <Loading /> : weekly.length ? <div className="weekly-chart">{weekly.map((item) => <div className="weekly-column" key={item.semana}><div className="weekly-bars"><i className="capacity-bar" style={{ height: `${Math.max(8, toNumber(item.capacidad_maxima) / maxWeekly * 100)}%` }} title={`Capacidad ${item.capacidad_maxima}`} /><i className="attended-bar" style={{ height: `${Math.max(4, toNumber(item.atendidas) / maxWeekly * 100)}%` }} title={`Atendidas ${item.atendidas}`} /><i className="noshow-bar" style={{ height: `${Math.max(2, toNumber(item.no_shows) / maxWeekly * 100)}%` }} title={`No-Show ${item.no_shows}`} /></div><small>{item.inicio_semana?.slice(5) || item.semana}</small></div>)}</div> : <EmptyState text="Genera slots para ver la tendencia semanal." />}<div className="chart-legend"><span><i className="legend-swatch capacity-bar" />Capacidad</span><span><i className="legend-swatch attended-bar" />Atendidas</span><span><i className="legend-swatch noshow-bar" />No-Show</span></div></article>
        </div>
        <div className="analytics-grid analytics-grid-segmentation">
            <article className="panel analytics-card"><PanelHeading title="Preferencia de servicio" subtitle="Usuarios atendidos por combinación" /><div className="donut-layout"><div className="analytics-donut" style={{ background: donutBackground }}><div><strong>{donutStops.length ? mixTotal : 0}</strong><small>usuarios</small></div></div><div className="donut-legend">{donutStops.map((item) => <div key={item.categoria}><i style={{ background: item.color }} />{item.categoria}<b>{item.empleados}</b></div>)}</div></div></article>
            <article className="panel analytics-card"><PanelHeading title="Uso vs. no uso por departamento" subtitle="Detecta brechas y áreas sin adopción" /><div className="department-chart">{(analytics?.departments || []).map((item) => <div className="department-bar-row" key={item.departamento}><span title={item.departamento}>{item.departamento}</span><div className="divergent-track"><i className="used-bar" style={{ width: `${toNumber(item.usuarios_unicos) / maxDepartment * 100}%` }} /><i className="unused-bar" style={{ width: `${Math.max(0, toNumber(item.plantilla) - toNumber(item.usuarios_unicos)) / maxDepartment * 100}%` }} /></div><small>{toNumber(item.usuarios_unicos)}/{toNumber(item.plantilla) || '—'}</small></div>)}</div></article>
            <article className="panel analytics-card"><PanelHeading title="Recurrencia y acaparamiento" subtitle="Cantidad de citas atendidas por empleado" /><div className="recurrence-chart">{(analytics?.recurrence || []).map((item) => <div className="recurrence-column" key={item.frecuencia}><div className="recurrence-bar" style={{ height: `${Math.max(5, toNumber(item.empleados) / maxRecurrence * 100)}%` }}><b>{item.empleados}</b></div><small>{item.frecuencia} citas</small></div>)}</div><p className="chart-footnote">Una barra alta en 4+ con adopción baja indica acaparamiento.</p></article>
        </div>
        <section className={`diagnosis-panel ${decision.tone}`}><div><p className="eyebrow">LECTURA PARA LA DECISIÓN</p><h2>{decision.label}: {decision.reason}</h2></div><div className="diagnosis-rules"><span><b>Cancelar un día</b> solo si un día mantiene &lt;40% de ocupación durante 3+ semanas.</span><span><b>Penalizar No-Show</b> si la ocupación es alta y el No-Show supera 15%.</span><span><b>Reasignar a Masaje</b> si su preferencia supera 80% y Fisio queda debajo de 25% del volumen.</span></div></section>
    </section>
}

function KpiCard({ label, value, detail, tone }) { return <article className={`analytics-kpi ${tone}`}><span className="kpi-status" /><p>{label}</p><strong>{value}</strong><small>{detail}</small></article> }

function Heatmap({ data }) {
    const hours = [...new Set(data.map((item) => item.franja_horaria))]
    if (!data.length || (hours.length === 1 && hours[0] === 'Total')) return <EmptyState text="Genera slots de Martes y Jueves para visualizar la capacidad." />
    return <div className="heatmap"><div className="heatmap-corner" />{hours.map((hour) => <span className="heatmap-hour" key={hour}>{hour}</span>)}{['Martes', 'Jueves'].map((day) => <div className="heatmap-row" key={day}><b>{day}</b>{hours.map((hour) => { const item = data.find((entry) => entry.dia_semana === day && entry.franja_horaria === hour); const value = item ? toNumber(item.reservas) / Math.max(toNumber(item.capacidad_maxima), 1) * 100 : 0; return <span className="heatmap-cell" key={`${day}-${hour}`} style={{ opacity: .15 + Math.min(value / 100, 1) * .85 }} title={`${day} ${hour}: ${value.toFixed(0)}%`}><b>{value.toFixed(0)}%</b></span> })}</div>)}</div>
}

function EmptyState({ text }) { return <div className="analytics-empty">{text}</div> }
function Loading() { return <div className="analytics-empty">Calculando métricas…</div> }

export default DashboardOverview
