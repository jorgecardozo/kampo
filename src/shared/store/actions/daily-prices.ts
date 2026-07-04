import * as api from 'lib/services/api'

const getDailyPrices = async (data) => {
  const payload = await api.fetchGetDailyPrices(data)

  if (!payload) {
    return
  }

  return payload
}

export { getDailyPrices }
