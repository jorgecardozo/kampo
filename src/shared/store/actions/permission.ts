// Models
import { Permission } from 'models/Permission.model'

// Services
import * as api from 'lib/services/api'

const editPermission = async (
  appCode: string,
  permissionCode: string,
  permission: Permission
) => {
  const payload = await api.fetchEditPermission(
    appCode,
    permissionCode,
    permission
  )
  if (!payload) {
    return
  }
  return payload
}

const deletePermission = async (appCode: string, permissionCode: string) => {
  const payload = await api.fetchDeletePermission(appCode, permissionCode)
  if (!payload) {
    return
  }
  return payload
}

const addPermission = async (appCode: string, permission: Permission) => {
  const payload = await api.fetchAddPermission(appCode, permission)
  if (!payload) {
    return
  }
  return payload
}

export { editPermission, deletePermission, addPermission }
