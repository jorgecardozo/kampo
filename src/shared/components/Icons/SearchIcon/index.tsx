import { SearchIconTemplate } from './SearchIcon.template'
import { SearchIconProps } from './SearchIcon.types'

export const SearchIcon = ({ ...props }: SearchIconProps) => {
  return <SearchIconTemplate {...props} />
}
