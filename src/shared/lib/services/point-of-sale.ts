import { baseFetch } from './api'

export const fetchSetPointOfSaleStatus = async (id, data) => {
  return await baseFetch({
    url: `/api/point_of_sale/${id}`,
    data: data,
    method: 'POST',
  })
}

export const fetchEditPointOfSale = async (id, data) => {
  return await baseFetch({
    url: `/api/point_of_sale/${id}`,
    data: data,
    method: 'PUT',
  })
}

export const fetchDeletePointOfSale = async (id, data) => {
  return await baseFetch({
    url: `/api/point_of_sale/${id}`,
    data: data,
    method: 'DELETE',
  })
}

export const fetchAddPointOfSale = async (data) => {
  return await baseFetch({
    url: '/api/point_of_sale/add_point_of_sale',
    data: data,
    method: 'POST',
  })
}
