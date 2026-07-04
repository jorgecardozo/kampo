// Models
import { Permission } from './Permission.model'
import { Role } from './Role.model'

export interface Application {
  code?: string
  description?: string
  permissions?: Permission[]
  roles?: Role[]
  creationDate?: Date
  active?: boolean
  requires_approval?: boolean
}
