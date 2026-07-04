import * as types from '../actionTypes'

export const rolesReducer = (state, action) => {
  const reducers = {
    [types.SET_ROLES]: () => ({
      ...state,
      roles: {
        list: action.payload,
      },
    }),
  }
  return reducers[action.type] ? reducers[action.type]() : state
}
