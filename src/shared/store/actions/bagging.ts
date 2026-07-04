// /api/people
import * as api from 'lib/services/api'

const createBagging = async (bagging: any) => {
  const payload = await api.fetchCreateBagging(bagging)

  if (!payload) {
    return
  }

  return payload
}

const updateBagging = async (bagging: any) => {
  const payload = await api.fetchUpdateBagging(bagging)

  if (!payload) {
    return
  }

  return payload
}

const deleteBagging = async (baggingId) => {
  const payload = await api.fetchDeleteBagging(baggingId)

  if (!payload) {
    return
  }

  return payload
}

export { createBagging, updateBagging, deleteBagging }
