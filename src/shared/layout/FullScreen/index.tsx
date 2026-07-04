// Libraries
import Head from 'next/head'
import clsx from 'clsx'

// Assets
import LogoRight from 'assets/images/santander-consumer.svg'

// Utils
import { DEFAULT_TITLE } from 'lib/utils/constants'

const FullScreenLayout = ({
  component: Component,
  pageTitle,
  className,
  hasLogo = false,
}: LayoutProps) => {
  const title = pageTitle || DEFAULT_TITLE

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div
        className={clsx(
          'flex h-screen w-full items-center justify-center bg-gray-100',
          className
        )}
      >
        <div className="flex flex-col items-center">
          {hasLogo && (
            <img
              className="mb-14"
              src={LogoRight.src}
              alt="Santander Consumer"
            />
          )}
          <div className="w-full max-w-[720px]">
            <Component />
          </div>
        </div>
      </div>
    </>
  )
}

export type LayoutProps = {
  component: React.ComponentType<any>
  pageTitle?: string
  className?: string
  hasLogo?: boolean
}

export default FullScreenLayout
