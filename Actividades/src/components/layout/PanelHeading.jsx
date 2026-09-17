function PanelHeading({ title, subtitle }) {
    return <div className="panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="more" aria-label={`Más opciones de ${title}`}>•••</button></div>
}

export default PanelHeading
