// Models
import { Role } from 'models/Role.model'

// Services
import * as api from 'lib/services/api'

const addRole = async (appCode: string, role: Role) => {
  const payload = await api.fetchAddRole(appCode, role)
  if (!payload) {
    return
  }
  return payload
}

const editRole = async (appCode: string, role: Role) => {
  const payload = await api.fetchEditRole(appCode, role)
  if (!payload) {
    return
  }
  return payload
}

const deleteRole = async (appCode: string, role: Role) => {
  const payload = await api.fetchDeleteRole(appCode, role)
  if (!payload) {
    return
  }
  return payload
}

export { editRole, deleteRole, addRole }
