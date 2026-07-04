import { baseFetch } from './api'

export const fetchObtenerStock = async (data) => {
  return await baseFetch({
    url: '/api/stock',
    method: 'POST',
    data: { data },
  })
}

export const fetchCrearStock = async (data) => {
  return await baseFetch({
    url: '/api/stock',
    method: 'POST',
    data: { data },
  })
}