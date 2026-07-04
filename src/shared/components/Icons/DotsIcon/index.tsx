import { DotsIconTemplate } from './DotsIcon.template'
import { DotsIconProps } from './DotsIcon.types'

export const DotsIcon = ({ ...props }: DotsIconProps) => {
  return <DotsIconTemplate {...props} />
}
