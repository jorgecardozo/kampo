import * as api from 'lib/services/api'

const createPaymentInvoice = async (paymentInvoice) => {
  const payload = await api.fetchCreatePaymentInvoice(paymentInvoice)

  if (!payload) {
    return
  }

  return payload
}

const updatePaymentInvoice = async (employee: any) => {
  const payload = await api.fetchUpdatePaymentInvoice(employee)

  if (!payload) {
    return
  }

  return payload
}

export { createPaymentInvoice, updatePaymentInvoice }
