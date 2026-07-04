// /api/people
import * as api from 'lib/services/api'

const getBaggingById = async (baggingId) => {
  const payload = await api.fetchGetBaggingById(baggingId)

  if (!payload) {
    return
  }

  return payload
}

export { getBaggingById }
