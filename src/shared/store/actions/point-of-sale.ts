// Models
import { PointOfSaleFull } from 'models/PointOfSaleFull.model'

// Services
import * as api from 'lib/services/api'

const setPointOfSalesStatus = async (data: PointOfSaleFull) => {
  const payload = await api.fetchSetPointOfSaleStatus(data.code, data)
  if (!payload) {
    return
  }
  return payload
}

const editPointOfSale = async (data: PointOfSaleFull) => {
  const payload = await api.fetchEditPointOfSale(data.code, data)
  if (!payload) {
    return
  }
  return payload
}

const deletePointOfSale = async (data: PointOfSaleFull) => {
  const payload = await api.fetchDeletePointOfSale(data.code, data)
  if (!payload) {
    return
  }
  return payload
}

const addPointOfSale = async (data: PointOfSaleFull) => {
  const payload = await api.fetchAddPointOfSale(data)
  if (!payload) {
    return
  }
  return payload
}

export {
  setPointOfSalesStatus,
  editPointOfSale,
  deletePointOfSale,
  addPointOfSale,
}
