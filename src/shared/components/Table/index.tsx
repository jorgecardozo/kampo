import { TableTemplate } from './Table.template'
import { TableProps } from './Table.types'

const Table = ({ ...props }: TableProps) => {
  return <TableTemplate {...props} />
}

export default Table
