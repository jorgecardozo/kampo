import { baseFetch } from './api'

export const fetchObtenerCajas = async (data) => {
  return await baseFetch({
    url: `/api/cajas`,
    method: 'POST',
    data: { data },
  })
}

export const fetchCrearCaja = async () => {
  return await baseFetch({
    url: `/api/caja`,
    method: 'POST',
  })
}

export const fetchCerrarCaja = async (data) => {
  return await baseFetch({
    url: `/api/caja`,
    method: 'POST',
    data: { data },
  })
}
