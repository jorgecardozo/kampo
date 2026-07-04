import * as api from 'lib/services/api'
import * as types from 'store/actionTypes'

const uploadDocumentPointsOfSales = async (dispatch, data) => {
  const payload = await api.uploadDocumentPointsOfSales(data)
  if (!payload) {
    return
  }
  dispatch({
    type: types.SET_POINTS_OF_SALES_MVP,
    payload: payload,
  })

  return payload
}

const uploadDocumentUsers = async (dispatch, data) => {
  const payload = await api.uploadDocumentUsers(data)
  if (!payload) {
    return
  }

  dispatch({
    type: types.SET_USERS_MVP,
    payload: payload,
  })

  return payload
}

const downloadDocumentPointOfSale = async () =>
  await api.downloadDocumentPointOfSale()

const downloadDocumentUser = async () => await api.downloadDocumentUser()

export {
  uploadDocumentPointsOfSales,
  uploadDocumentUsers,
  downloadDocumentPointOfSale,
  downloadDocumentUser,
}
