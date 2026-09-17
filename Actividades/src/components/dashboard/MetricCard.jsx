function MetricCard({ icon, color, title, value, change }) {
    const isPositive = change.startsWith('↗')
    return <article className="metric-card"><div className={`metric-icon ${color}`}>{icon}</div><div><p>{title}</p><strong>{value}</strong><small className={isPositive ? 'positive' : 'neutral'}>{change} <em>vs. mes anterior</em></small></div></article>
}

export default MetricCard
