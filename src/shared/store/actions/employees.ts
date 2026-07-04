// /api/people
import * as api from 'lib/services/api'

const getEmployees = async (data) => {
  const payload = await api.fetchGetEmployees(data)

  if (!payload) {
    return
  }

  return payload
}

export { getEmployees }
