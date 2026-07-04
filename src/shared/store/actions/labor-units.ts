import * as api from 'lib/services/api'

const getLaborUnits = async (data) => {
  const payload = await api.fetchGetLaborUnits(data)

  if (!payload) {
    return
  }

  return payload
}

export { getLaborUnits }
