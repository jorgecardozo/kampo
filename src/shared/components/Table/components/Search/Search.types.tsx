export type SearchProps = {
  className?: string
  searchTerm?: string
  onSearch: (params: {
    page?: number
    query?: string
    size?: number
  }) => Promise<void>
}
