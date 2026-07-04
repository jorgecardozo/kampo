import { baseFetch } from './api'

export const fetchObtenerProductos = async (data) => {
  return await baseFetch({
    url: `/api/productos`,
    method: 'POST',
    data: { data },
  })
}

export const fetchCrearProducto = async (data) => {
  return await baseFetch({
    url: `/api/producto`,
    method: 'POST',
    data: { data },
  })
}

export const fetchActualizarProducto = async (data) => {
  return await baseFetch({
    url: `/api/producto`,
    method: 'PUT',
    data: { data },
  })
}
