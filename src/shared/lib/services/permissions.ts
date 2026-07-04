// Models
import { Permission } from 'models/Permission.model'

import { baseFetch } from './api'

export const fetchGetPermissions = async (appCode: string) => {
  return await baseFetch({
    url: `/api/permissions/${appCode}`,
  })
}

export const fetchEditPermissions = async (
  appCode: string,
  roleCode: string,
  permissions: Array<{ permission_code: string; granted: boolean }>
) => {
  return await baseFetch({
    url: `/api/permissions/${appCode}`,
    data: { roleCode, permissions },
    method: 'PATCH',
  })
}

export const fetchEditPermission = async (
  appCode: string,
  permissionCode: string,
  permission: Permission
) => {
  return await baseFetch({
    url: '/api/permission/edit_permission',
    data: { appCode, permissionCode, permission },
    method: 'PUT',
  })
}

export const fetchDeletePermission = async (
  appCode: string,
  permissionCode: string
) => {
  return await baseFetch({
    url: '/api/permission/delete_permission',
    data: { appCode, permissionCode },
    method: 'DELETE',
  })
}

export const fetchAddPermission = async (
  appCode: string,
  permission: Permission
) => {
  return await baseFetch({
    url: '/api/permission/create_permission',
    data: { appCode, permission },
    method: 'POST',
  })
}
