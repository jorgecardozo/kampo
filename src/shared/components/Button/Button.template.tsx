// Libraries
import { clsx } from 'clsx'

// Components
import Loader from 'components/Loader/Loader'

// Interfaces
import { ButtonProps } from './Button.types'

const baseClass =
  'w-full py-3 px-4 rounded-lg  focus:outline-none focus:ring-2 focus:ring-main-500 focus:ring-offset-2 transition-all duration-300 font-medium'

const classes = {
  filled: 'bg-main-500 text-white hover:bg-main-600',
  primary:
    'bg-main-500 !text-white hover:bg-main-600',
  primaryOutline:
    'bg-transparent border-2 border-main-500 text-main-500 hover:bg-main-500 hover:text-white',
  outline:
    'bg-transparent border-2 border-main-400 text-main-500 hover:bg-main-500 hover:text-white',
  outlineBlack:
    'bg-transparent border border-black text-black hover:bg-black/80 hover:text-white',
  outlineBlue:
    'bg-transparent border-2 border-main-400 text-main-500 hover:bg-main-500 hover:text-white',
  outlineRed:
    'bg-transparent border border-red-700 text-red-700 hover:bg-red-700/80 hover:text-white',
  outlineGray:
    'bg-transparent border border-gray-400 text-black hover:bg-gray-400/80 hover:text-white',
  outlineGreen:
    'bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
  blue: 'bg-main-500 text-white bg-gradient-to-b hover:bg-main-600 transition',
  red: 'bg-red-700/90 text-white bg-gradient-to-b hover:bg-red-800 transition',
  gray: 'bg-gray-400/90 text-white bg-gradient-to-b hover:bg-gray-400 transition',
  green:
    'bg-green-400 text-white bg-gradient-to-b hover:bg-green-500 transition',
  text: 'w-fit sm:w-fit px-0 py-0 bg-transparent text-main-500 decoration-main-500 underline hover:text-main-600',
  black:
    'bg-transparent border hover:text-black bg-black/80 text-white hover:border-black hover:bg-white',
}

const disabledClasses = {
  filled:
    'rounded-3xl !bg-main-200 !text-main-400 hover:!bg-main-200 hover:!cursor-auto opacity-50',
  primary:
    'rounded-3xl !bg-main-200 !text-main-400 hover:!bg-main-200 hover:!cursor-auto opacity-50',
  red: 'bg-gray-300 text-[#B7BEC4] hover:!bg-gray-300',
  outlineGray:
    'bg-white border border-disabled-gray text-disabled-gray hover:!text-disabled-gray hover:!bg-white',
  outline:
    'bg-white border-2 border-main-200 text-main-300 hover:!text-main-300 hover:!bg-white opacity-50',
  blue: 'bg-white border-2 border-main-200 text-main-300 hover:!text-main-300 hover:!bg-white opacity-50',
}

const widths = {
  fullWidth: 'w-full',
  auto: 'w-auto',
  fixed: 'w-60',
}

const getLoaderColor = (variant) => {
  switch (variant) {
    case 'filled':
    case 'primary':
      return '#FFFFFF'
    case 'outlineBlue':
    case 'outline':
      return '#2f6bff'
    case 'outlineGray':
      return '#C8C8C8'
    default:
      return '#FFFFFF'
  }
}

export const ButtonTemplate = ({
  onClick,
  children,
  disabled,
  type = 'button',
  className,
  variant = 'filled',
  width,
  loading = false,
  title = '',
}: ButtonProps) => {
  const handleClick = (e) => {
    if (onClick && (!loading || disabled)) onClick(e)
  }

  return (
    <>
      <button
        className={clsx(
          'pl-3 pr-3 md:px-5',
          baseClass,
          widths[width],
          disabled ? disabledClasses[variant] : classes[variant],
          className,
          { 'cursor-auto': loading }
        )}
        onClick={handleClick}
        disabled={disabled}
        type={type}
        title={title}
      >
        {loading ? (
          <Loader
            width={45}
            height={18}
            fill={`${getLoaderColor(variant)}`}
            type="dots"
          />
        ) : (
          children
        )}
      </button>
    </>
  )
}
