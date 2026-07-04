import * as api from 'lib/services/api'

const getUserInvoices = async (data) => {
  const payload = await api.fetchGetUserInvoices(data)

  if (!payload) {
    return
  }

  return payload
}

export { getUserInvoices }
