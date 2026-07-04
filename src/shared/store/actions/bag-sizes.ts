import * as api from 'lib/services/api'

const getBagSizes = async (data) => {
  const payload = await api.fetchGetBagSizes(data)

  if (!payload) {
    return
  }

  return payload
}

export { getBagSizes }
