import { Permission } from './Permission.model'

export interface UserPermission {
  permission: Permission
  granted: boolean
}
