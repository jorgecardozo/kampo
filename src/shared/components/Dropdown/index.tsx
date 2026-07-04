import { DropdownTemplate } from './Dropdown.template'
import { DropdownTemplateProps } from './Dropdown.types'

const Dropdown = ({ ...props }: DropdownTemplateProps) => {
  return <DropdownTemplate {...props} />
}

export default Dropdown
