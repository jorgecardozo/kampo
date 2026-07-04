// /api/people
import * as api from 'lib/services/api'

const obtenerMediosDePago = async (data) => {
  const payload = await api.fetchObtenerMediosDePago(data)

  if (!payload) {
    return
  }

  return payload
}

const crearMedioDePago = async (data) => {
  const payload = await api.fetchCrearMedioDePago(data)

  if (!payload) {
    return
  }

  return payload
}

const editarMedioDePago = async (data) => {
  const payload = await api.fetchEditarMedioDePago(data)

  if (!payload) {
    return
  }

  return payload
}

const cambiarEstadoMedioDePago = async (data) => {
  const payload = await api.fetchCambiarEstadoMedioDePago(data)

  if (!payload) {
    return
  }

  return payload
}


export { obtenerMediosDePago, editarMedioDePago, cambiarEstadoMedioDePago, crearMedioDePago }
