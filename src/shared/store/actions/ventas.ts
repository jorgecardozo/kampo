// /api/people
import * as api from 'lib/services/api'

const obtenerVentas = async (data) => {
  const payload = await api.fetchObtenerVentas(data)

  if (!payload) {
    return
  }

  return payload
}

const anularVenta = async (data) => {
  const payload = await api.fetchAnularVenta(data)

  if (!payload) {
    return
  }

  return payload
}


export { obtenerVentas, anularVenta }
