'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DateRangePickerTemplate } from './DateRangePicker.template'
import { DateRange } from './DateRangePicker.types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

type DateRangePickerPopoverProps = {
  value?: DateRange
  onChange: (range: DateRange) => void
  placeholder?: string
}

export const DateRangePickerPopover = ({
  value,
  onChange,
  placeholder = 'Seleccionar rango de fechas',
}: DateRangePickerPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleApply = (range: DateRange) => {
    onChange(range)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const formatRange = () => {
    if (!value?.from && !value?.to) {
      return placeholder
    }
    if (value.from && !value.to) {
      return format(value.from, 'd MMM, yyyy', { locale: es })
    }
    if (value.from && value.to) {
      return `${format(value.from, 'd MMM, yyyy', { locale: es })} – ${format(
        value.to,
        'd MMM, yyyy',
        { locale: es }
      )}`
    }
    return placeholder
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          className="justify-start text-left font-normal w-full bg-main-600 hover:bg-main-700 text-white border-main-600 hover:border-main-700"
        >
          <div className="mr-2 bg-white rounded p-0.5">
            <Calendar className="h-3.5 w-3.5 text-main-600" />
          </div>
          <span className="truncate">{formatRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-w-[95vw]" align="start" sideOffset={5}>
        <DateRangePickerTemplate
          value={value}
          onChange={onChange}
          onApply={handleApply}
          onCancel={handleCancel}
        />
      </PopoverContent>
    </Popover>
  )
}
