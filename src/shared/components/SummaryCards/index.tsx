import { SummaryCardsTemplate } from './SummaryCards.template'
import { SummaryCardsTemplateProps } from './SummaryCards.types'

const SummaryCards = ({ ...props }: SummaryCardsTemplateProps) => {
  return <SummaryCardsTemplate {...props} />
}

export default SummaryCards
