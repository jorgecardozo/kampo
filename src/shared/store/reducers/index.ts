import { requestsReducer } from './requests'
import { usersReducer } from './profiles-and-access'
import { pointsOfSalesReducer } from './points-of-sales'
import { userReducer } from './user'
import { applicationsReducer } from './applications'
import { usersBisReducer } from './users'
import { rolesReducer } from './roles'
import { tabsReducer } from './tabs'

const combineReducers = (...reducers) => {
  return (state, action) =>
    reducers.reduce((acc, nextReducer) => nextReducer(acc, action), state)
}

export const rootReducer = combineReducers(
  requestsReducer,
  pointsOfSalesReducer,
  userReducer,
  usersReducer,
  applicationsReducer,
  usersBisReducer,
  rolesReducer,
  tabsReducer
)
