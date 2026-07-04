// Libraries
import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useDebounce } from 'use-debounce'

// Components
import Loader from 'components/Loader'

// Types
import { SearchProps } from './Search.types'

// Assets
import Search from 'assets/images/search.svg'
import { SearchIcon } from 'components/Icons/SearchIcon'
import { COLORS } from 'lib/utils/constants'

export const SearchTemplate = ({ className = '', onSearch }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 800)
  const [loading, setLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousSearchRef = useRef<string>('')

  // Mantener focus inicial
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const performSearch = async (term: string) => {
    if (loading) return

    setLoading(true)
    try {
      await onSearch({ page: 0, query: term })
    } catch (error) {
      console.error('Error en la búsqueda:', error)
    } finally {
      setLoading(false)
      // Asegurar que el focus se restaure después de la búsqueda
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
    previousSearchRef.current = term
  }

  // Efecto para el debounce
  useEffect(() => {
    const shouldSearch = debouncedSearchTerm !== previousSearchRef.current
    if (shouldSearch) {
      performSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await performSearch(searchTerm)
    }
  }

  // Prevenir la pérdida de focus
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // // Pequeño delay para permitir que otros eventos se procesen
    // setTimeout(() => {
    //   if (document.activeElement !== inputRef.current) {
    //     inputRef.current?.focus()
    //   }
    // }, 0)
  }

  return (
    <div
      className={clsx(
        'relative w-full md:min-w-[400px] md:max-w-md',
        className
      )}
    >
      <div className="relative">
        <div className="absolute left-2 top-2">
          {loading ? (
            <Loader width={30} height={30} fill="#B2D2DF" type="spinner" />
          ) : (
            // <img src={Search.src} alt="" width={30} height={30} />
            <SearchIcon fill={COLORS['SearchIcon']} width={30} height={30} />
          )}
        </div>
        <input
          type="text"
          className="block w-full rounded-lg border border-input px-3 py-2.5 pl-10 text-base leading-3 text-search-text placeholder:text-gray-450 focus-visible:border-none focus-visible:outline focus-visible:outline-gray-500 focus-visible:outline-1"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
          disabled={loading}
          ref={inputRef}
          autoFocus
        />
      </div>
    </div>
  )
}
