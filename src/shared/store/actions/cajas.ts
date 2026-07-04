// /api/people
import * as api from 'lib/services/api'

const obtenerCajas = async (data) => {
  const payload = await api.fetchObtenerCajas(data)

  if (!payload) {
    return
  }

  return payload
}

const crearCaja = async () => {
  const payload = await api.fetchCrearCaja()

  if (!payload) {
    return
  }

  return payload
}

const cerrarCaja = async (data) => {
  const payload = await api.fetchCerrarCaja(data)

  if (!payload) {
    return
  }

  return payload
}

export { obtenerCajas, crearCaja, cerrarCaja }
