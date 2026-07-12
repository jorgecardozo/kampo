import { ContentWrapperProps } from '../types'
import clsx from 'clsx'

const ContentWrapper = ({
  children,
  withPadding = false,
}: ContentWrapperProps) => {
  return (
    <div
      id="layout-content-wrapper"
      className={clsx(
        withPadding
          ? 'relative z-10 flex h-full grow flex-col p-6 sm:px-6 sm:pb-16 sm:pt-6'
          : 'flex min-h-full grow flex-col sm:w-full'
      )}
    >
      {children}
    </div>
  )
}

export default ContentWrapper
