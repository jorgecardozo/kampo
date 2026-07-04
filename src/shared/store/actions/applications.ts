import * as api from 'lib/services/api'
import { Application } from 'models/Application.model'
import * as types from 'store/actionTypes'

const getApplications = async (dispatch, includeInactive: boolean) => {
  const payload = await api.fetchGetApplications(includeInactive)

  if (!payload) {
    return
  }

  dispatch({
    type: types.SET_APPLICATIONS,
    payload: payload,
  })

  return payload
}

const setApplicationSelected = async (dispatch, application: Application) => {
  dispatch({
    type: types.SET_APPLICATION_SELECTED,
    payload: application,
  })
}

export { getApplications, setApplicationSelected }
