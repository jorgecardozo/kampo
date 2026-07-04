import { CheckTemplate } from './Check.template'
import { CheckProps } from './Check.types'

export const Check = ({ ...props }: CheckProps) => {
  return <CheckTemplate {...props} />
}
