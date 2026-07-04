import { HamburgerIconProps } from './HamburgerIcon.types'

export const HamburgerIconTemplate = ({
  className,
  width = 24,
  height = 24,
  fill = '#FFFFFF',
  hoverFill,
  title,
}: HamburgerIconProps) => {
  return (
    <div className={`${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={`fill-current transition-colors duration-200 fill-[${fill}] hover:fill-[${
          hoverFill ? hoverFill : fill
        }]`}
        // className="fill-current transition-colors duration-200 fill-[#000000] hover:fill-[#07969a]"
      >
        <title>{title}</title>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22 7C22 6.44772 21.5523 6 21 6H3C2.44772 6 2 6.44772 2 7C2 7.55228 2.44772 8 3 8H21C21.5523 8 22 7.55228 22 7ZM21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H21ZM21 16C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H3C2.44772 18 2 17.5523 2 17C2 16.4477 2.44772 16 3 16H21Z"
        />
      </svg>
    </div>
  )
}
