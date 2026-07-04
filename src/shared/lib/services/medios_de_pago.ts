import { baseFetch } from './api'

export const fetchObtenerMediosDePago = async (data) => {
  return await baseFetch({
    url: '/api/medios_de_pago',
    method: 'POST',
    data: { data },
  })
}

export const fetchCrearMedioDePago = async (data) => {
  return await baseFetch({
    url: '/api/medios_de_pago',
    method: 'POST',
    data: { data },
  })
}

export const fetchEditarMedioDePago = async (data) => {
  return await baseFetch({
    url: '/api/medios_de_pago',
    method: 'PUT',
    data: { data },
  })
}

export const fetchCambiarEstadoMedioDePago = async (data) => {
  return await baseFetch({
    url: '/api/medios_de_pago/cambiar_estado',
    method: 'PUT',
    data: { data },
  })
}
