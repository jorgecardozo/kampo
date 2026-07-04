import { PhoneNumberTemplate } from './PhoneNumber.template'
import { PhoneNumberProps } from './PhoneNumber.types'

export const PhoneNumber = ({ ...props }: PhoneNumberProps) => {
  return <PhoneNumberTemplate {...props} />
}
