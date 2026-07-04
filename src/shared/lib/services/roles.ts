import { baseFetch } from './api'

export const fetchGetRoles = async (appCode: string) => {
  return await baseFetch({
    url: `/api/roles/${appCode}`,
  })
}

export const fetchObtenerRoles = async () => {
  return await baseFetch({
    url: `/api/roles`,
  })
}
