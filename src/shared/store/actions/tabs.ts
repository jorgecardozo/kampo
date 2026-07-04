// Models
import * as types from 'store/actionTypes'

const setTab = async (dispatch, tabView: string, tabValue: string) => {
  dispatch({
    type: types.SET_TAB,
    payload: { tabView, tabValue },
  })
}

export { setTab }
