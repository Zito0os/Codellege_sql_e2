import PanelHeading from '../layout/PanelHeading'

function DashboardOverview({ dashboard }) {
    const summary = dashboard?.resumen || {}
    const departments = dashboard?.departamentos || []
    const totalEmployees = Number(summary.total_empleados || 0)
    const activeEmployees = totalEmployees - Number(summary.no_usan_nada || 0)
    const total = departments.reduce((sum, item) => sum + Number(item.total_asistencias || 0), 0)
    const massage = departments.reduce((sum, item) => sum + Number(item.uso_masaje || 0), 0)
    const physio = departments.reduce((sum, item) => sum + Number(item.uso_fisioterapia || 0), 0)
    const max = Math.max(...departments.map((item) => Number(item.total_asistencias || 0)), 1)
    const distribution = [['Solo masaje', summary.solo_masaje, 'massage'], ['Solo fisioterapia', summary.solo_fisioterapia, 'physio'], ['Ambos servicios', summary.usan_ambos, 'both']]
    const distributionTotal = distribution.reduce((sum, item) => sum + Number(item[1] || 0), 0) || 1

    return <><section className="metrics-grid"><Metric icon="♙" color="lilac" title="Empleados registrados" value={totalEmployees} detail={`${activeEmployees} con uso`} /><Metric icon="◷" color="peach" title="Asistencias totales" value={total} detail="Periodo actual" /><Metric icon="✦" color="mint" title="Participación" value={`${totalEmployees ? Math.round((activeEmployees / totalEmployees) * 100) : 0}%`} detail="empleados activos" /><Metric icon="⌁" color="blue" title="Servicio preferido" value={massage >= physio ? 'Masaje' : 'Fisioterapia'} detail={`${Math.max(massage, physio)} asistencias`} /></section><section className="analysis-grid"><article className="panel"><PanelHeading title="Uso por departamento" subtitle="Asistencias y concentración de la demanda" /><div className="department-list">{departments.map((item) => <div className="department-row" key={item.departamento}><span>{item.departamento}</span><div className="progress"><i style={{ width: `${(Number(item.total_asistencias || 0) / max) * 100}%` }} /></div><b>{item.total_asistencias}</b></div>)}</div></article><article className="panel"><PanelHeading title="Preferencia de servicio" subtitle="Empleados según los servicios que utilizan" /><div className="distribution-list">{distribution.map(([label, value, color]) => <div key={label}><i className={`dot ${color}`} />{label}<b>{value || 0} <small>{Math.round((Number(value || 0) / distributionTotal) * 100)}%</small></b></div>)}</div><div className="insight-copy"><strong>{massage >= physio ? 'Masaje lidera el uso' : 'Fisioterapia lidera el uso'}</strong><p>Esta comparación ayuda a decidir si la prestación responde a intereses diversos o depende de un solo servicio.</p></div></article></section><section className="panel activity-panel"><PanelHeading title="Actividad reciente" subtitle="Últimas asistencias registradas" /><div className="table-wrap"><table><thead><tr><th>USUARIO</th><th>DEPARTAMENTO</th><th>SERVICIO</th><th>FECHA</th></tr></thead><tbody>{(dashboard?.actividades || []).slice(0, 8).map((activity) => <tr key={`${activity.nombre}-${activity.fecha}-${activity.servicio}`}><td><span className="table-avatar">{activity.nombre.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span>{activity.nombre}</td><td>{activity.departamento}</td><td>{activity.servicio}</td><td>{formatDate(activity.fecha)}</td></tr>)}</tbody></table></div></section></>
}

function Metric({ icon, color, title, value, detail }) { return <article className="metric-card"><div className={`metric-icon ${color}`}>{icon}</div><div><p>{title}</p><strong>{value}</strong><small className="neutral">{detail}</small></div></article> }
function formatDate(value) { const date = String(value).slice(0, 10).split('-'); return `${date[2]}/${date[1]}/${date[0]}` }
export default DashboardOverview
