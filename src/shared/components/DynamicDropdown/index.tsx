import { DynamicDropdownTemplate } from './DynamicDropdown.template'
import { DynamicDropdownProps } from './DynamicDropdown.types'

export const DynamicDropdown = ({ ...props }: DynamicDropdownProps) => {
  return <DynamicDropdownTemplate {...props}></DynamicDropdownTemplate>
}
