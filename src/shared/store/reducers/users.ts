import * as types from '../actionTypes'

export const usersBisReducer = (state, action) => {
  const reducers = {
    [types.SET_USERS_BIS]: () => ({
      ...state,
      users: {
        ...state.users,
        list: action.payload,
      },
    }),
    [types.SET_SELECTED_USER]: () => ({
      ...state,
      users: {
        ...state.users,
        selected: action.payload,
      },
    }),
    [types.SET_APPLICATION_SELECTED_IN_USERS]: () => ({
      ...state,
      users: {
        ...state.users,
        applicationSelected: action.payload,
      },
    }),
  }
  return reducers[action.type] ? reducers[action.type]() : state
}
