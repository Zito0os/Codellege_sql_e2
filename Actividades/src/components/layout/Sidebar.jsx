const navigationItems = [['Resumen', '⌂'], ['Asistencias', '◷'], ['Empleados', '♙'], ['Servicios', '◈'], ['Registro de servicios', '＋']]

function Sidebar({ activeView, onViewChange }) {
    return <aside className="sidebar"><div className="brand"><span className="brand-mark">+</span>Vitalia<span className="brand-dot">.</span></div><p className="workspace-label">CENTRO DE BIENESTAR</p><nav aria-label="Navegación principal">{navigationItems.map(([label, icon]) => <button className={activeView === label ? 'nav-item active' : 'nav-item'} onClick={() => onViewChange(label)} key={label}><span className="icon">{icon}</span>{label}</button>)}</nav><div className="sidebar-bottom"><button className="nav-item"><span className="icon">⚙</span>Configuración</button><div className="profile"><div className="avatar">JD</div><div><strong>Juan Díaz</strong><small>Administrador</small></div><span>⌄</span></div></div></aside>
}

export default Sidebar
