import { baseFetch } from './api'

export const fetchObtenerLotes = async (data) => {
  return await baseFetch({
    url: '/api/lotes',
    method: 'POST',
    data: { data },
  })
}

export const fetchObtenerEstadoLotes = async (data) => {
  return await baseFetch({
    url: '/api/lotes/estado',
    method: 'POST',
    data: { data },
  })
}

export const fetchObtenerOperativoLotes = async (data) => {
  return await baseFetch({
    url: '/api/lotes/operativo',
    method: 'POST',
    data: { data },
  })
}

export const fetchDividirLote = async (data) => {
  return await baseFetch({
    url: '/api/lotes/dividir',
    method: 'POST',
    data: { data },
  })
}
