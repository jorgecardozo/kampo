// Libraries
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormRegister,
  UseFormReturn,
} from 'react-hook-form'

export interface FarmFieldsTemplateProps {
  headers?: Header[]
  items?: Item[]
  disabled?: boolean
  isLoadingCreateAndUpdateFarmField?: boolean
  isLoadingDeleteFarmField?: boolean
  isLoadingFarmFields?: boolean
  showDeleteFarmFieldModal?: boolean
  showAddAndEditFarmFieldModal?: boolean
  showDetailFarmFieldModal?: boolean
  totalPages?: number
  currentPage?: number
  searchQuery?: string
  selectedFarmField?: any
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
  setShowAddAndEditFarmFieldModal?: React.Dispatch<
    React.SetStateAction<boolean>
  >
  cancelDeleteFarmFieldHandler?: () => void
  cancelEnableAndDisableFarmFieldHandler?: () => void
  createFarmFieldHandler?: () => void
  updateFarmFieldHandler?: () => void
  deleteFarmFieldHandler?: () => void
  cancelDetailFarmFieldHandler?: () => void
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
