// Libraries
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormGetValues,
  UseFormRegister,
  UseFormReturn,
} from 'react-hook-form'

export interface MediosDePagoTemplateProps {
  isLoadingMediosDePago?: boolean
  isLoadingGuardarMedioDePago?: boolean
  medioDePagoSeleccionado?: any
  disabled?: boolean
  mostrarModalCrearEditarMedioDePago?: boolean
  editandoMedioDePago?: boolean
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
  cancelCrearMedioDePagoHandler?: () => void
  crearEditarMedioDePagoHandler?: () => void
  handleSubmit?: (
    onSubmit?: SubmitHandler<FieldValues>,
    onInvalid?: SubmitHandler<FieldValues>
  ) => (e: React.BaseSyntheticEvent) => void
  abrirModalCrearMedioDePago?: () => void
  nombreWatch?: string
  tipoWatch?: string
}

export interface Header {
  className?: string
  field?: string
  type?: string
  title?: string
}

export interface Item {
  nombre?: React.ReactNode
  tipo?: React.ReactNode
  estado?: React.ReactNode
  comision?: React.ReactNode
  actions?: React.ReactNode
}

export interface MedioDePago {
  id: number
  nombre: string
  tipo: string
  estado: boolean
  punto_venta_id: number
  comision: number
}