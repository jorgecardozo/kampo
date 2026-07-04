// Models
import { PointOfSaleFull } from 'models/PointOfSaleFull.model'

// Services
import * as api from 'lib/services/api'

// Store
import * as types from 'store/actionTypes'

const getPointsOfSales = async (
  dispatch,
  page: number,
  size: number,
  query: string,
  active: boolean
) => {
  const payload = await api.getPointsOfSales(page, size, query, active)

  if (!payload) {
    return
  }
  dispatch({
    type: types.SET_POINTS_OF_SALES,
    payload: payload.data,
  })

  return payload
}

const setSelectedPointOfSale = async (dispatch, data: PointOfSaleFull) => {
  dispatch({
    type: types.SET_SELECTED_POINTS_OF_SALES,
    payload: data,
  })
}

const getPointsOfSalesCodes = async (query: string) => {
  const payload = await api.getPointsOfSalesCodes(query)

  if (!payload) {
    return
  }

  return payload
}

const downloadPointsOfSale = async (type: string) =>
  await api.fetchDownloadPointsOfSale(type)

export {
  getPointsOfSales,
  setSelectedPointOfSale,
  getPointsOfSalesCodes,
  downloadPointsOfSale,
}
