"use client"

import { useEffect, useState } from "react"
import { DateInputProps } from "./DateInput.types"
import clsx from "clsx"
import { Controller, FieldError, type FieldValues } from "react-hook-form"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getNestedProperty } from "lib/utils/helpers"

export const DateInputTemplate = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder = "Seleccionar fecha",
  mode = "single",
  rules,
  errors,
  control,
  disabled,
  className,
  minDate,
  maxDate,
  disablePastDates = false,
  disableFutureDates = false,
}: DateInputProps<TFieldValues>) => {
  const [open, setOpen] = useState(false)

  const errorMessage = errors && getNestedProperty(errors, name)
  const hasError = !!(errors && errorMessage)

  useEffect(() => {
    console.log("errors", errors)
  }, [errors])

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    if (disablePastDates && date < new Date()) return true
    if (disableFutureDates && date > new Date()) return true
    return false
  }

  const formatDisplayValue = (value: any) => {
    if (!value) return placeholder

    if (mode === "single") {
      return format(value, "PPP", { locale: es })
    }

    if (mode === "range") {
      if (value.from) {
        if (value.to) {
          return `${format(value.from, "dd/MM/yyyy")} - ${format(value.to, "dd/MM/yyyy")}`
        }
        return format(value.from, "dd/MM/yyyy")
      }
      return placeholder
    }

    return placeholder
  }

  return (
    <div className={clsx(className, "relative")}>
      <label
        htmlFor={name}
        className={clsx("absolute -top-2 left-3 bg-white px-1 text-xs", disabled ? "text-gray-400" : "text-black")}
      >
        {label}
      </label>
      <Controller<TFieldValues>
        render={({ field: { onChange, value } }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={clsx(
                  "h-12 block w-full rounded-md border py-3 px-3 text-sm leading-3 focus:outline-none focus:border-main-500 focus:ring-2 focus:ring-main-500 text-left flex items-center justify-between transition-colors",
                  disabled
                    ? "border-gray-400 placeholder:opacity-90 cursor-not-allowed"
                    : "border-main-300 placeholder:text-input-placeholder hover:border-main-500",
                  hasError && "border-red-500",
                  !value && "text-input-placeholder",
                )}
                disabled={disabled}
                id={name}
              >
                <span className="truncate">{formatDisplayValue(value)}</span>
                <CalendarIcon className="h-4 w-4 flex-shrink-0 ml-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 !z-[100]" align="start">
              <Calendar
                mode={mode as any}
                selected={value}
                onSelect={(date) => {
                  onChange(date)
                  if (mode === "single" && date) {
                    setOpen(false)
                  }
                }}
                disabled={isDateDisabled}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        )}
        name={name}
        control={control}
        rules={rules}
      />
      {hasError && <p className="absolute mt-1 text-xs text-error z-[101]">{errorMessage?.message}</p>}
    </div>
  )
}
