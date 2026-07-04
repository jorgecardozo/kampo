import { PortfolioIconTemplate } from './PortfolioIcon.template'
import { PortfolioIconProps } from './PortfolioIcon.types'

export const PortfolioIcon = ({ ...props }: PortfolioIconProps) => {
  return <PortfolioIconTemplate {...props} />
}
