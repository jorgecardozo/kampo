// /api/people
import * as api from 'lib/services/api'

const createBagSize = async (bagSize: any) => {
  const payload = await api.fetchCreateBagSize(bagSize)

  if (!payload) {
    return
  }

  return payload
}

const updateBagSize = async (bagSize: any) => {
  const payload = await api.fetchUpdateBagSize(bagSize)

  if (!payload) {
    return
  }

  return payload
}

const deleteBagSize = async (bagSizeId) => {
  const payload = await api.fetchDeleteBagSize(bagSizeId)

  if (!payload) {
    return
  }

  return payload
}

export { createBagSize, updateBagSize, deleteBagSize }
