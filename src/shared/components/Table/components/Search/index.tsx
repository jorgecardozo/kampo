import { SearchTemplate } from './Search.template'
import { SearchProps } from './Search.types'

const Search = ({ ...props }: SearchProps) => {
  return <SearchTemplate {...props} />
}

export default Search
