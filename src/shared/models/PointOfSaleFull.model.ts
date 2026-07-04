// Models
import { Address } from './Address.model'
import { PhoneNumber } from './PhoneNumber.model'

export interface PointOfSaleFull {
  code?: number
  active?: boolean
  business_name?: string
  authorized_email?: string
  address?: Address
  phone_number?: PhoneNumber
  cuit?: string
  type?: string
  commercial_contact?: string
  officer?: string
  supervisor?: string
  manager?: string
  is_green_branch?: boolean
  zone?: string
}
