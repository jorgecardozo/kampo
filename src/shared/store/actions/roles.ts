import * as api from 'lib/services/api'
import * as types from 'store/actionTypes'

const getRoles = async (dispatch, code: string) => {
  const payload = await api.fetchGetRoles(code)

  if (!payload) {
    return
  }

  dispatch({
    type: types.SET_ROLES,
    payload: payload,
  })

  return payload
}

const obtenerRoles = async () => {
  const payload = await api.fetchObtenerRoles()

  return payload
}

export { getRoles, obtenerRoles }
