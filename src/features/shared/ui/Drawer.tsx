import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { usePermisos } from '@shared/context/PermisosProvider'

type DrawerProps = {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  onSubmit: () => void
  submitLabel?: string
  children: ReactNode
  submitting?: boolean
  // Navegación entre ítems (flechas en el header).
  onPrev?: () => void
  onNext?: () => void
  canPrev?: boolean
  canNext?: boolean
  navLabel?: string
  // Acciones extra a la izquierda del footer (ej: Archivar / Restaurar).
  secondaryActions?: ReactNode
}

const navBtn =
  'inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'

const closeBtn =
  'rounded-lg p-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'

// Panel lateral derecho (drawer) con formulario. Sin overlay que tape la tabla:
// el usuario puede seguir viendo y navegando los ítems. Cierra con Escape.
export const Drawer = ({
  open,
  title,
  subtitle,
  onClose,
  onSubmit,
  submitLabel = 'Guardar',
  children,
  submitting = false,
  onPrev,
  onNext,
  canPrev = false,
  canNext = false,
  navLabel,
  secondaryActions,
}: DrawerProps) => {
  const showNav = !!(onPrev || onNext)
  const { puedeEditar } = usePermisos()

  // Cerrar con la tecla Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '110%' }}
          animate={{ x: 0 }}
          exit={{ x: '110%' }}
          transition={{ type: 'tween', duration: 0.25 }}
          className="fixed right-3 top-3 bottom-3 z-[80] w-[calc(100%-1.5rem)] max-w-2xl
            flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800 shadow-2xl"
        >
          {/* Header: navegación (izquierda) → título → cerrar (derecha) */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              {showNav && (
                <div className="flex items-center gap-1.5">
                  <button type="button" className={navBtn} onClick={onPrev} disabled={!canPrev} title="Anterior">
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" className={navBtn} onClick={onNext} disabled={!canNext} title="Siguiente">
                    <ChevronRight size={16} />
                  </button>
                  {navLabel && (
                    <span className="ml-1 text-xs font-medium text-gray-400 tabular-nums">{navLabel}</span>
                  )}
                  <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
                {subtitle && <p className="truncate text-sm text-gray-400">{subtitle}</p>}
              </div>
            </div>
            <button type="button" onClick={onClose} className={closeBtn} title="Cerrar (Esc)">
              <X size={20} />
            </button>
          </div>

          {/* Cuerpo en 2 columnas */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 md:grid-cols-2">
              {children}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-2">{puedeEditar && secondaryActions}</div>
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                {!puedeEditar && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                    <Eye size={15} /> Solo lectura
                  </span>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {puedeEditar ? 'Cancelar' : 'Cerrar'}
                </button>
                {puedeEditar && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-main-600 px-4 py-2 text-sm font-semibold text-white hover:bg-main-700 disabled:opacity-60"
                  >
                    {submitting ? 'Guardando…' : submitLabel}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Drawer
