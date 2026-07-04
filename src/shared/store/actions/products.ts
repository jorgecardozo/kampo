// /api/people
import * as api from 'lib/services/api'

const getProducts = async (page, size, query) => {
  const payload = await api.fetchGetProducts(page, size, query)

  if (!payload) {
    return
  }

  return payload
}

export { getProducts }
