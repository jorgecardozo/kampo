// /api/people
import * as api from 'lib/services/api'

const getBagPrices = async (data) => {
  const payload = await api.fetchGetBagPrices(data)

  if (!payload) {
    return
  }

  return payload
}

export { getBagPrices }
