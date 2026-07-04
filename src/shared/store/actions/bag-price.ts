import * as api from 'lib/services/api'

const createBagPrice = async (bagPrice: any) => {
  const payload = await api.fetchCreateBagPrice(bagPrice)

  if (!payload) {
    return
  }

  return payload
}

const updateBagPrice = async (bagPrice: any) => {
  const payload = await api.fetchUpdateBagPrice(bagPrice)

  if (!payload) {
    return
  }

  return payload
}

const deleteBagPrice = async (bagPriceId) => {
  const payload = await api.fetchDeleteBagPrice(bagPriceId)

  if (!payload) {
    return
  }

  return payload
}

export { createBagPrice, updateBagPrice, deleteBagPrice }
