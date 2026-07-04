import { baseFetch } from './api'

export const fetchObtenerProveedores = async (data) => {
  return await baseFetch({
    url: `/api/proveedores`,
    method: 'POST',
    data: { data },
  })
}

export const fetchCrearProveedor = async (data) => {
  return await baseFetch({
    url: `/api/proveedor`,
    method: 'POST',
    data: { data },
  })
}

export const fetchActualizarProveedor = async (data) => {
  return await baseFetch({
    url: `/api/proveedor`,
    method: 'PUT',
    data: { data },
  })
}
