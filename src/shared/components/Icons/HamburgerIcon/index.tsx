import { HamburgerIconTemplate } from './HamburgerIcon.template'
import { HamburgerIconProps } from './HamburgerIcon.types'

export const HamburgerIcon = ({ ...props }: HamburgerIconProps) => {
  return <HamburgerIconTemplate {...props} />
}
