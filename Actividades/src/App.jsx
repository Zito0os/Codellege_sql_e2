import { useEffect, useState } from 'react'
import './App.css'
import { getAttendance, getDashboard, getServices, getServiceRecords } from './api/dashboardApi'
import AttendanceView from './components/attendance/AttendanceView'
import DashboardOverview from './components/dashboard/DashboardOverview'
import Sidebar from './components/layout/Sidebar'
import ServicesView from './components/services/ServicesView'

const initialData = { dashboard: null, attendance: { employees: [], departments: [] }, services: [], serviceRecords: [] }

function App() {
    const [activeView, setActiveView] = useState('Resumen')
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([getDashboard(), getAttendance(), getServices(), getServiceRecords()])
            .then(([dashboard, attendance, services, serviceRecords]) => setData({ dashboard, attendance, services: services.services || [], serviceRecords: serviceRecords.records || [] }))
            .catch((requestError) => setError(requestError.message))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="app-shell">
            <Sidebar activeView={activeView} onViewChange={setActiveView} />
            <main className="main-content">
                <header className="topbar"><div className="mobile-brand">Vitalia<span className="brand-dot">.</span></div><div className="top-actions"><button className="notification" aria-label="Notificaciones">♢<span /></button><div className="avatar small">JD</div></div></header>
                <section className="page-heading"><div><p className="eyebrow">MIÉRCOLES, 17 DE SEPTIEMBRE DE 2026</p><h1>{activeView === 'Resumen' ? 'Resumen general' : activeView}</h1><p className="subtitle">{activeView === 'Asistencias' ? 'Consulta el uso de la prestación por empleado y departamento.' : activeView === 'Servicios' ? 'Compara qué servicio se usa más y quiénes lo aprovechan.' : 'Conoce el comportamiento de los usuarios y el rendimiento de tus servicios.'}</p></div><button className="export-btn">⇩ &nbsp;Exportar reporte</button></section>
                <div className="period-bar"><span>Periodo de análisis</span><span className="period">1 sep - 30 sep 2026</span><span className="updated">● Datos actualizados hace 5 min</span></div>
                {error && <section className="panel placeholder-panel"><h2>Error al cargar datos</h2><p>{error}</p></section>}
                {loading ? <section className="panel placeholder-panel"><h2>Cargando métricas...</h2><p>Consultando los registros de MySQL.</p></section> : activeView === 'Resumen' ? <DashboardOverview dashboard={data.dashboard} /> : activeView === 'Asistencias' ? <AttendanceView data={data.attendance} /> : activeView === 'Servicios' ? <ServicesView services={data.services} /> : activeView === 'Registro de servicios' ? <ServicesView registrationOnly employees={data.attendance.employees} services={data.services} initialRecords={data.serviceRecords} /> : <DashboardOverview dashboard={data.dashboard} />}
            </main>
        </div>
    )
}

export default App
