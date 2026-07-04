import { CardsTemplate } from './Cards.template'
import { CardsTemplateProps } from './Cards.types'

const Cards = ({ ...props }: CardsTemplateProps) => {
  return <CardsTemplate {...props} />
}

export default Cards
