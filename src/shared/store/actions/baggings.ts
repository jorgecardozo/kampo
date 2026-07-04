// /api/people
import * as api from 'lib/services/api'

const getBaggings = async (data) => {
  const payload = await api.fetchGetBaggings(data)

  if (!payload) {
    return
  }

  return payload
}

export { getBaggings }
