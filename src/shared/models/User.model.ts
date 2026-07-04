// Models
import { Address } from './Address.model'
import { PhoneNumber } from './PhoneNumber.model'
import { PointOfSaleFull } from './PointOfSaleFull.model'
import { UserApplication } from './UserApplication.model'

export interface User {
  id?: string
  email?: string
  redmine_email?: string
  first_name?: string
  last_name?: string
  application?: UserApplication
  points_of_sale?: PointOfSaleFull[]
  cuitl?: string
  address?: Address
  gender?: string
  birthdate?: string
  phone_number?: PhoneNumber
  status?: boolean
}
