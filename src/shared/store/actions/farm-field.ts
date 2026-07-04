import * as api from 'lib/services/api'

const createFarmField = async (farmField: any) => {
  const payload = await api.fetchCreateFarmField(farmField)

  if (!payload) {
    return
  }

  return payload
}

const updateFarmField = async (farmField: any) => {
  const payload = await api.fetchUpdateFarmField(farmField)

  if (!payload) {
    return
  }

  return payload
}

const deleteFarmField = async (farmFieldId) => {
  const payload = await api.fetchDeleteFarmField(farmFieldId)

  if (!payload) {
    return
  }

  return payload
}

export { createFarmField, updateFarmField, deleteFarmField }
