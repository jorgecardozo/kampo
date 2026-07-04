import { useState } from 'react'
import { useController } from 'react-hook-form'
import clsx from 'clsx'

import Datepicker from 'react-datepicker'
import { DatePickerProps } from './DatePicker.types'
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split('-')
  return new Date(year, month - 1, day)
}

export const DatePickerTemplate = ({
  children,
  placeholder,
  handleChange,
  className,
  label,
  selectedStartDate,
  selectedEndDate,
  control,
  name,
  rules,
  isInput,
  selectsRange,
  wrapperClassName, // this class is useful for defining the width of the datepicker
  isDisabled = false,
  includeDateIntervals,
}: DatePickerProps) => {
  const [startDate, setStartDate] = useState(
    selectedStartDate ? parseDate(selectedStartDate) : selectedStartDate
  )
  const [endDate, setEndDate] = useState(
    selectedEndDate ? parseDate(selectedEndDate) : null
  )
  const [opened, setOpened] = useState(false)

  const { field } = useController({
    name,
    control,
    rules,
  })

  if (handleChange) {
    field.onChange = (date) => {
      if (selectsRange) {
        const [start, end] = date
        setStartDate(start)
        setEndDate(end)
        if (end) setOpened(false)
      } else {
        setStartDate(date)
        setOpened(false)
      }
      handleChange(date)
    }
  }

  return (
    <div className="relative">
      <label
        className={clsx(
          'bg-white text-xs',
          isDisabled ? 'text-gray-400' : 'text-input'
        )}
      >
        {isInput ? (
          <div
            className={clsx(
              'absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-white px-1 text-xs',
              isDisabled ? 'text-gray-400' : 'text-input'
            )}
          >
            <p className="">{label}</p>
          </div>
        ) : (
          children
        )}
      </label>
      <div className={clsx('relative', !isInput && '-mt-0.5')}>
        <Datepicker
          selected={startDate}
          placeholderText={placeholder}
          startDate={startDate}
          wrapperClassName={clsx(
            wrapperClassName,
            isDisabled ? '!border-gray-400 !placeholder:opacity-90 ' : ''
          )}
          endDate={endDate}
          selectsRange={selectsRange}
          locale="es"
          open={opened}
          includeDateIntervals={includeDateIntervals}
          className={clsx(
            'block w-36 !rounded-full cursor-default bg-white text-sm placeholder:text-[#808080] focus:!outline-none p-y-2',
            !isInput && '-mt-2',
            isDisabled
              ? '!placeholder:opacity-50 !border-gray-400 !bg-[#F8F9FA]'
              : 'opacity-100',
            className
          )}
          onCalendarClose={() => setOpened(false)}
          onCalendarOpen={() => setOpened(true)}
          onChange={field.onChange}
          closeOnScroll={() => setOpened(false)}
          dateFormat="dd/MM/yyyy"
          disabled={isDisabled}
          {...field}
        />
        <div
          onClick={() => {
            if (!isDisabled) setOpened((prevOpened) => !prevOpened)
          }}
          className={clsx(
            'absolute right-2 flex h-5 w-5 transition duration-500 ease-in-out',
            isInput ? 'top-[13px]' : 'top-[3px]',
            opened ? 'rotate-180' : 'rotate-0',
            isDisabled ? 'opacity-50' : 'opacity-100'
          )}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
            className="inline-block leading-none"
          >
            <path
              fill="#1E1F21"
              d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  )
}
