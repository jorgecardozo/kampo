import { baseFetch } from './api'

export const fetchLogin = async (loginData) => {
  return await baseFetch({
    url: '/api/login',
    data: { loginData },
    method: 'POST',
  })
}
