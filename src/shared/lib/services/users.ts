import { baseFetch } from './api'

export const fetchGetUsers = async (
  code: string,
  page: number,
  size: number,
  query: string
) => {
  return await baseFetch({
    method: 'POST',
    url: '/api/users/get_users',
    data: { code, page, size, query },
  })
}

export const fetchEditUserPermissions = async (
  appCode: string,
  userId: string,
  permissions: Array<{ permission_code: string; granted: boolean }>
) => {
  return await baseFetch({
    url: '/api/users/editUserPermissions',
    data: { appCode, userId, permissions },
    method: 'PATCH',
  })
}

export const fetchDownloadUsers = async (appCode: string, type: string) => {
  return await baseFetch({
    url: '/api/users/download_users',
    data: { appCode, type },
    method: 'POST',
    blob: true,
  })
}
