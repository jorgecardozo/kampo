import * as api from 'lib/services/api'

const getDailyWorkById = async (dailyWorkId) => {
  const payload = await api.fetchGetDailyWorkById(dailyWorkId)

  if (!payload) {
    return
  }

  return payload
}

export { getDailyWorkById }
