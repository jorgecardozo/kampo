import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, X, ExternalLink, Tag } from 'lucide-react'

type VersionInfo = {
  version: string
  commit: string
  commitShort: string
  message: string
  branch: string
  author: string
  commitDate: string
  buildDate: string
  env: string
  repo: string
}

const fmt = (iso: string) => {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

// Estilos de badge legibles (fondo suave + texto de color), como los de la app.
const TONE = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
}

// Punto de color por entorno (para el badge flotante).
const envDot = (env: string) =>
  env === 'production' ? 'bg-emerald-500' : env === 'preview' ? 'bg-amber-500' : 'bg-sky-500'
// Pill legible por entorno (para el modal).
const envCls = (env: string) => (env === 'production' ? TONE.emerald : env === 'preview' ? TONE.amber : TONE.sky)

// Tipo del cambio, según el prefijo del mensaje (feat/fix/refactor…).
const TIPOS: Record<string, { label: string; cls: string }> = {
  feat: { label: 'Feature', cls: TONE.emerald },
  fix: { label: 'Fix', cls: TONE.rose },
  refactor: { label: 'Refactor', cls: TONE.sky },
  perf: { label: 'Performance', cls: TONE.sky },
  revert: { label: 'Revert', cls: TONE.amber },
  docs: { label: 'Docs', cls: TONE.gray },
  style: { label: 'Estilo', cls: TONE.gray },
  chore: { label: 'Mantenimiento', cls: TONE.gray },
  build: { label: 'Build', cls: TONE.gray },
  ci: { label: 'CI', cls: TONE.gray },
  test: { label: 'Tests', cls: TONE.gray },
}
const parseTipo = (msg: string) => {
  const m = /^(\w+)(\(.+\))?!?:/.exec((msg || '').trim())
  const key = m ? m[1].toLowerCase() : ''
  return TIPOS[key] || { label: 'Cambio', cls: TONE.gray }
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
    <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
    <span className="text-sm text-right font-medium text-gray-700 dark:text-gray-200 break-words">{children}</span>
  </div>
)

// Badge flotante (abajo a la derecha) con la versión desplegada. Al hacer clic
// muestra el detalle del deploy. Sin backdrop-blur (rompe el render en iOS Safari).
export const VersionTag = () => {
  const [info, setInfo] = useState<VersionInfo | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch('/version.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setInfo)
      .catch(() => {})
  }, [])

  if (!info) return null

  const commitUrl = info.repo && info.commit ? `https://github.com/${info.repo}/commit/${info.commit}` : null
  const tipo = parseTipo(info.message)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Ver info del deploy"
        className="fixed bottom-3 right-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span className={`h-2 w-2 rounded-full ${envDot(info.env)}`} />
        <Tag size={12} /> {info.version}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Versión desplegada</h3>
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X size={18} />
                </button>
              </div>

              {/* Hero: versión + tipo + entorno */}
              <div className="mb-5 rounded-2xl bg-main-50 dark:bg-gray-700/40 px-4 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-main-600 text-white">
                    <Tag size={16} />
                  </span>
                  <span className="text-2xl font-bold text-main-700 dark:text-main-400">{info.version}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tipo.cls}`}>
                    {tipo.label}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${envCls(info.env)}`}>
                    {info.env}
                  </span>
                </div>
              </div>

              <div className="space-y-0">
                <Row label="Commit">
                  {commitUrl ? (
                    <a href={commitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-main-600 hover:underline">
                      {info.commitShort} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="font-mono">{info.commitShort || '-'}</span>
                  )}
                </Row>
                <Row label="Mensaje">{(info.message || '-').split('\n')[0]}</Row>
                <Row label="Rama">
                  <span className="inline-flex items-center gap-1">
                    <GitBranch size={12} /> {info.branch || '-'}
                  </span>
                </Row>
                <Row label="Autor">{info.author || '-'}</Row>
                <Row label="Commit del">{fmt(info.commitDate)}</Row>
                <Row label="Build del">{fmt(info.buildDate)}</Row>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VersionTag
