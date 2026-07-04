// Libraries
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

// Components
import { TextBody } from 'components/Text'

// Types
import { SearchProps } from './Search.types'

// Assets
import RightArrow from 'assets/images/rightArrow.svg'
import LeftArrow from 'assets/images/leftArrow.svg'

export const SearchTemplate = ({
  totalPages,
  maxVisiblePages,
  currentPage,
  className = '',
  onPageChange,
}: SearchProps) => {
  const [currentPageData, setCurrentPageData] = useState<number>(currentPage)
  const [isNextEnabled, setIsNextEnabled] = useState<boolean>(
    currentPageData < totalPages
  )
  const [isPrevEnabled, setIsPrevEnabled] = useState<boolean>(
    currentPageData > 1
  )
  const [visiblePages, setVisiblePages] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const handlePageChange = async (newPage) => {
    const page = newPage - 1
    try {
      setLoading(true)
      await onPageChange(page)
      setCurrentPageData(newPage)
      setIsNextEnabled(page < totalPages)
      setIsPrevEnabled(page > 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPageData(currentPage)
  }, [currentPage])

  useEffect(() => {
    let startPage
    if (maxVisiblePages >= totalPages) {
      startPage = 1
    } else {
      startPage = Math.max(
        1,
        Math.min(
          currentPageData - Math.floor(maxVisiblePages / 2),
          totalPages - maxVisiblePages + 1
        )
      )
    }

    setVisiblePages(
      Array.from(
        { length: Math.min(maxVisiblePages, totalPages) },
        (_page, index) => startPage + index
      )
    )
  }, [currentPageData, totalPages, maxVisiblePages])

  return (
    <div className={clsx(`${className}`)}>
      {totalPages > 1 && visiblePages.length > 1 && currentPage && (
        <div className="flex gap-4">
          <div
            className={clsx(
              'flex size-10 items-center justify-center rounded-full transition-colors',
              isPrevEnabled && !loading
                ? 'cursor-pointer bg-main-500 hover:bg-main-600 text-white'
                : 'cursor-not-allowed bg-gray-300 text-gray-500',
              loading && 'opacity-50'
            )}
            onClick={() =>
              isPrevEnabled && !loading && handlePageChange(currentPageData - 1)
            }
          >
            <img src={LeftArrow.src} alt="left arrow"></img>
          </div>
          {visiblePages.map((pageNumber) => (
            <div
              key={pageNumber}
              className={clsx(
                'flex size-10 items-center justify-center rounded-full transition-colors',
                'cursor-pointer',
                currentPageData === pageNumber
                  ? 'bg-main-500 text-white'
                  : 'bg-gray-300 text-gray-500 hover:bg-main-200'
              )}
              onClick={() => !loading && handlePageChange(pageNumber)}
            >
              <TextBody>{pageNumber}</TextBody>
            </div>
          ))}
          <div
            className={clsx(
              'flex size-10 items-center justify-center rounded-full transition-colors',
              isNextEnabled && !loading
                ? 'cursor-pointer bg-main-500 hover:bg-main-600 text-white'
                : 'cursor-not-allowed bg-gray-300 text-gray-500',
              loading && 'opacity-50'
            )}
            onClick={() =>
              isNextEnabled && !loading && handlePageChange(currentPageData + 1)
            }
          >
            <img
              src={RightArrow.src}
              alt="right arrow"
              className="text-white"
            ></img>
          </div>
        </div>
      )}
    </div>
  )
}
