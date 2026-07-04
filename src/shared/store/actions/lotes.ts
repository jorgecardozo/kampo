// /api/people
import * as api from 'lib/services/api'

const obtenerLotes = async (data) => {
  const payload = await api.fetchObtenerLotes(data)

  if (!payload) {
    return
  }

  return payload
}

const obtenerEstadoLotes = async (data) => {
  const payload = await api.fetchObtenerEstadoLotes(data)

  if (!payload) {
    return
  }

  return payload
}

const obtenerOperativoLotes = async (data) => {
  const payload = await api.fetchObtenerOperativoLotes(data)

  if (!payload) {
    return
  }

  return payload
}

const dividirLote = async (data) => {
  const payload = await api.fetchDividirLote(data)

  if (!payload) {
    return
  }

  return payload
}


export { obtenerLotes, dividirLote, obtenerEstadoLotes, obtenerOperativoLotes }
