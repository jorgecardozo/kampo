import * as api from 'lib/services/api'

const getBagTypes = async (data) => {
  const payload = await api.fetchGetBagTypes(data)

  if (!payload) {
    return
  }

  return payload
}

export { getBagTypes }
