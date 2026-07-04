// Libraries
import { useEffect, useState } from 'react'
import clsx from 'clsx'

// Components
import { TextBody, TextBodyLg, TextBodyXs } from 'components/Text'
import Pagination from './components/Pagination'

// Types
import { TableProps } from './Table.types'
import Table from '.'
import GrayBox from 'components/Graybox'
import { Button } from 'components/Button'
import { ZoomInIcon } from 'components/Icons/ZoomIn'
import { ZoomOutIcon } from 'components/Icons/ZoomOut'

export const TableTemplate = ({
  emptyState,
  subItems,
  items,
  totalPages,
  maxVisiblePages,
  currentPage,
  subHeaders,
  headers,
  hideHeaders,
  searchQuery,
  className,
  subGridClass = '',
  subGridClassHeaders = '',
  gridClass = '',
  gridClassHeaders = '',
  showRadioButtons = false,
  selectedOptions,
  selectedAllPage = false,
  setSelectedOptions,
  onPageChange,
  onSelectAll,
}: TableProps) => {
  const [itemsData, setItemsData] = useState(items)
  const [expandedRows, setExpandedRows] = useState([])

  const handleCheckboxClick = (item) => {
    if (selectedOptions) {
      const exists = selectedOptions.some(
        (option) => option === item.pointOfSale.code
      )

      if (exists) {
        const filtered = selectedOptions.filter(
          (option) => option !== item.pointOfSale.code
        )
        setSelectedOptions([...filtered])
      } else {
        setSelectedOptions((prevOptions) => [
          ...prevOptions,
          item.pointOfSale.code,
        ])
      }
    }
  }

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    setItemsData(items)
  }, [items])

  return (
    <>
      {
        /* eslint-disable indent */
        !items || items.length <= 0 ? (
          emptyState
        ) : (
          <div className="relative overflow-x-auto">
            <div
              className={clsx(className, 'table w-full table-auto rounded-xl')}
            >
              {!hideHeaders && items.length > 0 && (
                <div
                  id="table-headers"
                  className={clsx(
                    'grid rounded-t-[0.68rem] border-x border-t bg-main-500 pl-4 backdrop-blur-[2px]',
                    gridClassHeaders ? `grid ${gridClassHeaders}` : 'flex'
                  )}
                >
                  {headers.map((header, index) => {
                    if (!header.hidden) {
                      if (header.field === 'radio') {
                        return (
                          <div key={`radio-${index}`} className="self-center">
                            <input
                              type="checkbox"
                              checked={selectedAllPage}
                              className="y mx-2.5 size-5 cursor-pointer accent-[#3F8EAF]"
                              onClick={onSelectAll}
                              title={
                                selectedAllPage
                                  ? 'Deseleccionar todos'
                                  : 'Seleccionar todos'
                              }
                            />
                          </div>
                        )
                      } else {
                        return (
                          <div
                            id="table-header"
                            key={`header-${index}`}
                            className="py-4 pl-4 text-start text-white"
                          >
                            <div
                              className={clsx(
                                'font-bold',
                                index !== headers.length - 1
                                  ? 'border-r border-r-white'
                                  : 'border-r-none'
                              )}
                            >
                              <TextBody className="truncate pr-4">
                                {header.title}
                              </TextBody>
                            </div>
                          </div>
                        )
                      }
                    }
                  })}
                </div>
              )}
              {itemsData.length > 0
                ? itemsData.map((item, tabId) => {
                    return (
                      <div key={`container-${tabId}-main`}>
                        <div
                          onClick={() => handleCheckboxClick(item)}
                          className={clsx(
                            'border-bg-light-gray-300 whitespace-nowrap border-x border-t-2 border-[#D9E8EF] border-t-gray-200 py-4 pl-4 font-medium transition-all hover:bg-gray-100',
                            gridClass ? `grid ${gridClass}` : 'flex',
                            items.length - 1 === tabId
                              ? 'rounded-b-xl border-b border-[#D9E8EF]'
                              : null
                          )}
                          key={`container-${tabId}`}
                        >
                          {showRadioButtons && (
                            <div key={`radio-${tabId}`} className="self-center">
                              <input
                                type="checkbox"
                                readOnly
                                checked={item.isChecked}
                                className="y mx-2.5 size-5 accent-[#3F8EAF]"
                              />
                            </div>
                          )}
                          {headers.map((header, index) => {
                            if (header.field !== 'radio') {
                              return (
                                <div
                                  key={`items-${index}`}
                                  className={clsx(
                                    header.className,
                                    'flex flex-1 px-2 text-table-text'
                                  )}
                                >
                                  {typeof item[header.field] === 'string' ? (
                                    <TextBodyLg
                                      title={item[header.field].props.children}
                                    >
                                      {item[header.field]}
                                    </TextBodyLg>
                                  ) : (
                                    <div className="flex gap-2 pl-2">
                                      <TextBodyLg
                                        title={
                                          header.showTitle
                                            ? item[header.field].props.children
                                            : ''
                                        }
                                        as="span"
                                      >
                                        {item[header.field]}
                                      </TextBodyLg>
                                      {subItems &&
                                        header.field === 'actions' && (
                                          <Button
                                            onClick={() =>
                                              toggleRow(`${tabId}-sub-table`)
                                            }
                                            variant="primary"
                                          >
                                            {expandedRows.includes(
                                              `${tabId}-sub-table`
                                            ) ? (
                                              <div className="flex items-center gap-2">
                                                <TextBodyXs>Ver</TextBodyXs>
                                                <ZoomOutIcon
                                                  width={18}
                                                  height={18}
                                                />
                                              </div>
                                            ) : (
                                              <div className="flex items-center gap-2">
                                                <TextBodyXs>Ver</TextBodyXs>
                                                <ZoomInIcon
                                                  width={18}
                                                  height={18}
                                                />
                                              </div>
                                            )}
                                          </Button>
                                        )}
                                    </div>
                                  )}
                                </div>
                              )
                            }
                          })}
                        </div>
                        {item['elements'] &&
                          expandedRows.includes(`${tabId}-sub-table`) && (
                            <div
                              className={clsx(
                                'overflow-hidden border border-t-2 border-[#D9E8EF] border-t-gray-200 p-4 transition-all duration-500',
                                expandedRows.includes(`${tabId}-sub-table`)
                                  ? 'max-h-[1000px]'
                                  : 'max-h-0'
                              )}
                            >
                              <Table
                                subHeaders={headers}
                                subItems={items}
                                headers={subHeaders}
                                items={item['elements']}
                                totalPages={totalPages}
                                currentPage={currentPage}
                                maxVisiblePages={10}
                                hideHeaders={false}
                                searchQuery={searchQuery}
                                gridClass={subGridClass}
                                gridClassHeaders={subGridClass}
                                className="text-black"
                                onPageChange={onPageChange}
                              />
                            </div>
                          )}
                      </div>
                    )
                  })
                : null}
            </div>
          </div>
        )
        /* eslint-enable indent */
      }
    </>
  )
}
