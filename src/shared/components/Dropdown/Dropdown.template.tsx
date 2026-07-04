// Libraries
import React, { useState } from 'react'

// Types
import { DropdownTemplateProps } from './Dropdown.types'
import ChevronDown from 'assets/icons/chevron-down.svg'
import { TextBody } from 'components/Text'
export const DropdownTemplate = ({ children }: DropdownTemplateProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative h-[42.19px] w-full rounded-full bg-white md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-100 flex w-full justify-between rounded-full bg-[#0b757a] px-4 py-2 text-center text-sm font-medium text-white"
      >
        <div></div>
        <TextBody className="text-center font-bold">Filtros</TextBody>
        <img
          className={isOpen ? 'rotate-180' : ''}
          src={ChevronDown.src}
          alt="left arrow"
        ></img>
      </button>
      {isOpen && (
        <div className="mt-2 rounded-lg border bg-white p-2 shadow-lg">
          {/* Aquí puedes colocar tus filtros */}
          {children}
        </div>
      )}
    </div>
  )
}
