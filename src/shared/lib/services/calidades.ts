import { baseFetch } from './api'

export const fetchObtenerCalidades = async (data) => {
  return await baseFetch({
    url: '/api/calidades',
    method: 'POST',
    data: { data },
  })
}

export const fetchCrearCalidad = async (data) => {
  return await baseFetch({
    url: '/api/calidades',
    method: 'POST',
    data: { data },
  })
}

export const fetchEditarCalidad = async (data) => {
  return await baseFetch({
    url: '/api/calidades',
    method: 'PUT',
    data: { data },
  })
}

export const fetchCambiarEstadoCalidad = async (data) => {
  return await baseFetch({
    url: '/api/calidades/cambiar_estado',
    method: 'PUT',
    data: { data },
  })
}
