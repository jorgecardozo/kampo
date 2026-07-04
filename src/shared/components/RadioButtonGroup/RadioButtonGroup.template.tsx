import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import { RadioButtonGroupProps } from './RadioButtonGroup.types'

export const RadioButtonGroupTemplate = ({
  legend,
  children,
  legendClass,
  containerClass,
  className,
  errors,
  name,
  icon,
}: RadioButtonGroupProps) => {
  const errorMessage = errors && errors[name]
  const hasError = !!(errors && errorMessage)

  return (
    <fieldset className={clsx(containerClass, 'relative')}>
      <div className="flex items-start gap-2">
        {icon && <Image src={icon} alt="" />}
        <legend className={clsx(legendClass, 'mb-4 text-xs')}>{legend}</legend>
      </div>
      <div className={clsx(className, 'flex gap-5')}>{children}</div>
      {hasError && (
        <p className="absolute top-4 mt-1 text-error text-xs mb-5">
          {errorMessage.message}
        </p>
      )}
    </fieldset>
  )
}
