// Libraries
import { ActionMeta } from 'react-select'

export type DynamicDropdownProps = {
  disabled?: boolean
  width?: string
  placeHolder?: string
  color?: string
  backgroundColor?: string
  disabledBackgroundColor?: string
  disabledColor?: string
  fontWeight?: string
  options?: Array<any>
  selectedOption?: any
  loading?: boolean
  onSelectOption?: (value: any, actionMeta: ActionMeta<any>) => void
}
