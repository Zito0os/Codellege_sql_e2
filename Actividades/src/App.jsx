import { useEffect, useState } from 'react'
import './App.css'

const apiUrl = 'http://localhost:3001/api/dashboard'
const initialDashboard = { usuarios: [], departamentos: [], dias: [], resumen: {}, actividades: [] }
const Icon = ({children}) => <span className="icon">{children}</span>

function App() {
  const [active, setActive] = useState('Resumen')
  const [query, setQuery] = useState('')
  const [service, setService] = useState('Todos los servicios')
  const [dashboard, setDashboard] = useState(initialDashboard)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${apiUrl}?fechaInicio=2026-09-01&fechaFin=2026-09-30`)
      .then(response => {
        if (!response.ok) throw new Error('No fue posible cargar los datos del dashboard.')
        return response.json()
      })
      .then(data => setDashboard(data))
      .catch(fetchError => setError(fetchError.message))
      .finally(() => setLoading(false))
  }, [])

  const summary = dashboard.resumen
  const totalUsers = Number(summary.total_empleados || 0)
  const activeUsers = totalUsers - Number(summary.no_usan_nada || 0)
  const totalAppointments = dashboard.departamentos.reduce((total, department) => total + Number(department.total_asistencias || 0), 0)
  const massageTotal = dashboard.departamentos.reduce((total, department) => total + Number(department.uso_masaje || 0), 0)
  const physioTotal = dashboard.departamentos.reduce((total, department) => total + Number(department.uso_fisioterapia || 0), 0)
  const usagePercent = totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0
  const maxDepartment = Math.max(...dashboard.departamentos.map(department => Number(department.total_asistencias || 0)), 1)
  const maxDay = Math.max(...dashboard.dias.map(day => Number(day.total_asistencias || 0)), 1)
  const filtered = dashboard.actividades.filter(activity => {
    const searchable = `${activity.nombre} ${activity.departamento} ${activity.servicio}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (service === 'Todos los servicios' || activity.servicio === service)
  })
  const distribution = [
    ['Solo masaje', Number(summary.solo_masaje || 0), 'massage'],
    ['Solo fisioterapia', Number(summary.solo_fisioterapia || 0), 'physio'],
    ['Ambos servicios', Number(summary.usan_ambos || 0), 'both']
  ]
  const distributionTotal = distribution.reduce((total, item) => total + item[1], 0) || 1
  const donutStops = distribution.reduce((stops, [, value, color], index) => {
    const colors = { massage: '#776be5', physio: '#f3a38b', both: '#a5d7c5' }
    const start = index === 0 ? 0 : stops[index - 1].end
    const end = start + (value / distributionTotal) * 100
    stops.push({ end, color: colors[color] })
    return stops
  }, []).map((stop, index, stops) => `${stop.color} ${index === 0 ? 0 : stops[index - 1].end}% ${stop.end}%`).join(',')

  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">+</span>Vitalia<span className="brand-dot">.</span></div><p className="workspace-label">CENTRO DE BIENESTAR</p><nav>{['Resumen','Asistencias','Empleados','Servicios'].map(item => <button className={active === item ? 'nav-item active' : 'nav-item'} onClick={() => setActive(item)} key={item}><Icon>{item === 'Resumen' ? '⌂' : item === 'Asistencias' ? '◷' : item === 'Empleados' ? '♙' : '◈'}</Icon>{item}</button>)}</nav><div className="sidebar-bottom"><button className="nav-item"><Icon>⚙</Icon>Configuración</button><div className="profile"><div className="avatar">JD</div><div><strong>Juan Díaz</strong><small>Administrador</small></div><span>⌄</span></div></div></aside><main className="main-content"><header className="topbar"><div className="mobile-brand">Vitalia<span className="brand-dot">.</span></div><div className="top-actions"><button className="notification">♢<span /></button><div className="avatar small">JD</div></div></header><section className="page-heading"><div><p className="eyebrow">MIÉRCOLES, 17 DE SEPTIEMBRE DE 2026</p><h1>Resumen general</h1><p className="subtitle">Conoce el comportamiento de los usuarios y el rendimiento de tus servicios.</p></div><button className="export-btn">⇩ &nbsp;Exportar reporte</button></section><div className="period-bar"><span>Periodo de análisis</span><button className="period">Este mes <span>⌄</span></button><span className="updated">● Datos actualizados hace 5 min</span></div>
{error && <section className="panel placeholder-panel"><h2>Error al cargar los datos</h2><p>{error}</p></section>}
{loading ? <section className="panel placeholder-panel"><h2>Cargando métricas...</h2><p>Consultando los registros de MySQL.</p></section> : active === 'Resumen' ? <><section className="metrics-grid"><Metric icon="♙" color="lilac" title="Usuarios registrados" value={totalUsers} change="Datos reales"/><Metric icon="◷" color="peach" title="Asistencias totales" value={totalAppointments} change="Periodo actual"/><Metric icon="✦" color="mint" title="Uso de servicios" value={`${usagePercent}%`} change={`${activeUsers} usuarios activos`}/><Metric icon="⌁" color="blue" title="Empleados activos" value={activeUsers} change="Con al menos un servicio"/></section><section className="charts-grid"><article className="panel usage-panel"><Heading title="Uso de servicios" subtitle="Comparativa de asistencias durante el mes"/><div className="legend"><span><i className="dot massage" />Masaje <b>{massageTotal}</b></span><span><i className="dot physio" />Fisioterapia <b>{physioTotal}</b></span></div><div className="chart"><div className="y-labels"><span>{maxDay}</span><span>{Math.round(maxDay * .75)}</span><span>{Math.round(maxDay * .5)}</span><span>{Math.round(maxDay * .25)}</span><span>0</span></div><div className="chart-area"><div className="grid-lines"><i /><i /><i /><i /><i /></div><div className="bars">{dashboard.dias.map(day => <div className="bar-group" key={day.dia_semana}><div className="bar massage" style={{ height: `${(Number(day.total_masajes) / maxDay) * 145}px` }} /><div className="bar physio" style={{ height: `${(Number(day.total_fisioterapia) / maxDay) * 145}px` }} /><small>{day.dia_semana.slice(0, 3)}</small></div>)}</div></div></div><div className="chart-foot"><span>Sep 2026</span><span>1 sep - 30 sep</span></div></article><article className="panel distribution-panel"><Heading title="Distribución de usuarios" subtitle="Preferencia por servicio"/><div className="donut-wrap"><div className="donut" style={{ background: `conic-gradient(${donutStops})` }}><div><strong>{activeUsers}</strong><small>usuarios activos</small></div></div></div><div className="distribution-list">{distribution.map(([label, value, color]) => <div key={label}><i className={`dot ${color}`} />{label} <b>{value} <small>{Math.round((value / distributionTotal) * 100)}%</small></b></div>)}</div></article></section><section className="bottom-grid"><article className="panel"><Heading title="Uso por departamento" subtitle="Asistencias registradas por área"/><div className="department-list">{dashboard.departamentos.map(department => <div className="department-row" key={department.departamento}><span>{department.departamento}</span><div className="progress"><i style={{ width: `${(Number(department.total_asistencias) / maxDepartment) * 100}%` }} /></div><b>{department.total_asistencias}</b></div>)}</div></article><article className="panel insight-panel"><div className="insight-icon">✦</div><p className="eyebrow">HALLAZGO PRINCIPAL</p><h2>{massageTotal >= physioTotal ? 'El masaje es el servicio más solicitado' : 'La fisioterapia es el servicio más solicitado'}</h2><p>Representa el <strong>{totalAppointments ? Math.round((Math.max(massageTotal, physioTotal) / totalAppointments) * 100) : 0}%</strong> de las asistencias del periodo.</p><button className="link-button">Explorar análisis →</button></article></section></> : <section className="panel placeholder-panel"><div className="insight-icon">✦</div><h2>{active}</h2><p>Esta vista está preparada para conectarse con los datos reales del backend.</p><button className="link-button" onClick={() => setActive('Resumen')}>Volver al resumen →</button></section>}
<section className="panel activity-panel"><Heading title="Actividad reciente" subtitle="Últimas asistencias registradas" /><div className="filters"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar usuario..." /><select value={service} onChange={event => setService(event.target.value)}><option>Todos los servicios</option><option>Masaje</option><option>Fisioterapia</option></select><button className="filter-btn">☷</button></div><div className="table-wrap"><table><thead><tr><th>USUARIO</th><th>DEPARTAMENTO</th><th>SERVICIO</th><th>FECHA</th><th>ESTADO</th></tr></thead><tbody>{filtered.map(activity => <tr key={`${activity.nombre}-${activity.fecha}-${activity.servicio}`}><td><span className="table-avatar">{activity.nombre.split(' ').map(name => name[0]).join('').slice(0, 2)}</span>{activity.nombre}</td><td>{activity.departamento}</td><td>{activity.servicio}</td><td>{formatDate(activity.fecha)}</td><td><span className="status complete">{activity.estado}</span></td></tr>)}</tbody></table></div></section></main></div>
}

function formatDate(date) {
  const [year, month, day] = String(date).slice(0, 10).split('-')
  return `${day} ${['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][Number(month) - 1]} ${year}`
}

function Metric({icon, color, title, value, change}) { return <article className="metric-card"><div className={`metric-icon ${color}`}>{icon}</div><div><p>{title}</p><strong>{value}</strong><small className="neutral">{change}</small></div></article> }
function Heading({title, subtitle}) { return <div className="panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="more">•••</button></div> }
export default App
