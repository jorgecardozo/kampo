import React from 'react'

import { RadioButtonProps } from './RadioButton.types'

export const RadioButtonTemplate = ({
  value,
  name,
  children,
  register,
  rules,
  checked,
  handleClick,
}: RadioButtonProps) => {
  return (
    <div className="flex gap-x-2.5">
      <input
        type="radio"
        id={name}
        name={name}
        value={value}
        className="h-5 w-5 accent-cta"
        checked={checked}
        onClick={handleClick}
        {...register(name, rules)}
      />
      <label htmlFor={name} className="text-xs">
        {children}
      </label>
    </div>
  )
}
