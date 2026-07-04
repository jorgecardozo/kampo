import { WrapperProps } from '../types'

const LogoWrapper = ({ children }: WrapperProps) => {
  return (
    <div className="flex p-4 sm:p-0 sm:justify-start justify-center">
      {children}
    </div>
  )
}

export default LogoWrapper
