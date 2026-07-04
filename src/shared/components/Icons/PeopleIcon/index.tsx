import { PeopleIconTemplate } from './PeopleIcon.template'
import { PeopleIconProps } from './PeopleIcon.types'

export const PeopleIcon = ({ ...props }: PeopleIconProps) => {
  return <PeopleIconTemplate {...props} />
}
