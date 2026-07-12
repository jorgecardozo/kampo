import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import type { Page } from '../lib/pagination'

export type ListMode = 'paged' | 'infinite'

type Options<T> = {
  // Clave base (incluí los filtros acá para que cachee/segmente por filtro).
  key: any[]
  fetcher: (page: number, pageSize: number) => Promise<Page<T>>
  mode: ListMode
  page: number
  pageSize: number
}

// Hook unificado para listas con paginado numerado o scroll infinito.
// - paged: useQuery + keepPreviousData (sin parpadeo, páginas cacheadas).
// - infinite: useInfiniteQuery (acumula y cachea páginas).
export function useListQuery<T>({ key, fetcher, mode, page, pageSize }: Options<T>) {
  const paged = useQuery({
    queryKey: [...key, 'paged', page, pageSize],
    queryFn: () => fetcher(page, pageSize),
    enabled: mode === 'paged',
    placeholderData: keepPreviousData,
  })

  const infinite = useInfiniteQuery({
    queryKey: [...key, 'infinite', pageSize],
    queryFn: ({ pageParam }) => fetcher(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((s, p) => s + p.data.length, 0)
      return loaded < last.total ? pages.length + 1 : undefined
    },
    enabled: mode === 'infinite',
  })

  if (mode === 'infinite') {
    return {
      mode,
      rows: (infinite.data?.pages.flatMap((p) => p.data) ?? []) as T[],
      total: infinite.data?.pages[0]?.total ?? 0,
      isLoading: infinite.isLoading,
      hasNext: !!infinite.hasNextPage,
      isFetchingNext: infinite.isFetchingNextPage,
      fetchNext: infinite.fetchNextPage,
    }
  }

  return {
    mode,
    rows: (paged.data?.data ?? []) as T[],
    total: paged.data?.total ?? 0,
    isLoading: paged.isLoading,
    hasNext: false,
    isFetchingNext: false,
    fetchNext: () => {},
  }
}
