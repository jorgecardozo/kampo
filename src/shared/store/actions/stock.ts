// /api/people
import * as api from 'lib/services/api'

const obtenerStock = async (data) => {
  const payload = await api.fetchObtenerStock(data)

  if (!payload) {
    return
  }

  return payload
}

const crearStock = async (data) => {
  const payload = await api.fetchCrearStock(data)

  if (!payload) {
    return
  }

  return payload
}

export { obtenerStock, crearStock }
