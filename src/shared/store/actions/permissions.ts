import * as api from 'lib/services/api'
import * as types from 'store/actionTypes'

const getPermissions = async (dispatch, appCode: string) => {
  const payload = await api.fetchGetPermissions(appCode)

  if (!payload) {
    return
  }

  dispatch({
    type: types.SET_PERMISSIONS,
    payload: payload?.permissions,
  })

  return payload?.permissions
}

const editPermissions = async (
  appCode: string,
  roleCode: string,
  permissions: Array<{ permission_code: string; granted: boolean }>
) => {
  const payload = await api.fetchEditPermissions(appCode, roleCode, permissions)
  if (!payload) {
    return
  }

  return payload
}

export { getPermissions, editPermissions }
