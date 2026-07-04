import * as types from '../actionTypes'

export const applicationsReducer = (state, action) => {
  const reducers = {
    [types.SET_APPLICATIONS]: () => ({
      ...state,
      applications: {
        error: action.payload.error || 0,
        processed: action.payload.processed || 0,
        ok: action.payload.ok || 0,
        list: action.payload || [],
      },
    }),
    [types.SET_APPLICATION_SELECTED]: () => ({
      ...state,
      applications: {
        selected: action.payload || null,
      },
    }),
  }
  return reducers[action.type] ? reducers[action.type]() : state
}
