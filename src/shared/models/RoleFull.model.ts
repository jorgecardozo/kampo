// Models
import { UserPermission } from './UserPermission.model'

export interface RoleFull {
  code?: string
  description?: string
  permissions: Array<UserPermission>
}
