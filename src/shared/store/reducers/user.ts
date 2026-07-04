import * as types from '../actionTypes'

export const userReducer = (state, action) => {
  const reducers = {
    [types.CLEAR_USER_DATA]: () => ({
      ...state,
      usuario: {},
    }),
    [types.SET_USER_DATA]: () => ({
      ...state,
      usuario: {
        ...state.user,
        ...action.payload,
      },
    }),
  }
  return reducers[action.type] ? reducers[action.type]() : state
}
