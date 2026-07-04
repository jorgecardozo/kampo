// /api/people
import * as api from 'lib/services/api'

const obtenerClientes = async (data) => {
  const payload = await api.fetchObtenerClientes(data)

  if (!payload) {
    return
  }

  return payload
}

const crearCliente = async (data) => {
  const payload = await api.fetchCrearCliente(data)

  if (!payload) {
    return
  }

  return payload
}

const actualizarCliente = async (data) => {
  const payload = await api.fetchActualizarCliente(data)

  if (!payload) {
    return
  }

  return payload
}

export { obtenerClientes, crearCliente, actualizarCliente }
