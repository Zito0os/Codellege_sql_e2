function PlaceholderView({ view, onBack }) {
    return <section className="panel placeholder-panel"><div className="insight-icon">✦</div><h2>{view}</h2><p>Esta vista está preparada para conectarse con los datos reales del backend.</p><button className="link-button" onClick={onBack}>Volver al resumen →</button></section>
}

export default PlaceholderView
