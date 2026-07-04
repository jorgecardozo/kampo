import * as api from 'lib/services/api'

const createHarvestPrice = async (harvestPrice: any) => {
  const payload = await api.fetchCreateHarvestPrice(harvestPrice)

  if (!payload) {
    return
  }

  return payload
}

const updateHarvestPrice = async (harvestPrice: any) => {
  const payload = await api.fetchUpdateHarvestPrice(harvestPrice)

  if (!payload) {
    return
  }

  return payload
}

const deleteHarvestPrice = async (harvestPriceId) => {
  const payload = await api.fetchDeleteHarvestPrice(harvestPriceId)

  if (!payload) {
    return
  }

  return payload
}

export { createHarvestPrice, updateHarvestPrice, deleteHarvestPrice }
