// /api/people
import * as api from 'lib/services/api'

const obtenerProductos = async (data) => {
  const payload = await api.fetchObtenerProductos(data)

  if (!payload) {
    return
  }

  return payload
}

const crearProducto = async (data) => {
  const payload = await api.fetchCrearProducto(data)

  if (!payload) {
    return
  }

  return payload
}

const actualizarProducto = async (data) => {
  const payload = await api.fetchActualizarProducto(data)

  if (!payload) {
    return
  }

  return payload
}

export { obtenerProductos, crearProducto, actualizarProducto }
