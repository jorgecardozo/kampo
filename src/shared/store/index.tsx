import { getUserAttributes } from 'lib/utils/helpers'
import * as React from 'react'
import { INITIAL_STATE } from './initialState'
import { rootReducer } from './reducers'

type AppProviderProps = {
  children: React.ReactNode
  session: any
}

const AppContext = React.createContext(null)

const AppProvider = ({ children, session }: AppProviderProps) => {
  const initialState = {
    ...INITIAL_STATE,
    user: getUserAttributes(session),
  }
  const [state, dispatch] = React.useReducer(rootReducer, initialState)

  const value = { state, dispatch }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

const useAppContext = () => {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error('method must be used within a AppProvider')
  }
  return context
}

export { AppProvider, useAppContext }
