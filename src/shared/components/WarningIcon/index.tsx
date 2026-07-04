import { WarningIconTemplate } from './WarningIcon'
import { WarningIconProps } from './WarningIcon.types'

export const WarningIcon = ({ ...props }: WarningIconProps) => {
  return <WarningIconTemplate {...props} />
}
