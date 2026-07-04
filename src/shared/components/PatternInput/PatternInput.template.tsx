import React from 'react'
import { PatternFormat } from 'react-number-format'

import { PatternInputProps } from './PatternInput.types'
import { Controller } from 'react-hook-form'

export const PatternInputTemplate = ({
  name,
  label,
  placeholder,
  format,
  mask,
  rules,
  errors,
  control,
  type,
  disabled,
}: PatternInputProps) => {
  const errorMessage = errors && errors[name]
  const hasError = !!(errors && errorMessage)

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="absolute -top-2 left-3 bg-white px-1 text-xs text-input"
      >
        {label}
      </label>
      <Controller
        render={({ field }) => (
          <PatternFormat
            className="block border border-input-border rounded-md py-3 px-3 text-sm text-black leading-3 w-full focus:outline-focus"
            format={format}
            mask={mask}
            placeholder={placeholder}
            id={name}
            name={name}
            type={type}
            disabled={disabled}
            {...field}
          />
        )}
        name={name}
        control={control}
        rules={rules}
      />
      {hasError && (
        <p className="absolute mt-1 text-error text-xs">
          {errorMessage && (
            <>
              {typeof errorMessage === 'string'
                ? errorMessage
                : errorMessage?.message}
            </>
          )}
        </p>
      )}
    </div>
  )
}
