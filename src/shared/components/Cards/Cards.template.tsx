// Libraries
import React, { useState } from 'react'

// Types
import { CardsTemplateProps } from './Cards.types'
import { FIELDS } from 'lib/utils/constants'
import { TextBodyXs } from 'components/Text'
import { ZoomOutIcon } from 'components/Icons/ZoomOut'
import { Button } from 'components/Button'
import Cards from '.'
import { ZoomInIcon } from 'components/Icons/ZoomIn'

export const CardsTemplate = ({
  items,
  headers,
  subItems = null,
  subHeaders = null,
}: CardsTemplateProps) => {
  const [expandedRows, setExpandedRows] = useState([])
  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {items.map((item, cardId) => (
        <div
          key={`${item.id}-${cardId}`}
          className="card bg-bright-white rounded-lg border-2 border-gray-300 p-4 text-black shadow-xl"
        >
          <div className="flex flex-wrap gap-x-3 gap-y-0">
            {headers.map(
              (header, cardId) =>
                header.field !== 'actions' && (
                  <div
                    key={`${header.field}-${cardId}`}
                    className="mb-2 flex gap-1"
                  >
                    <div className="font-bold text-bright-turquoise-950">
                      {FIELDS[`${header.field}`]}:
                    </div>
                    <div>{item[header.field]}</div>
                  </div>
                )
            )}
          </div>

          {item['actions'] && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="font-bold text-bright-turquoise-950">
                  {FIELDS[`${'actions'}`]}:
                </div>
                <div className="flex flex-wrap gap-1">
                  {item['actions']}
                  {subItems && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        className="flex gap-2"
                        onClick={() => toggleRow(`${cardId}-sub-card`)}
                      >
                        {expandedRows.includes(`${cardId}-sub-table`) ? (
                          <div className="flex items-center gap-2">
                            <TextBodyXs>Ver</TextBodyXs>
                            <ZoomOutIcon width={18} height={18} />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <TextBodyXs>Ver</TextBodyXs>
                            <ZoomInIcon width={18} height={18} />
                          </div>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {item['elements'] && expandedRows.includes(`${cardId}-sub-card`) && (
            <Cards items={item['elements']} headers={subHeaders} />
          )}
        </div>
      ))}
    </div>
  )
}
