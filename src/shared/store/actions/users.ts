// Models
import { Application } from 'models/Application.model'
import { User } from 'models/User.model'

import * as types from 'store/actionTypes'
import * as api from 'lib/services/api'

const getUsers = async (
  dispatch,
  code: string,
  page: number,
  size: number,
  query: string
) => {
  const payload = await api.fetchGetUsers(code, page, size, query)
  if (!payload) {
    return
  }
  dispatch({
    type: types.SET_USERS_BIS,
    payload: payload.data,
  })

  return payload
}

const setSelectedUser = async (dispatch, data: User) => {
  dispatch({
    type: types.SET_SELECTED_USER,
    payload: data,
  })
}

const setApplicationSelectedInUsers = async (
  dispatch,
  application: Application
) => {
  dispatch({
    type: types.SET_APPLICATION_SELECTED_IN_USERS,
    payload: application,
  })
}

const editUserPermissions = async (
  appCode: string,
  userId: string,
  permissions: Array<{ permission_code: string; granted: boolean }>
) => {
  const payload = await api.fetchEditUserPermissions(
    appCode,
    userId,
    permissions
  )
  if (!payload) {
    return
  }

  return payload
}

const downloadUsers = async (appCode: string, type: string) =>
  await api.fetchDownloadUsers(appCode, type)

export {
  getUsers,
  setSelectedUser,
  setApplicationSelectedInUsers,
  editUserPermissions,
  downloadUsers,
}
