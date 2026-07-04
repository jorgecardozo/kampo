import * as types from '../actionTypes'

export const requestsReducer = (state, action) => {
  const reducers = {
    [types.SET_REQUESTS]: () => ({
      ...state,
      requests: {
        list: action.payload,
      },
    }),
    [types.SET_SELECTED_REQUEST]: () => ({
      ...state,
      requests: {
        ...state.requests,
        selected: action.payload,
      },
    }),
  }
  return reducers[action.type] ? reducers[action.type]() : state
}
