// Libraries
import React from 'react'
import clsx from 'clsx'

// Interfaces
import { WarningIconProps } from './WarningIcon.types'

export const WarningIconTemplate = ({
  color,
  className,
  width = '24',
  height = '24',
}: WarningIconProps) => {
  return (
    <div className={clsx(className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="B. Digital,  Tech &#38; Docs/d. Symbols/BD540-alert | SYMBOLS, alert, alerta, aviso, warning, peligro, danger, error">
          <path
            id="Vector"
            d="M12 7.5V13.5M12 16V17M13.7309 3.98965L21.262 16.9979C22.0339 18.3313 21.0718 20 19.5311 20H4.46889C2.92823 20 1.96611 18.3313 2.73804 16.9979L10.2691 3.98965C11.0395 2.65908 12.9605 2.65908 13.7309 3.98965Z"
            stroke="#191D21"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}
