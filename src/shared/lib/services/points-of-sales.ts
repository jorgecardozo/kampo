import { baseFetch } from './api'

export const getPointsOfSales = async (
  page: number,
  size: number,
  query: string,
  active: boolean
) => {
  return await baseFetch({
    method: 'POST',
    url: '/api/points-of-sales/get_points_of_sales',
    data: { page, size, query, active },
  })
}

export const getPointsOfSalesCodes = async (query: string) => {
  return await baseFetch({
    method: 'POST',
    url: '/api/points-of-sales/get_points_of_sales_codes',
    data: { query },
  })
}

export const fetchDownloadPointsOfSale = async (type: string) => {
  return await baseFetch({
    url: '/api/points-of-sales/download_points_of_sale',
    data: { type },
    method: 'POST',
    blob: true,
  })
}
