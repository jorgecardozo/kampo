import * as types from '../actionTypes'

export const tabsReducer = (state, action) => {
  const reducers = {
    [types.SET_TAB]: () => ({
      ...state,
      tabs: {
        ...state.tabs,
        [action.payload.tabView]: action.payload.tabValue,
      },
    }),
  }
  return reducers[action.type] ? reducers[action.type]() : state
}
