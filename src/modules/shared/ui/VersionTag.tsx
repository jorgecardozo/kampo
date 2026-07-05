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

const envTone = (env: string) =>
  env === 'production'
    ? 'bg-emerald-500'
    : env === 'preview'
    ? 'bg-amber-500'
    : 'bg-sky-500'

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-1.5 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
    <span className="text-sm text-right text-gray-700 dark:text-gray-200 break-all">{children}</span>
  </div>
)

// Tag flotante con la versión desplegada. Al hacer clic muestra el detalle del deploy.
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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Ver info del deploy"
        className="fixed bottom-3 left-3 z-[70] inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/85 dark:bg-gray-800/85 backdrop-blur px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm hover:bg-white dark:hover:bg-gray-800"
      >
        <span className={`h-2 w-2 rounded-full ${envTone(info.env)}`} />
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
              className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Versión desplegada</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white ${envTone(info.env)}`}>
                    {info.env}
                  </span>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X size={18} />
                </button>
              </div>

              <div className="mb-3 flex items-center gap-2 rounded-xl bg-main-50 dark:bg-gray-700/40 px-3 py-2">
                <Tag size={16} className="text-main-600" />
                <span className="text-xl font-bold text-main-700 dark:text-main-400">{info.version}</span>
              </div>

              <div className="space-y-0.5">
                <Row label="Commit">
                  {commitUrl ? (
                    <a href={commitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-main-600 hover:underline">
                      {info.commitShort} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="font-mono">{info.commitShort || '-'}</span>
                  )}
                </Row>
                <Row label="Mensaje">{info.message || '-'}</Row>
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
