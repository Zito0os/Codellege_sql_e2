const apiUrl = 'http://localhost:3001/api'
const period = 'fechaInicio=2026-09-01&fechaFin=2026-09-30'

async function request(path) {
    const response = await fetch(`${apiUrl}${path}`)
    if (!response.ok) throw new Error('No fue posible cargar los datos del análisis.')
    return response.json()
}

export const getDashboard = () => request(`/dashboard?${period}`)
export const getAttendance = (department = '') => request(`/asistencias?${period}${department ? `&departamento=${encodeURIComponent(department)}` : ''}`)
export const getServices = () => request(`/servicios?${period}`)
export const getServiceRecords = () => request('/servicios/registro')
export const getAnalytics = ({ fechaInicio = '2026-09-01', fechaFin = '2026-09-30', departamento = '', servicio = '' } = {}) => request(`/analytics?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}${departamento ? `&departamento=${encodeURIComponent(departamento)}` : ''}${servicio ? `&servicio=${encodeURIComponent(servicio)}` : ''}`)

export async function createServiceAssignment(assignment) {
    const response = await fetch(`${apiUrl}/servicios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'No fue posible asignar el servicio.')
    return data
}
