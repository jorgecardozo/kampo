import { ReactNode } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import CampoSelector from './CampoSelector'

type PageHeaderProps = {
  section: string
  title: string
  actions?: ReactNode
}

// Encabezado consistente para todas las vistas de módulos:
// breadcrumb fijo (sección > título) + acciones opcionales a la derecha.
export const PageHeader = ({ section, title, actions }: PageHeaderProps) => (
  <div className="sticky top-0 bg-main-50/90 dark:bg-gray-900/95 backdrop-blur-sm z-10 pb-2 sm:pb-4 -mx-3 px-3 sm:-mx-6 sm:px-6 pt-1">
    {/* Fila 1: breadcrumb + selector de campo (siempre arriba) */}
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      <Breadcrumb>
        <BreadcrumbList className="text-sm sm:text-base">
          <BreadcrumbItem>
            <BreadcrumbPage className="text-main-600 dark:text-main-400 font-semibold">
              {section}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="dark:text-gray-500" />
          <BreadcrumbItem>
            <BreadcrumbPage className="dark:text-white">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CampoSelector />
    </div>
    {/* Fila 2: acciones (solo si hay) */}
    {actions && <div className="mt-2 flex flex-wrap items-center justify-end gap-2">{actions}</div>}
  </div>
)

export default PageHeader
