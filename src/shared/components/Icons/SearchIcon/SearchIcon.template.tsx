import { SearchIconProps } from './SearchIcon.types'

export const SearchIconTemplate = ({
  className,
  width = 24,
  height = 24,
  fill = '#FFFFFF',
  hoverFill,
  title,
}: SearchIconProps) => {
  return (
    <div className={`${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        // className={`fill-current transition-colors duration-200 fill-[${fill}] hover:fill-[${
        //   hoverFill ? hoverFill : fill
        // }]`}
        fill="none"
      >
        <title>{title}</title>
        <circle cx="10.5" cy="11.5" r="4.5" stroke={fill} strokeWidth="2" />
        <line
          x1="15.3906"
          y1="14.2425"
          x2="17.7425"
          y2="15.8594"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
