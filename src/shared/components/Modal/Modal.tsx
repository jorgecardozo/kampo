// Libraries
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { usePortal } from 'hooks/usePortal'

// Models
import {
  ModalComponentsProps,
  ModalHeaderProps,
  ModalProps,
} from './Modal.types'
import { CloseIcon } from 'components/Icons/CloseIcon'

// Utils
import { COLORS } from 'lib/utils/constants'

const DESKTOP_SIZES = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-2xl',
  lg: 'sm:max-w-4xl',
  xl: 'sm:max-w-5xl',
  '2xl': 'sm:max-w-6xl',
  '3xl': 'sm:max-w-7xl',
}

const Modal = ({
  children,
  isOpen,
  size = 'lg',
  className,
  classContainer,
}: ModalProps) => {
  const portal = usePortal()

  useEffect(() => {
    const next = document.getElementById('__next')
    next?.setAttribute('aria-hidden', isOpen.toString())
    next?.setAttribute('inert', isOpen.toString())
    portal.current?.setAttribute('aria-hidden', (!isOpen).toString())

    return () => {
      next?.removeAttribute('aria-hidden')
      next?.removeAttribute('inert')
    }
  }, [isOpen, portal])

  return createPortal(
    <div
      className="relative z-[99]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-20 transition-opacity backdrop-blur-[2px]"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto p-4">
        <div className="flex h-full items-center justify-center text-center sm:p-0">
          <div
            className={clsx(
              size && DESKTOP_SIZES[size],
              className && className,
              'relativetransform rounded-2xl bg-white text-left shadow-xl transition-all sm:m-8 sm:w-full mt-12 md:mt-7'
            )}
          >
            <div className={clsx('bg-white rounded-2xl', classContainer && classContainer)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>,
    portal.current
  )
}

const ModalHeader = ({
  children,
  className,
  onClose,
  setIsOpen,
}: ModalHeaderProps) => {
  return (
    <div
      className={clsx(
        'flex justify-between items-baseline border-b border-b-[#E1E6EB] rounded-t-2xl px-8 py-4 md:py-3.5',
        className
      )}
    >
      <div>{children}</div>
      <div
        className="cursor-pointer flex justify-center items-center"
        onClick={(e) => {
          if (onClose) onClose(e)
          setIsOpen(false)
        }}
      >
        <CloseIcon width={15} height={15} fill={COLORS['CloseModalIcon']} />
      </div>
    </div>
  )
}

const ModalContent = ({ children, className }: ModalComponentsProps) => {
  return <div className={clsx('px-4 py-2', className)}>{children}</div>
}

const ModalActions = ({ children, className }: ModalComponentsProps) => {
  return <div className={clsx('pt-2 pb-2 rounded-b-2xl', className)}>{children}</div>
}

Modal.Header = ModalHeader
Modal.Content = ModalContent
Modal.Actions = ModalActions

export default Modal
