// Models
import { Approval } from 'models/Approval.model'

// Services
import * as api from 'lib/services/api'

// Store
import * as types from 'store/actionTypes'

const getRequests = async (
  dispatch,
  page: number,
  size: number,
  query: string
) => {
  const payload = await api.fetchGetRequests(page, size, query)
  if (!payload) {
    return
  }

  dispatch({
    type: types.SET_REQUESTS,
    payload: payload.data,
  })
  return payload
}

const setSelectedRequest = async (dispatch, payload: Approval) => {
  dispatch({
    type: types.SET_SELECTED_REQUEST,
    payload: payload,
  })
}

export { getRequests, setSelectedRequest }
