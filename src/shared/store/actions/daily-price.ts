import * as api from 'lib/services/api'

const createDailyPrice = async (dailyPrice: any) => {
  const payload = await api.fetchCreateDailyPrice(dailyPrice)

  if (!payload) {
    return
  }

  return payload
}

const updateDailyPrice = async (dailyPrice: any) => {
  const payload = await api.fetchUpdateDailyPrice(dailyPrice)

  if (!payload) {
    return
  }

  return payload
}

const deleteDailyPrice = async (dailyPriceId) => {
  const payload = await api.fetchDeleteDailyPrice(dailyPriceId)

  if (!payload) {
    return
  }

  return payload
}

export { createDailyPrice, updateDailyPrice, deleteDailyPrice }
