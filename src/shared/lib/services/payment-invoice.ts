import { baseFetch } from './api'

export const fetchCreatePaymentInvoice = async (paymentInvoice: any) => {
  return await baseFetch({
    url: `/api/payment_invoice/${null}`,
    method: 'POST',
    data: { paymentInvoice },
  })
}

export const fetchUpdatePaymentInvoice = async (paymentInvoice: any) => {
  return await baseFetch({
    url: `/api/payment_invoice/${paymentInvoice.id}`,
    method: 'PUT',
    data: { paymentInvoice },
  })
}
