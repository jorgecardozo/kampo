import * as types from '../actionTypes'

export const pointsOfSalesReducer = (state, action) => {
  const reducers = {
    [types.SET_POINTS_OF_SALES_MVP]: () => ({
      ...state,
      pointsOfSalesMvp: {
        error: action.payload.error || 0,
        processed: action.payload.processed || 0,
        ok: action.payload.ok || 0,
        list: action.payload.fields || [],
      },
    }),
    [types.SET_POINTS_OF_SALES]: () => ({
      ...state,
      pointsOfSales: {
        list: action.payload || [],
      },
    }),
    [types.SET_SELECTED_POINTS_OF_SALES]: () => ({
      ...state,
      pointsOfSales: {
        ...state.pointsOfSales,
        selected: action.payload,
      },
    }),
  }
  return reducers[action.type] ? reducers[action.type]() : state
}
