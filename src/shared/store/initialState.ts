import { AppState } from 'models/AppState.model'

export const INITIAL_STATE: AppState = {
  requests: {
    list: [],
    selected: null,
  },
  pointsOfSales: {
    list: [],
    selected: null,
  },
  users: {
    list: [],
    selected: null,
    applicationSelected: null,
  },
  usersMvp: {
    error: 0,
    processed: 0,
    ok: 0,
    fields: [],
  },
  pointsOfSalesMvp: {
    error: 0,
    processed: 0,
    ok: 0,
    fields: [],
  },
  user: {},
  usuario: {},
  applications: {
    list: [],
    selected: null,
  },
  roles: {
    list: [],
  },
  permissions: {
    list: [],
  },
  tabs: {},
}
