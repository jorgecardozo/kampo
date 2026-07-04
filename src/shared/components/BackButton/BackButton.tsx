// Libraries
import { useRouter } from 'next/router'
import clsx from 'clsx'

// Components
import { TextBody } from 'components/Text'

// Assets
import back from 'assets/images/back.svg'

const BackButton = ({ children, className, onClick }: BackButtonProps) => {
  const router = useRouter()

  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center justify-start gap-2',
        className
      )}
      role="button"
      onClick={(e) => {
        onClick ? onClick(e) : router.back()
      }}
    >
      <div className="flex justify-center gap-2">
        <img src={back.src} alt="warning"></img>
        {children || <TextBody> Volver </TextBody>}
      </div>
    </div>
  )
}

type BackButtonProps = {
  children?: React.ReactNode | string
  className?: string
  onClick?: React.MouseEventHandler
}

export default BackButton
