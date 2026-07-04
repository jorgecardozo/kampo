export type PaginationProps = {
  totalPages?: number
  maxVisiblePages?: number
  currentPage?: number
  className?: string
  searchQuery?: string
  onPageChange: (params: {
    page?: number
    query?: string
    size?: number
  }) => Promise<void>
}
