'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import Select from 'react-select'
import {
  format,
  startOfToday,
  startOfYesterday,
  endOfYesterday,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { DateRange, Preset, DateRangePickerProps } from './DateRangePicker.types'
import { Button } from '@/components/ui/button'
import { getCustomStyles } from '../Select/Select.styles'

const customStyles = getCustomStyles()

export const DateRangePickerTemplate = ({
  value,
  onChange,
  onApply,
  onCancel,
}: DateRangePickerProps) => {
  const [showCustomRange, setShowCustomRange] = useState(false)
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    value || { from: null, to: null }
  )
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const presets: Preset[] = useMemo(
    () => [
      {
        label: 'Hoy',
        getValue: () => ({
          from: startOfToday(),
          to: startOfToday(),
        }),
      },
      {
        label: 'Ayer',
        getValue: () => ({
          from: startOfYesterday(),
          to: endOfYesterday(),
        }),
      },
      {
        label: 'Últimos 7 días',
        getValue: () => ({
          from: subDays(startOfToday(), 6),
          to: startOfToday(),
        }),
      },
      {
        label: 'Últimos 30 días',
        getValue: () => ({
          from: subDays(startOfToday(), 29),
          to: startOfToday(),
        }),
      },
      {
        label: 'Este mes',
        getValue: () => ({
          from: startOfMonth(new Date()),
          to: endOfMonth(new Date()),
        }),
      },
      {
        label: 'Mes anterior',
        getValue: () => {
          const lastMonth = subMonths(new Date(), 1)
          return {
            from: startOfMonth(lastMonth),
            to: endOfMonth(lastMonth),
          }
        },
      },
      {
        label: 'Rango personalizado',
        getValue: () => ({
          from: null,
          to: null,
        }),
      },
    ],
    []
  )

  const handlePresetClick = (preset: Preset) => {
    if (preset.label === 'Rango personalizado') {
      // Mostrar el calendario personalizado sin cerrar el popover
      setShowCustomRange(true)
      setActivePreset(preset.label)
    } else {
      // Aplicar preset inmediatamente y cerrar
      const range = preset.getValue()
      setSelectedRange(range)
      setActivePreset(preset.label)
      onChange(range)
      if (onApply) {
        onApply(range)
      }
    }
  }

  const handleDateClick = (date: Date) => {
    if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
      // Primer click o reiniciar selección
      setSelectedRange({ from: date, to: null })
    } else {
      // Segundo click
      if (isBefore(date, selectedRange.from)) {
        setSelectedRange({ from: date, to: selectedRange.from })
      } else {
        setSelectedRange({ from: selectedRange.from, to: date })
      }
    }
  }

  const handleApplyCustomRange = () => {
    onChange(selectedRange)
    if (onApply) {
      onApply(selectedRange)
    }
    setShowCustomRange(false)
  }

  const handleCancelCustomRange = () => {
    setSelectedRange({ from: null, to: null })
    setActivePreset(null)
    setShowCustomRange(false)
    if (onCancel) {
      onCancel()
    }
  }

  const handleBackToPresets = () => {
    setShowCustomRange(false)
  }

  const nextMonth = addMonths(currentMonth, 1)

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const monthOptions = [
    { value: 0, label: 'Enero' },
    { value: 1, label: 'Febrero' },
    { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Mayo' },
    { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' },
    { value: 10, label: 'Noviembre' },
    { value: 11, label: 'Diciembre' },
  ]

  const yearOptions = Array.from({ length: 21 }, (_, i) => {
    const year = new Date().getFullYear() - 10 + i
    return { value: year, label: year.toString() }
  })

  const handleMonthChange = (selectedOption: any, isFirstCalendar: boolean) => {
    const monthIndex = selectedOption.value
    const targetMonth = isFirstCalendar ? currentMonth : nextMonth
    const newDate = new Date(targetMonth.getFullYear(), monthIndex, 1)
    if (isFirstCalendar) {
      setCurrentMonth(newDate)
    } else {
      setCurrentMonth(subMonths(newDate, 1))
    }
  }

  const handleYearChange = (selectedOption: any, isFirstCalendar: boolean) => {
    const year = selectedOption.value
    const targetMonth = isFirstCalendar ? currentMonth : nextMonth
    const newDate = new Date(year, targetMonth.getMonth(), 1)
    if (isFirstCalendar) {
      setCurrentMonth(newDate)
    } else {
      setCurrentMonth(subMonths(newDate, 1))
    }
  }

  const renderCalendar = (month: Date, isFirstCalendar: boolean) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    const isDateInRange = (date: Date) => {
      if (!selectedRange.from) return false
      if (!selectedRange.to && hoveredDate) {
        const start = isBefore(selectedRange.from, hoveredDate)
          ? selectedRange.from
          : hoveredDate
        const end = isAfter(selectedRange.from, hoveredDate)
          ? selectedRange.from
          : hoveredDate
        return isWithinInterval(date, { start, end })
      }
      if (!selectedRange.to) return false
      return isWithinInterval(date, {
        start: selectedRange.from,
        end: selectedRange.to,
      })
    }

    const isStartDate = (date: Date) =>
      selectedRange.from && isSameDay(date, selectedRange.from)

    const isEndDate = (date: Date) =>
      selectedRange.to && isSameDay(date, selectedRange.to)

    return (
      <div className="flex flex-col">
        {/* Header con navegación, mes y año en una sola línea */}
        <div className="flex items-center gap-2 mb-4">
          {isFirstCalendar && (
            <button
              onClick={previousMonth}
              className="p-1.5 bg-main-600 hover:bg-main-700 rounded-md transition-colors flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
          )}
          <div className="flex-1">
            <Select
              value={monthOptions.find(opt => opt.value === month.getMonth())}
              onChange={(option) => handleMonthChange(option, isFirstCalendar)}
              options={monthOptions}
              styles={customStyles}
              isSearchable={false}
              menuPlacement="auto"
            />
          </div>
          <div className="w-24">
            <Select
              value={yearOptions.find(opt => opt.value === month.getFullYear())}
              onChange={(option) => handleYearChange(option, isFirstCalendar)}
              options={yearOptions}
              styles={customStyles}
              isSearchable={false}
              menuPlacement="auto"
            />
          </div>
          {!isFirstCalendar && (
            <button
              onClick={goNextMonth}
              className="p-1.5 bg-main-600 hover:bg-main-700 rounded-md transition-colors flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-gray-500 text-center py-2"
            >
              {day}
            </div>
          ))}
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, month)
            const inRange = isDateInRange(day)
            const isStart = isStartDate(day)
            const isEnd = isEndDate(day)
            const isToday = isSameDay(day, new Date())

            return (
              <button
                key={idx}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!isCurrentMonth}
                className={`
                  relative h-9 w-full text-sm transition-colors
                  ${!isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900'}
                  ${inRange && !isStart && !isEnd ? 'bg-main-50' : ''}
                  ${isStart || isEnd ? 'bg-main-600 text-white font-semibold' : ''}
                  ${isToday && !isStart && !isEnd ? 'border border-main-600' : ''}
                  ${isCurrentMonth && !isStart && !isEnd ? 'hover:bg-main-100' : ''}
                  rounded-md
                `}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const formatRange = () => {
    if (!selectedRange.from && !selectedRange.to) {
      return 'Seleccionar rango de fechas'
    }
    if (selectedRange.from && !selectedRange.to) {
      return format(selectedRange.from, 'd MMMM, yyyy', { locale: es })
    }
    if (selectedRange.from && selectedRange.to) {
      return `${format(selectedRange.from, 'd MMMM, yyyy', { locale: es })} – ${format(
        selectedRange.to,
        'd MMMM, yyyy',
        { locale: es }
      )}`
    }
    return 'Seleccionar rango de fechas'
  }

  // Vista de presets (modo default)
  if (!showCustomRange) {
    return (
      <div className="py-2 w-64">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className={`
              w-full text-left px-4 py-2.5 text-sm transition-colors
              ${
                activePreset === preset.label
                  ? 'bg-main-600 text-white font-medium'
                  : 'text-main-600 hover:bg-main-600 hover:text-white'
              }
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>
    )
  }

  // Vista de calendario personalizado
  return (
    <div className="p-4 sm:p-6 w-full">
      {/* Header con rango seleccionado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-4 border-b border-gray-200 gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-main-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{formatRange()}</span>
        </div>
        <button
          onClick={handleBackToPresets}
          className="text-xs sm:text-sm text-main-600 hover:text-main-700 font-medium whitespace-nowrap"
        >
          ← Volver
        </button>
      </div>

      {/* Calendarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
        {renderCalendar(currentMonth, true)}
        {renderCalendar(nextMonth, false)}
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
        <Button variant="outline" size="sm" onClick={handleCancelCustomRange}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleApplyCustomRange}>Aplicar</Button>
      </div>
    </div>
  )
}
