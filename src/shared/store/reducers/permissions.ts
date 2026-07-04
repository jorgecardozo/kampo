import * as types from '../actionTypes'

export const permissionsReducer = (state, action) => {
  const reducers = {
    [types.SET_PERMISSIONS]: () => ({
      ...state,
      roles: {
        list: action.payload,
      },
    }),
  }
  return reducers[action.type] ? reducers[action.type]() : state
}
