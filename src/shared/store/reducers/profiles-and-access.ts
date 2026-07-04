import * as types from '../actionTypes'

export const usersReducer = (state, action) => {
  const reducers = {
    [types.SET_USERS_MVP]: () => ({
      ...state,
      usersMvp: {
        error: action.payload.error || 0,
        processed: action.payload.processed || 0,
        ok: action.payload.ok || 0,
        list: action.payload.fields || [],
      },
    }),
  }
  return reducers[action.type] ? reducers[action.type]() : state
}
