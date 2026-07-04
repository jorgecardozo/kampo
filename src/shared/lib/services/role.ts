// Models
import { Role } from 'models/Role.model'

import { baseFetch } from './api'

export const fetchAddRole = async (appCode: string, role: Role) => {
  return await baseFetch({
    url: `/api/role/${appCode}`,
    data: role,
    method: 'POST',
  })
}

export const fetchEditRole = async (appCode: string, role: Role) => {
  return await baseFetch({
    url: `/api/role/${appCode}`,
    data: role,
    method: 'PUT',
  })
}

export const fetchDeleteRole = async (appCode: string, role: Role) => {
  return await baseFetch({
    url: `/api/role/${appCode}`,
    data: role,
    method: 'DELETE',
  })
}
