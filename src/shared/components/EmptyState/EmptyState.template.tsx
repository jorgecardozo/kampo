import { EmptyStateProps } from './EmptyState.types'

export const EmptyStateTemplate = ({ children }: EmptyStateProps) => {
  return (
    <div className="mt-0.5 flex h-16 w-full items-center justify-center rounded-lg bg-light-gray-200">
      {children}
    </div>
  )
}
