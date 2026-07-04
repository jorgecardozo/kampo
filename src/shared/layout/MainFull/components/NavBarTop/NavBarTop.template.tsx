// Libraries
import React, { useState } from 'react'

// Components
import { TextBody, TextHeadingH5 } from 'components/Text'
import { AgricultureIcon } from 'components/Icons/AgricultureIcon'
import { PowerIcon } from 'components/Icons/PowerIcon'
import { UserIcon } from 'components/Icons/UserIcon'
import Sidebar from '../Sidebar'

// Types
import { NavBarTopProps } from './NavBarTop.types'
import { COLORS } from 'lib/utils/constants'
import { useSelectors } from 'store/selectors'
import { useSession } from 'hooks/useSession'

const NavBarTopTemplate = ({ show = true }: NavBarTopProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useSelectors()
  const { logout } = useSession()

  return (
    <>
      <div className="h-[70px] flex-none md:h-[74px]">
        <nav className="relative bg-navbar-bg bg-opacity-85 shadow-lg z-20 flex justify-between gap-4 border-b border-navbar-border-bg px-6 py-4 md:gap-0 lg:px-16">
          <div id="menu" className="flex">
            <Sidebar className="flex" isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>

          <div
            id="logo-agri-math"
            title="AgriMath"
            className="absolute left-1/2 grow -translate-x-1/2 items-center justify-center self-center cursor-pointer flex gap-2"
          >
            <AgricultureIcon
              className={
                'rounded-xl p-2 border border-agriculture-icon-border hidden md:block'
              }
              fill={COLORS['AgricultureIconInTopBar']}
            />

            <TextHeadingH5 className="hidden md:block text-agriculture-icon-text">
              Agri Math
            </TextHeadingH5>
          </div>

          <div
            id="point-of-sale-and-user-name"
            className="flex grow items-center justify-end gap-4"
          >
            <div
              className={
                'max-w-44 items-center rounded-3xl bg-profile-bg px-3 py-2 lg:justify-end gap-1 flex cursor-pointer'
              }
              title="Jorge Cardozo"
            >
              <UserIcon fill={COLORS['UserIcon']} />
              <TextBody
                className={
                  'truncate text-profile-text font-semibold lg:block hover:text-black'
                }
              >
                {user.firstname} {user.lastname}
              </TextBody>
            </div>
            <div
              onClick={() => {
                logout()
              }}
              className="z-99"
            >
              <PowerIcon
                className="cursor-pointer"
                fill="#000000"
                hoverFill="#07969a"
                title="Cerrar Sesión"
              />
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export default NavBarTopTemplate
