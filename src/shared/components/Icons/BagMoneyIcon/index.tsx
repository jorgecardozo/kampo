import { BagMoneyIconTemplate } from './BagMoneyIcon.template'
import { BagMoneyIconProps } from './BagMoneyIcon.types'

export const BagMoneyIcon = ({ ...props }: BagMoneyIconProps) => {
  return <BagMoneyIconTemplate {...props} />
}
