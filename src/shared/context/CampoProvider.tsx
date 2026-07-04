import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Campo, fetchCampos } from '@modules/configuracion/campos/campos.api'
import { setCampoActual } from 'lib/campoActual'

type CampoCtx = {
  campos: Campo[]
  campoId: string | null
  campoActual: Campo | null
  setCampoId: (id: string) => void
  isLoading: boolean
}

const Ctx = createContext<CampoCtx>({
  campos: [],
  campoId: null,
  campoActual: null,
  setCampoId: () => {},
  isLoading: true,
})

const STORAGE_KEY = 'campoActualId'

export const CampoProvider = ({ children }: { children: ReactNode }) => {
  const qc = useQueryClient()
  const { data: campos = [], isLoading } = useQuery({ queryKey: ['config.campos'], queryFn: fetchCampos })
  const [campoId, setCampoIdState] = useState<string | null>(null)

  // Elegir campo inicial: el guardado en localStorage o el primero.
  useEffect(() => {
    if (!campos.length) return
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    const valid = saved && campos.some((c) => c.id === saved) ? saved : campos[0].id
    if (valid !== campoId) {
      setCampoIdState(valid)
      setCampoActual(valid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campos])

  const setCampoId = (id: string) => {
    setCampoIdState(id)
    setCampoActual(id)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, id)
    // Refrescar todo lo que depende del campo.
    qc.invalidateQueries()
  }

  const value = useMemo<CampoCtx>(
    () => ({
      campos,
      campoId,
      campoActual: campos.find((c) => c.id === campoId) ?? null,
      setCampoId,
      isLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [campos, campoId, isLoading]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useCampo = () => useContext(Ctx)
