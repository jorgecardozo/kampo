import { ReactElement } from 'react'

export type TableProps = {
  emptyState?: ReactElement
  subHeaders?: Array<any>
  subItems?: Array<any>
  headers?: Array<any>
  items?: Array<any>
  totalPages?: number
  maxVisiblePages?: number
  currentPage?: number
  className?: string
  hideHeaders?: boolean
  searchQuery?: string
  gridClass?: string
  gridClassHeaders?: string
  subGridClass?: string
  subGridClassHeaders?: string
  showRadioButtons?: boolean
  handleSelectedRows?: any
  selectedOptions?: Array<number>
  selectedAllPage?: boolean
  setSelectedOptions?: React.Dispatch<React.SetStateAction<Array<number>>>
  onPageChange?: (params: {
    page?: number
    query?: string
    size?: number
    selectedPointsOfSales?: Array<number>
  }) => Promise<void>
  onSelectAll?: () => void
}
