import { WrapperProps } from '../types'
//import backgroundImage from 'assets/images/background.svg'

const BackgroundWrapper = ({ children }: WrapperProps) => {
  return (
    <div
      className="h-vh bg-cover bg-center bg-no-repeat p-4 sm:p-6"
      style={{ backgroundImage: 'url()' }}
    >
      {children}
    </div>
  )
}

export default BackgroundWrapper
