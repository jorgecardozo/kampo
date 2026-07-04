import { baseFetch } from './api'

export const fetchObtenerMovimientosStock = async (data) => {
  return await baseFetch({
    url: `/api/stock`,
    method: 'POST',
    data: { data },
  })
}
