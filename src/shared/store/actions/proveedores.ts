// /api/people
import * as api from 'lib/services/api'

const obtenerProveedores = async (data) => {
  const payload = await api.fetchObtenerProveedores(data)

  if (!payload) {
    return
  }

  return payload
}

const crearProveedor = async (data) => {
  const payload = await api.fetchCrearProveedor(data)

  if (!payload) {
    return
  }

  return payload
}

const actualizarProveedor = async (data) => {
  const payload = await api.fetchActualizarProveedor(data)

  if (!payload) {
    return
  }

  return payload
}

export { obtenerProveedores, crearProveedor, actualizarProveedor }
