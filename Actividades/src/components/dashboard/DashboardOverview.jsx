import { departments } from '../../data/dashboardData'
import PanelHeading from '../layout/PanelHeading'
import MetricCard from './MetricCard'

function DashboardOverview() {
    return <><section className="metrics-grid"><MetricCard icon="♙" color="lilac" title="Usuarios registrados" value="200" change="↗ 12.4%" /><MetricCard icon="◷" color="peach" title="Asistencias totales" value="326" change="↗ 8.7%" /><MetricCard icon="✦" color="mint" title="Uso de servicios" value="81.5%" change="↗ 4.2%" /><MetricCard icon="⌁" color="blue" title="Empleados activos" value="124" change="— 0.8%" /></section><section className="charts-grid"><UsageChart /><DistributionChart /></section><section className="bottom-grid"><article className="panel"><PanelHeading title="Uso por departamento" subtitle="Asistencias registradas por área" /><div className="department-list">{departments.map(([name, value, percentage]) => <div className="department-row" key={name}><span>{name}</span><div className="progress"><i style={{ width: `${value}%` }} /></div><b>{percentage}</b></div>)}</div></article><article className="panel insight-panel"><div className="insight-icon">✦</div><p className="eyebrow">HALLAZGO PRINCIPAL</p><h2>El masaje es el servicio más solicitado</h2><p>Representa el <strong>56.4%</strong> de las asistencias del periodo. Considera ampliar los horarios disponibles.</p><button className="link-button">Explorar análisis →</button></article></section></>
}

function UsageChart() {
    return <article className="panel usage-panel"><PanelHeading title="Uso de servicios" subtitle="Comparativa de asistencias durante el mes" /><div className="legend"><span><i className="dot massage" />Masaje <b>184</b></span><span><i className="dot physio" />Fisioterapia <b>142</b></span></div><div className="chart"><div className="y-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-area"><div className="grid-lines"><i /><i /><i /><i /><i /></div><div className="bars">{[55, 70, 42, 78, 64, 86, 60, 73, 68, 92, 78, 84].map((height, index) => <div className="bar-group" key={index}><div className="bar massage" style={{ height: `${height * 0.72}px` }} /><div className="bar physio" style={{ height: `${height * 0.55}px` }} /><small>{index * 2 + 1}</small></div>)}</div></div></div><div className="chart-foot"><span>Sep 2026</span><span>1 sep — 30 sep</span></div></article>
}

function DistributionChart() {
    return <article className="panel distribution-panel"><PanelHeading title="Distribución de usuarios" subtitle="Preferencia por servicio" /><div className="donut-wrap"><div className="donut"><div><strong>200</strong><small>usuarios</small></div></div></div><div className="distribution-list"><div><i className="dot massage" />Solo masaje <b>96 <small>48%</small></b></div><div><i className="dot physio" />Solo fisioterapia <b>62 <small>31%</small></b></div><div><i className="dot both" />Ambos servicios <b>42 <small>21%</small></b></div></div></article>
}

export default DashboardOverview
