import { UserIconTemplate } from './UserIcon.template'
import { UserIconProps } from './UserIcon.types'

export const UserIcon = ({ ...props }: UserIconProps) => {
  return <UserIconTemplate {...props} />
}
