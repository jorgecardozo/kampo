import * as api from 'lib/services/api'

const getPaymentInvoices = async (data) => {
  const payload = await api.fetchGetPaymentInvoices(data)

  if (!payload) {
    return
  }

  return payload
}

export { getPaymentInvoices }
