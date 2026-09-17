import { useState } from 'react'
import './App.css'
import ActivityPanel from './components/activity/ActivityPanel'
import DashboardOverview from './components/dashboard/DashboardOverview'
import PlaceholderView from './components/layout/PlaceholderView'
import Sidebar from './components/layout/Sidebar'

function App() {
    const [activeView, setActiveView] = useState('Resumen')

    return (
        <div className="app-shell">
            <Sidebar activeView={activeView} onViewChange={setActiveView} />
            <main className="main-content">
                <header className="topbar">
                    <div className="mobile-brand">Vitalia<span className="brand-dot">.</span></div>
                    <div className="top-actions"><button className="notification" aria-label="Notificaciones">♢<span /></button><div className="avatar small">JD</div></div>
                </header>
                <section className="page-heading"><div><p className="eyebrow">MIÉRCOLES, 17 DE SEPTIEMBRE DE 2026</p><h1>Resumen general</h1><p className="subtitle">Conoce el comportamiento de los usuarios y el rendimiento de tus servicios.</p></div><button className="export-btn">⇩ &nbsp;Exportar reporte</button></section>
                <div className="period-bar"><span>Periodo de análisis</span><button className="period">Este mes <span>⌄</span></button><span className="updated">● Datos actualizados hace 5 min</span></div>
                {activeView === 'Resumen' ? <DashboardOverview /> : <PlaceholderView view={activeView} onBack={() => setActiveView('Resumen')} />}
                <ActivityPanel />
            </main>
        </div>
    )
}

export default App
