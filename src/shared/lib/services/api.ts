export * from './requests'
export * from './profiles-and-access'
export * from './points-of-sales'
export * from './point-of-sale'
export * from './applications'
export * from './users'
export * from './request'
export * from './roles'
export * from './permissions'
export * from './user'
export * from './role'
export * from './application'
export * from './login'
export * from './employees'
export * from './employee'
export * from './baggings'
export * from './bagging-by-id'
export * from './bag-prices'
export * from './bag-price'
export * from './products'
export * from './bagging'
export * from './bag-types'
export * from './bag-type'
export * from './bag-sizes'
export * from './bag-size'
export * from './harvests'
export * from './harvest-by-id'
export * from './harvest'
export * from './harvest-prices'
export * from './harvest-price'
export * from './labor-units'
export * from './daily-prices'
export * from './daily-price'
export * from './daily-works'
export * from './daily-work-by-id'
export * from './daily-work'
export * from './farm-fields'
export * from './farm-field'
export * from './payment-invoices'
export * from './payment-invoice'
export * from './user-invoices'
export * from './usuarios'
export * from './cajas'
export * from './productos'
export * from './proveedores'
export * from './clientes'
export * from './movimientos-stock'
export * from './calidades'
export * from './lotes'
export * from './ventas'
export * from './stock'
export * from './medios_de_pago'

import { getCookie } from 'lib/utils/cookies'

type Params = {
  url: string
  data?: any
  method?: string
  headers?: any
  blob?: boolean
  json?: boolean
}

export const baseFetch = async (params: Params) => {
  const {
    url,
    data,
    method = 'GET',
    headers = {},
    json = true,
    blob = false,
  } = params
  const fetchHeaders = json ? { 'Content-Type': 'application/json' } : headers
  const jwtToken = getCookie('jwt')
  console.log('jwtToken', jwtToken)
  const result = await fetch(url, {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      ...fetchHeaders,
      Authorization: `Bearer ${jwtToken || null}`,
    },
    body: json ? JSON.stringify(data) : data,
  })

  return blob ? result.blob() : result.json()
}
