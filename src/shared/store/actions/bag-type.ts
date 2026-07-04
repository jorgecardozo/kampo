// /api/people
import * as api from 'lib/services/api'

const createBagType = async (bagType: any) => {
  const payload = await api.fetchCreateBagType(bagType)

  if (!payload) {
    return
  }

  return payload
}

const updateBagType = async (bagType: any) => {
  const payload = await api.fetchUpdateBagType(bagType)

  if (!payload) {
    return
  }

  return payload
}

const deleteBagType = async (bagTypeId) => {
  const payload = await api.fetchDeleteBagType(bagTypeId)

  if (!payload) {
    return
  }

  return payload
}

export { createBagType, updateBagType, deleteBagType }
