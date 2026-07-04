import React, { forwardRef, useState } from 'react'
import { TextInputProps } from './TextInput.types'
import clsx from 'clsx'
import { motion } from 'framer-motion'

const classes = {
  underline: 'block py-3 px-3 w-full focus:outline-none',
  default:
    'block border border-main-300 text-black rounded-md py-3 px-3 text-base leading-3 w-full placeholder-placeholder focus:border-main-500 focus:ring-2 focus:ring-main-500 focus-visible:border-main-500 focus-visible:ring-2 focus-visible:ring-main-500 outline-none transition-colors duration-200',
}

const TextInputContent = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      name,
      label,
      type = 'text',
      placeholder,
      register,
      rules,
      errors,
      icon,
      disabled,
      className,
      labelClassName,
      description,
      variant = 'default',
      inputHeight = 'default',
      onFocus,
      onKeyUp,
      labelUp,
      ...motionProps // Extraer las props de motion
    },
    ref
  ) => {
    const errorMessage = errors && errors[name]
    const hasError = !!(errors && errorMessage)
    const [isFocused, setIsFocused] = useState(false)

    // const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    //   setIsFocused(true)
    //   onFocus?.(e)
    // }

    // const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    //   setIsFocused(false)
    // }

    // Registrar el input con los eventos
    const registerWithEvents = {
      ...register(name, rules),
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)
        onFocus?.(e)
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)
        register(name, rules).onBlur(e) // Mantener el comportamiento original de register
      },
    }

    return (
      <motion.div
        className="relative"
        {...motionProps} // Pasar las props de motion al input
      >
        {label && (
          <label
            htmlFor={name}
            className={clsx(
              'absolute bg-white px-1 ',
              labelUp
                ? '-top-7 -left-1 text-md'
                : clsx(
                  '-top-2 left-3 text-xs',
                  // isFocused
                  //   ? 'border border-main-500 rounded'
                  //   : 'text-gray-400'
                ),
              disabled
                ? 'border-disabled placeholder-disabled text-disabled'
                : 'text-black',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <label>
          {icon && icon}
          <input
            className={clsx(
              disabled &&
              '!border-disabled !text-disabled placeholder-disabled',
              classes[variant],
              className,
              icon && 'pl-10',
              inputHeight === 'lg' ? 'h-10' : 'h-12'
            )}
            type={type}
            id={name}
            ref={ref}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            // onFocus={onFocus}
            // onKeyUp={onKeyUp}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
            {...registerWithEvents} // Usar el register modificado
          />
        </label>
        {hasError && (
          <p className="absolute mt-1 text-xs text-error">
            {errorMessage && (
              <>
                {typeof errorMessage === 'string'
                  ? errorMessage
                  : errorMessage?.message}
              </>
            )}
          </p>
        )}
        {description && (
          <p
            className={clsx(
              hasError ? 'mt-5' : 'mt-2',
              'text-xs italic text-subtitle'
            )}
          >
            {description}
          </p>
        )}
      </motion.div>
    )
  }
)

TextInputContent.displayName = 'TextInputContent'

export const TextInputTemplate = TextInputContent
