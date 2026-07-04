// Libraries
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormRegister,
  UseFormReturn,
} from 'react-hook-form'

export interface ProveedoresTemplateProps {
  isLoadingProveedores?: boolean
  isLoadingActualizarYCrearProveedor?: boolean
  proveedorSeleccionado?: any
  disabled?: boolean
  mostrarModalActualizarYCrearProveedor?: boolean
  mostrarModalEliminaProveedor?: boolean
  headers?: Header[]
  items?: Item[]
  totalPages?: number
  currentPage?: number
  searchQuery?: string
  isOpen?: boolean
  onPageChange?: (params: {
    page?: number
    query?: string
    size?: number
    selectedPointsOfSales?: Array<number>
  }) => Promise<void>
  onSearch?: (params: {
    page?: number
    query?: string
    size?: number
  }) => Promise<void>
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  errors?: FieldErrors<FieldValues>
  control?: UseFormReturn<FieldValues>['control']
  register?: UseFormRegister<FieldValues>
  setMostrarModalActualizarYCrearProveedor?: React.Dispatch<
    React.SetStateAction<boolean>
  >
  cancelActualizarYCrearProveedorHandler?: () => void
  crearProveedorHandler?: () => void
  actualizarProveedorHandler?: () => void
  handleSubmit?: (
    onSubmit?: SubmitHandler<FieldValues>,
    onInvalid?: SubmitHandler<FieldValues>
  ) => (e: React.BaseSyntheticEvent) => void
}

export interface Header {
  className?: string
  field?: string
  type?: string
  title?: string
}

export interface Item {
  date?: React.ReactNode
  cuitl?: React.ReactNode
  requester?: React.ReactNode
  application?: React.ReactNode
  detail?: React.ReactNode
  actions?: React.ReactNode
}
