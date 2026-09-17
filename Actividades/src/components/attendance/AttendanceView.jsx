import { useState } from 'react'
import PanelHeading from '../layout/PanelHeading'

function AttendanceView({ data }) {
    const [department, setDepartment] = useState('Todos los departamentos')
    const [query, setQuery] = useState('')
    const departments = ['Todos los departamentos', ...data.departments]
    const employees = data.employees.filter((employee) => (department === departments[0] || employee.departamento === department) && `${employee.id_empleado} ${employee.nombre}`.toLowerCase().includes(query.toLowerCase()))
    return <section className="panel attendance-panel"><PanelHeading title="Asistencias por empleado" subtitle="Identifica quién utiliza la prestación y con qué frecuencia" /><div className="filters analysis-filters"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por ID o nombre..." aria-label="Buscar por ID o nombre" /><select value={department} onChange={(event) => setDepartment(event.target.value)} aria-label="Filtrar por departamento">{departments.map((item) => <option key={item}>{item}</option>)}</select><span className="result-count">{employees.length} empleados</span></div><div className="table-wrap"><table><thead><tr><th>ID</th><th>EMPLEADO</th><th>DEPARTAMENTO</th><th>ASISTENCIAS</th><th>MASAJE</th><th>FISIOTERAPIA</th><th>DETALLE</th></tr></thead><tbody>{employees.map((employee) => <EmployeeRow employee={employee} key={employee.id_empleado} />)}</tbody></table></div></section>
}

function EmployeeRow({ employee }) { const [expanded, setExpanded] = useState(false); return <><tr><td>#{employee.id_empleado}</td><td><span className="table-avatar">{employee.nombre.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span>{employee.nombre}</td><td>{employee.departamento}</td><td><strong>{employee.total_asistencias || 0}</strong></td><td>{employee.total_masajes || 0}</td><td>{employee.total_fisioterapia || 0}</td><td><button className="detail-button" onClick={() => setExpanded(!expanded)}>{expanded ? 'Ocultar' : 'Ver historial'}</button></td></tr>{expanded && <tr className="detail-row"><td colSpan="7"><div className="attendance-history">{employee.asistencias.length ? employee.asistencias.map((item) => <span key={item.id_asistencia}><b>{formatDate(item.fecha)}</b>{item.servicio}</span>) : <span>Sin asistencias en el periodo.</span>}</div></td></tr>}</> }
function formatDate(value) { const date = String(value).slice(0, 10).split('-'); return `${date[2]}/${date[1]}/${date[0]}` }
export default AttendanceView
