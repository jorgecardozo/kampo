// /api/people
import * as api from 'lib/services/api'

const obtenerCalidades = async (data) => {
  const payload = await api.fetchObtenerCalidades(data)

  if (!payload) {
    return
  }

  return payload
}

const crearCalidad = async (data) => {
  const payload = await api.fetchCrearCalidad(data)

  if (!payload) {
    return
  }

  return payload
}

const editarCalidad = async (data) => {
  const payload = await api.fetchEditarCalidad(data)

  if (!payload) {
    return
  }

  return payload
}

const cambiarEstadoCalidad = async (data) => {
  const payload = await api.fetchCambiarEstadoCalidad(data)

  if (!payload) {
    return
  }

  return payload
}


export { obtenerCalidades, editarCalidad, cambiarEstadoCalidad, crearCalidad }
