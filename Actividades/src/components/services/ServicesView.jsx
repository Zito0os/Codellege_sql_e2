import { useState } from 'react'
import PanelHeading from '../layout/PanelHeading'
import { createServiceAssignment } from '../../api/dashboardApi'

function ServicesView({ services, registrationOnly = false, employees = [], initialRecords = [] }) {
    if (registrationOnly) return <ServiceRegistration employees={employees} services={services} initialRecords={initialRecords} />
    const total = services.reduce((sum, service) => sum + Number(service.total_asistencias || 0), 0) || 1
    return <><section className="service-summary">{services.map((service) => <ServiceCard service={service} share={Math.round((Number(service.total_asistencias || 0) / total) * 100)} key={service.servicio} />)}</section><section className="panel service-analysis"><PanelHeading title="Uso por departamento" subtitle="Detecta si la prestación está concentrada en ciertas áreas" /><div className="service-columns">{services.map((service) => <article className="service-column" key={service.servicio}><div className="service-column-heading"><span className={`service-mark ${service.servicio === 'Masaje' ? 'massage' : 'physio'}`}>{service.servicio === 'Masaje' ? '✦' : '✚'}</span><div><h3>{service.servicio}</h3><p>{service.total_asistencias || 0} asistencias registradas</p></div></div>{service.departments.map((department) => <div className="service-department" key={department.departamento}><span>{department.departamento}</span><div className="progress"><i style={{ width: `${Number(service.total_asistencias) ? (Number(department.total_asistencias) / Number(service.total_asistencias)) * 100 : 0}%` }} /></div><b>{department.total_asistencias}</b><small>{department.empleados_usuarios} empleados</small></div>)}</article>)}</div></section><section className="panel insight-panel"><div className="insight-icon">✦</div><p className="eyebrow">LECTURA PARA LA DECISIÓN</p><h2>{services.length === 2 && Number(services[0].total_asistencias) !== Number(services[1].total_asistencias) ? `La demanda se inclina hacia ${Number(services[0].total_asistencias) >= Number(services[1].total_asistencias) ? services[0].servicio : services[1].servicio}` : 'La demanda está equilibrada'}</h2><p>Compara el porcentaje de empleados usuarios y los departamentos participantes antes de evaluar si conviene ampliar, ajustar o comunicar mejor la prestación.</p></section></>
}

function ServiceRegistration({ employees, services, initialRecords }) {
    const [employeeId, setEmployeeId] = useState('')
    const [employeeSearch, setEmployeeSearch] = useState('')
    const [serviceId, setServiceId] = useState('')
    const [date, setDate] = useState('2026-09-17')
    const [records, setRecords] = useState(initialRecords)
    const [message, setMessage] = useState('')
    const [saving, setSaving] = useState(false)
    const matchingEmployees = employees.filter((employee) => employee.nombre.toLowerCase().includes(employeeSearch.toLowerCase())).slice(0, 8)

    async function handleSubmit(event) {
        event.preventDefault()
        setMessage('')
        setSaving(true)
        try {
            const result = await createServiceAssignment({ idEmpleado: employeeId, idServicio: serviceId, fecha: date })
            const employee = employees.find((item) => item.id_empleado === Number(employeeId))
            const service = services.find((item) => item.id_servicio === Number(serviceId))
            setRecords([{ id_asistencia: result.id_asistencia, nombre: employee.nombre, departamento: employee.departamento, servicio: service.servicio, fecha: date }, ...records])
            setEmployeeId('')
            setEmployeeSearch('')
            setServiceId('')
            setMessage(result.message)
        } catch (error) {
            setMessage(error.message)
        } finally {
            setSaving(false)
        }
    }

    return <section className="service-registration"><article className="panel service-registration-form"><PanelHeading title="Registrar servicio" subtitle="Asigna un servicio a un empleado y controla su límite semanal." /><form className="service-form" onSubmit={handleSubmit}><label>Buscar empleado<div className="employee-search"><input value={employeeSearch} onChange={(event) => { setEmployeeSearch(event.target.value); setEmployeeId('') }} placeholder="Escribe el nombre del empleado" autoComplete="off" required />{employeeSearch && !employeeId && <div className="employee-results">{matchingEmployees.length ? matchingEmployees.map((employee) => <button type="button" key={employee.id_empleado} onClick={() => { setEmployeeId(String(employee.id_empleado)); setEmployeeSearch(employee.nombre) }}><strong>{employee.nombre}</strong><small>{employee.departamento}</small></button>) : <p>No se encontraron empleados.</p>}</div>}</div></label><label>Servicio<select value={serviceId} onChange={(event) => setServiceId(event.target.value)} required><option value="">Selecciona un servicio</option>{services.map((service) => <option value={service.id_servicio} key={service.id_servicio}>{service.servicio}</option>)}</select></label><label>Fecha<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><button className="export-btn service-submit" type="submit" disabled={saving || !employeeId}>{saving ? 'Guardando...' : 'Registrar servicio'}</button></form>{message && <p className="activity-message">{message}</p>}<p className="activity-rule">Cada empleado puede tener como máximo 2 servicios entre lunes y domingo.</p></article><article className="panel registered-activities"><PanelHeading title="Asignaciones recientes" subtitle="Historial de servicios registrados." /><div className="table-wrap"><table><thead><tr><th>EMPLEADO</th><th>DEPARTAMENTO</th><th>SERVICIO</th><th>FECHA</th></tr></thead><tbody>{records.map((record) => <tr key={record.id_asistencia}><td>{record.nombre}</td><td>{record.departamento}</td><td>{record.servicio}</td><td>{formatDate(record.fecha)}</td></tr>)}</tbody></table></div></article></section>
}

function formatDate(value) { const date = String(value).slice(0, 10).split('-'); return `${date[2]}/${date[1]}/${date[0]}` }

function ServiceCard({ service, share }) { return <article className="panel service-card"><div className={`service-mark ${service.servicio === 'Masaje' ? 'massage' : 'physio'}`}>{service.servicio === 'Masaje' ? '✦' : '✚'}</div><p className="eyebrow">SERVICIO</p><h2>{service.servicio}</h2><div className="service-stat"><strong>{service.total_asistencias || 0}</strong><span>asistencias</span></div><div className="service-meta"><span><b>{service.empleados_usuarios || 0}</b> empleados usuarios</span><span><b>{service.departamentos_usuarios || 0}</b> departamentos</span><span><b>{share}%</b> del uso total</span></div></article> }
export default ServicesView
