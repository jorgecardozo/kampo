import * as api from 'lib/services/api'

const createHarvest = async (harvest: any) => {
  const payload = await api.fetchCreateHarvest(harvest)

  if (!payload) {
    return
  }

  return payload
}

const updateHarvest = async (harvest: any) => {
  const payload = await api.fetchUpdateHarvest(harvest)

  if (!payload) {
    return
  }

  return payload
}

const deleteHarvest = async (harvestId) => {
  const payload = await api.fetchDeleteHarvest(harvestId)

  if (!payload) {
    return
  }

  return payload
}

export { createHarvest, updateHarvest, deleteHarvest }
