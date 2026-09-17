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
