export type SearchProps = {
  totalPages?: number
  maxVisiblePages?: number
  currentPage?: number
  className?: string
  onPageChange: (page?: number, size?: number) => Promise<void>
}
