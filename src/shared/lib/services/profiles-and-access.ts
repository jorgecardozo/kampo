import { baseFetch } from './api'

const BASE_DOCUMENTATION = '/api/profiles-and-access'

export const uploadDocumentPointsOfSales = async ({ data }) =>
  await baseFetch({
    url: `${BASE_DOCUMENTATION}/upload-points-of-sales`,
    data,
    method: 'POST',
    json: false,
  })

export const uploadDocumentUsers = async ({ data }) =>
  await baseFetch({
    url: `${BASE_DOCUMENTATION}/upload-users`,
    data,
    method: 'POST',
    json: false,
  })

export const downloadDocumentPointOfSale = async () => {
  return await baseFetch({
    url: `${BASE_DOCUMENTATION}/download-point-of-sale`,
    blob: true,
  })
}

export const downloadDocumentUser = async () => {
  return await baseFetch({
    url: `${BASE_DOCUMENTATION}/download-user`,
    blob: true,
  })
}
