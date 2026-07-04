// /api/people
import * as api from 'lib/services/api'

const getDailyWorks = async (data) => {
  const payload = await api.fetchGetDailyWorks(data)

  if (!payload) {
    return
  }

  return payload
}

export { getDailyWorks }
