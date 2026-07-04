// Libraries
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

// Components
import { TextBody } from 'components/Text'

// Types
import { PaginationProps } from './Pagination.types'

// Assets
import RightArrow from 'assets/images/rightArrow.svg'
import LeftArrow from 'assets/images/leftArrow.svg'

export const PaginationTemplate = ({
  totalPages,
  maxVisiblePages,
  currentPage,
  className = '',
  searchQuery,
  onPageChange,
}: PaginationProps) => {
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
    const page = newPage
    try {
      setLoading(true)
      await onPageChange({ page, query: searchQuery })
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
              'flex size-10 items-center justify-center rounded-full',
              isPrevEnabled && !loading
                ? 'cursor-pointer bg-pagination-bg text-white'
                : 'cursor-not-allowed bg-pagination-disabled-bg text-pagination-disabled-text',
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
                'flex size-10 items-center justify-center rounded-full',
                currentPageData === pageNumber
                  ? 'bg-pagination-bg text-white '
                  : 'cursor-pointer bg-pagination-disabled-bg text-pagination-disabled-text'
              )}
              onClick={() => !loading && handlePageChange(pageNumber)}
            >
              <TextBody>{pageNumber}</TextBody>
            </div>
          ))}
          <div
            className={clsx(
              'flex size-10 items-center justify-center rounded-full',
              isNextEnabled && !loading
                ? 'cursor-pointer bg-pagination-bg text-pagination-text'
                : 'cursor-not-allowed bg-pagination-disabled-bg text-pagination-disabled-text',
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
