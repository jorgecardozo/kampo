import { baseFetch } from './api'

export const fetchGetPaymentInvoices = async (data) => {
  const { paymentInvoiceType } = data
  return await baseFetch({
    url: `/api/payment_invoices/${paymentInvoiceType}`,
    method: 'POST',
    data: { data },
  })
}
