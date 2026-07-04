// Libraries
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormRegister,
  UseFormReturn,
} from 'react-hook-form'

export interface PerfilTemplateProps {
  usuario: any
  disabled?: boolean
  isLoading?: boolean
  errors?: FieldErrors<FieldValues>
  control?: UseFormReturn<FieldValues>['control']
  register?: UseFormRegister<FieldValues>
  handleSubmit?: (
    onSubmit?: SubmitHandler<FieldValues>,
    onInvalid?: SubmitHandler<FieldValues>
  ) => (e: React.BaseSyntheticEvent) => void
  editarUsuarioHandler: () => void
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
