import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { ListMode } from './useListQuery'

type Ctx = { mode: ListMode; setMode: (m: ListMode) => void }

const ListModeContext = createContext<Ctx>({ mode: 'infinite', setMode: () => {} })

// Provider del modo de listado (paginado | scroll). Es global: al cambiarlo en
// una tabla, aplica a todas. Por defecto scroll infinito; se persiste en localStorage.
export const ListModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ListMode>('infinite')

  useEffect(() => {
    const saved = localStorage.getItem('listMode')
    if (saved === 'paged' || saved === 'infinite') setModeState(saved)
  }, [])

  const setMode = (m: ListMode) => {
    setModeState(m)
    try {
      localStorage.setItem('listMode', m)
    } catch {}
  }

  return <ListModeContext.Provider value={{ mode, setMode }}>{children}</ListModeContext.Provider>
}

export const useListMode = () => useContext(ListModeContext)
