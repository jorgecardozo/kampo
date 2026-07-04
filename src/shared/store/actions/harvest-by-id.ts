// /api/people
import * as api from 'lib/services/api'

const getHarvestById = async (harvestId) => {
  const payload = await api.fetchGetHarvestById(harvestId)

  if (!payload) {
    return
  }

  return payload
}

export { getHarvestById }
