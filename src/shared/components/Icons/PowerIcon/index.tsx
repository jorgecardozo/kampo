import { PowerIconTemplate } from './PowerIcon.template'
import { PowerIconProps } from './PowerIcon.types'

export const PowerIcon = ({ ...props }: PowerIconProps) => {
  return <PowerIconTemplate {...props} />
}
