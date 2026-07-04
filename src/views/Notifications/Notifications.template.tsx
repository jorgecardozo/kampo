import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const NotificationsViewTemplate = () => {
  return (
    <div className="w-full flex flex-col h-full">
      {/* Breadcrumb fijo */}
      <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 pb-4 -mx-6 px-6 pt-1">
        <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-main-600 dark:text-main-400 font-semibold">
              CONFIGURACIÓN
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="dark:text-gray-500" />
          <BreadcrumbItem>
            <BreadcrumbPage className="dark:text-white">Notificaciones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Notificaciones</h1>
      </div>
    </div>
  )
}

export default NotificationsViewTemplate
