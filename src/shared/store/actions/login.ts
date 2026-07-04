// Services
import * as api from 'lib/services/api'

const login = async (loginData) => {
  const payload = await api.fetchLogin(loginData)
  if (!payload) {
    return
  }
  return payload
}

export { login }
