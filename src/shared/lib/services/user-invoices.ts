import { baseFetch } from './api'

export const fetchGetUserInvoices = async (data) => {
  const { user } = data
  return await baseFetch({
    url: `/api/user_invoices/${user}`,
  })
}
