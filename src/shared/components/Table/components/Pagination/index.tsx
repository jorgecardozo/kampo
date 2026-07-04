import { PaginationTemplate } from './Pagination.template'
import { PaginationProps } from './Pagination.types'

const Pagination = ({ ...props }: PaginationProps) => {
  return <PaginationTemplate {...props} />
}

export default Pagination
