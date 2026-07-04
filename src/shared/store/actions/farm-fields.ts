import * as api from 'lib/services/api'

const getFarmFields = async (data) => {
  const payload = await api.fetchGetFarmFields(data)

  if (!payload) {
    return
  }

  return payload
}

export { getFarmFields }
