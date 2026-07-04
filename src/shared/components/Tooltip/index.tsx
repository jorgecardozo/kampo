import { TooltipTemplate } from './Tooltip.template'
import { TooltipProps } from './Tooltip.types'

export const Tooltip = ({ ...props }: TooltipProps) => {
  return <TooltipTemplate {...props} />
}
