import React from 'react'
import { NumberInputProps } from './NumberInput.types'
import clsx from 'clsx'
import { getNestedProperty } from 'lib/utils/helpers'
import { NumericFormat } from 'react-number-format'
import { Controller, FieldValues } from 'react-hook-form'

export const NumberInputTemplate = <
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  label,
  placeholder,
  prefix,
  suffix,
  thousandSeparator,
  decimalSeparator = ',',
  decimalScale = 0,
  rules,
  errors,
  isAllowed,
  control,
  type,
  disabled,
  className,
  allowNegative = false,
}: NumberInputProps<TFieldValues>) => {
  const errorMessage = errors && getNestedProperty(errors, name)
  const hasError = !!(errors && errorMessage)

  return (
    <div className={clsx(className, 'relative')}>
      <label
        htmlFor={name}
        className={clsx(
          'absolute -top-2 left-3 bg-white px-1 text-xs',
          disabled ? 'text-gray-400' : 'text-black'
        )}
      >
        {label}
      </label>
      <Controller<TFieldValues>
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <NumericFormat
            className={clsx(
              'h-12 block w-full rounded-md border py-3 px-3 text-sm leading-3 focus:outline-focus',
              disabled
                ? 'border-gray-400 placeholder:opacity-90'
                : 'border-black placeholder:text-input-placeholder'
            )}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            prefix={prefix}
            suffix={suffix}
            placeholder={placeholder}
            id={name}
            onValueChange={(values) => onChange(values.floatValue)}
            name={name}
            isAllowed={isAllowed}
            type={type}
            disabled={disabled}
            value={value}
            onBlur={onBlur}
            getInputRef={ref}
            allowNegative={allowNegative}
          />
        )}
        name={name}
        control={control}
        rules={rules}
      />
      {hasError && (
        <p className="absolute mt-1 text-xs text-error">
          {errorMessage.message}
        </p>
      )}
    </div>
  )
}