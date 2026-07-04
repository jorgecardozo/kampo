// Models
import { User } from './User.model'

export interface Approval {
  id?: string
  metadata?: string
  application?: string
  date?: string
  user_data?: User
}
