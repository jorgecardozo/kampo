// Models
import { Address } from './Address.model'
import { PhoneNumber } from './PhoneNumber.model'

export interface UserRequest {
  application?: string
  user_data: {
    id?: string
    email?: string
    redmine_email?: string
    first_name?: string
    last_name?: string
    cuitl?: string
    phone_number?: PhoneNumber
    address?: Address
    gender?: string
    birthday?: string
    status?: boolean
  }
}
