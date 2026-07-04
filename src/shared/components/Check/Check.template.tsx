// Libraries
import React from 'react'
import clsx from 'clsx'

// Assets
import checkGreen from 'assets/images/check-color.svg'
import checkGray from 'assets/images/check-gray.svg'

// Interfaces
import { CheckProps } from './Check.types'

export const CheckTemplate = ({ children, checked, className }: CheckProps) => {
  return (
    <div
      className={clsx(
        'dark:text-gray-40 flex items-center gap-1 text-subtitle italic',
        checked && 'text-[#26996F]',
        className
      )}
    >
      <div className="flex items-end">
        {checked ? (
          <img src={checkGreen.src} alt="" />
        ) : (
          <img src={checkGray.src} alt="" />
        )}
      </div>
      {children}
    </div>
  )
}
