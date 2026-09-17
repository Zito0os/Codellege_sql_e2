import { useState } from 'react'
import { activityRows, serviceOptions } from '../../data/dashboardData'
import PanelHeading from '../layout/PanelHeading'

function ActivityPanel() {
    const [query, setQuery] = useState('')
    const [service, setService] = useState(serviceOptions[0])
    const filteredRows = activityRows.filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase()) && (service === serviceOptions[0] || row[2].includes(service)))

    return <section className="panel activity-panel"><PanelHeading title="Actividad reciente" subtitle="Últimas asistencias registradas" /><div className="filters"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar usuario..." aria-label="Buscar usuario" /><select value={service} onChange={(event) => setService(event.target.value)} aria-label="Filtrar por servicio">{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select><button className="filter-btn" aria-label="Más filtros">☷</button></div><div className="table-wrap"><table><thead><tr><th>USUARIO</th><th>DEPARTAMENTO</th><th>SERVICIO</th><th>FECHA</th><th>ESTADO</th></tr></thead><tbody>{filteredRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${cell}`}>{index === 0 && <span className="table-avatar">{cell.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span>}{cell}{index === 4 && <span className={cell === 'Completada' ? 'status complete' : 'status pending'}>{cell}</span>}</td>)}</tr>)}</tbody></table></div></section>
}

export default ActivityPanel
