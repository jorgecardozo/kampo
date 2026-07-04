// Models
import { UserPermission } from './UserPermission.model'

export interface UserApplication {
  code: string
  userPermissions: Array<UserPermission>
  enabled: boolean
  last_update: string
  last_update_reason: string
  last_updated_by: string
}
