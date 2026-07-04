// /api/people
import * as api from 'lib/services/api'

const getHarvestPrices = async (data) => {
  const payload = await api.fetchGetHarvestPrices(data)

  if (!payload) {
    return
  }

  return payload
}

export { getHarvestPrices }
