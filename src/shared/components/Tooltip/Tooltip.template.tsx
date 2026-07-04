import { TooltipProps, IconProps } from './Tooltip.types'

const InfoIcon = ({ width = 16, height = 16, fill = '#257FA4' }: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5 8C15.5 3.86438 12.1356 0.5 8 0.5C3.86438 0.5 0.5 3.86438 0.5 8C0.5 12.1356 3.86438 15.5 8 15.5C12.1356 15.5 15.5 12.1356 15.5 8ZM1.25 8C1.25 4.2782 4.2782 1.25 8 1.25C11.7218 1.25 14.75 4.2782 14.75 8C14.75 11.7218 11.7218 14.75 8 14.75C4.2782 14.75 1.25 11.7218 1.25 8ZM8 6.5C8.18424 6.5 8.33724 6.63252 8.36896 6.80755L8.375 6.875V12.125C8.375 12.3323 8.20728 12.5 8 12.5C7.81576 12.5 7.66276 12.3675 7.63104 12.1925L7.625 12.125V6.875C7.625 6.66772 7.79272 6.5 8 6.5ZM8.36896 3.80755C8.33724 3.63252 8.18424 3.5 8 3.5C7.79272 3.5 7.625 3.66772 7.625 3.875V4.625L7.63104 4.69245C7.66276 4.86748 7.81576 5 8 5C8.20728 5 8.375 4.83228 8.375 4.625V3.875L8.36896 3.80755Z"
        fill={fill}
      />
    </svg>
  )
}

export const TooltipTemplate = ({ children }: TooltipProps) => {
  return (
    <button
      type="button"
      aria-labelledby="aclaración"
      className="relative group"
    >
      <span
        className="opacity-0 min-w-[200px] bg-[#667080] text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 group-focus:opacity-100 bottom-1/2 -left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 pointer-events-none "
        id="aclaración"
      >
        {children}
      </span>
      <svg
        className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 absolute z-10 w-6 h-6 text-orange-500 transform -translate-x-[9px] -translate-y-[25px] fill-[#667080] stroke-[#667080]"
        width="8"
        height="8"
      >
        <rect x="12" y="-10" width="8" height="8" transform="rotate(45)" />
      </svg>
      <div className="w-3 h-3">
        <InfoIcon width={13} height={13} fill="#257FA4" />
      </div>
    </button>
  )
}
