import * as api from 'lib/services/api'

const getHarvests = async (data) => {
  const payload = await api.fetchGetHarvests(data)

  if (!payload) {
    return
  }

  return payload
}

export { getHarvests }
