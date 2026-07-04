import * as api from 'lib/services/api'

const createDailyWork = async (dailyWork: any) => {
  const payload = await api.fetchCreateDailyWork(dailyWork)

  if (!payload) {
    return
  }

  return payload
}

const updateDailyWork = async (dailyWork: any) => {
  const payload = await api.fetchUpdateDailyWork(dailyWork)

  if (!payload) {
    return
  }

  return payload
}

const deleteDailyWork = async (dailyWorkId) => {
  const payload = await api.fetchDeleteDailyWork(dailyWorkId)

  if (!payload) {
    return
  }

  return payload
}

export { createDailyWork, updateDailyWork, deleteDailyWork }
