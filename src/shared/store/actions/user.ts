// Models
import { LoginUser } from 'models/LoginUser.model'
import { UserRequest } from 'models/UserRequest.model'
import { User } from 'models/User.model'

// Types
import * as types from 'store/actionTypes'

// Services
import * as api from 'lib/services/api'

const setUserData = (dispatch, data: LoginUser) => {
  dispatch({
    type: types.SET_USER_DATA,
    payload: data,
  })
}

const clearUserData = (dispatch) => {
  dispatch({
    type: types.CLEAR_USER_DATA,
  })
}

const addUser = async (data: UserRequest) => {
  const payload = await api.fetchAddUser(data)
  if (!payload) {
    return
  }
  return payload
}

const editUser = async (appCode: string, user: User) => {
  const payload = await api.fetchEditUser(appCode, user)
  if (!payload) {
    return
  }
  return payload
}

const setUserStatus = async (appCode: string, user: User) => {
  const payload = await api.fetchSetUserStatus(appCode, user)
  if (!payload) {
    return
  }
  return payload
}

const getUser = async (
  appCode: string,
  user: User,
  includePointsOfSale: boolean
) => {
  const payload = await api.fetchGetUser(appCode, user, includePointsOfSale)
  if (!payload) {
    return
  }
  return payload
}

const editUserPointsOfSales = async (
  request: User,
  pointOfSaleIds: Array<number>
) => {
  const payload = await api.fetchEditUserPointsOfSales(
    request.id,
    pointOfSaleIds
  )
  if (!payload) {
    return
  }
  return payload
}

const editUserRoles = async (
  appCode: string,
  userId: string | number,
  roles: Array<string>
) => {
  const payload = await api.fetchEditUserRoles(appCode, userId, roles)
  if (!payload) {
    return
  }

  return payload
}

const forwardEmail = async (email: string, applicationCode: string) => {
  const payload = await api.fetchForwardEmail(email, applicationCode)
  if (!payload) {
    return
  }

  return payload
}

export {
  setUserData,
  clearUserData,
  addUser,
  editUser,
  setUserStatus,
  getUser,
  editUserPointsOfSales,
  editUserRoles,
  forwardEmail,
}
