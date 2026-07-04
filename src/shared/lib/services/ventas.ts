import { baseFetch } from './api'

export const fetchObtenerVentas = async (data) => {
  return await baseFetch({
    url: '/api/ventas',
    method: 'POST',
    data: { data },
  })
}

export const fetchAnularVenta = async (data) => {
  return await baseFetch({
    url: '/api/ventas/anular',
    method: 'POST',
    data: { data },
  })
}