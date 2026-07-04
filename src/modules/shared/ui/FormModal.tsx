import { ReactNode } from 'react'
import { X } from 'lucide-react'

type FormModalProps = {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: () => void
  submitLabel?: string
  children: ReactNode
  submitting?: boolean
}

// Modal de formulario simple y autocontenido (overlay + panel scrolleable).
export const FormModal = ({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = 'Guardar',
  children,
  submitting = false,
}: FormModalProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
          className="flex flex-col overflow-hidden"
        >
          <div className="overflow-y-auto px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-main-600 px-4 py-2 text-sm font-semibold text-white hover:bg-main-700 disabled:opacity-60"
            >
              {submitting ? 'Guardando…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Campo de formulario etiquetado para usar dentro del FormModal.
export const Field = ({
  label,
  children,
  full = false,
}: {
  label: string
  children: ReactNode
  full?: boolean
}) => (
  <label className={`flex flex-col gap-1 ${full ? 'md:col-span-2' : ''}`}>
    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
    {children}
  </label>
)

export const inputClass =
  'rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-white outline-none focus:border-main-500 focus:ring-1 focus:ring-main-500'

export default FormModal
