import { baseFetch } from './api'

export const fetchObtenerClientes = async (data) => {
  return await baseFetch({
    url: `/api/clientes`,
    method: 'POST',
    data: { data },
  })
}

export const fetchCrearCliente = async (data) => {
  return await baseFetch({
    url: `/api/cliente`,
    method: 'POST',
    data: { data },
  })
}

export const fetchActualizarCliente = async (data) => {
  return await baseFetch({
    url: `/api/cliente`,
    method: 'PUT',
    data: { data },
  })
}
