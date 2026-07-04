import { EmptyStateTemplate } from './EmptyState.template'
import { EmptyStateProps } from './EmptyState.types'

const EmptyState = ({ ...props }: EmptyStateProps) => {
  return <EmptyStateTemplate {...props} />
}

export default EmptyState
