// Models
import { User } from 'models/User.model'
import { UserRequest } from 'models/UserRequest.model'

import { baseFetch } from './api'

export const fetchAddUser = async (user: UserRequest) => {
  return await baseFetch({
    url: '/api/user/add_user',
    data: user,
    method: 'POST',
  })
}

export const fetchEditUser = async (appCode: string, user: User) => {
  return await baseFetch({
    url: `/api/user/${appCode}/edit_user`,
    data: user,
    method: 'PUT',
  })
}

export const fetchSetUserStatus = async (appCode: string, user: User) => {
  return await baseFetch({
    url: `/api/user/${appCode}/set_status`,
    data: user,
    method: 'PATCH',
  })
}

export const fetchGetUser = async (
  appCode: string,
  user: User,
  includePointsOfSale: boolean
) => {
  return await baseFetch({
    url: `/api/user/${appCode}/get_user`,
    data: { user, includePointsOfSale },
    method: 'POST',
  })
}

export const fetchEditUserPointsOfSales = async (
  id: string,
  pointOfSaleIds: Array<number>
) => {
  return await baseFetch({
    url: '/api/user/edit_user_points_of_sales',
    data: { id, pointOfSaleIds },
    method: 'POST',
  })
}

export const fetchEditUserRoles = async (
  appCode: string,
  userId: string | number,
  roles: Array<string>
) => {
  return await baseFetch({
    url: '/api/user/edit_user_roles',
    data: { appCode, userId, roles },
    method: 'PUT',
  })
}

export const fetchForwardEmail = async (
  email: string,
  applicationCode: string
) => {
  return await baseFetch({
    url: '/api/user/forward_email',
    data: { email, applicationCode },
    method: 'POST',
  })
}
