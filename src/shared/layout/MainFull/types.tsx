import React from 'react'

export type LayoutProps = {
  component?: React.ComponentType<any>
  pageTitle?: string
  children?: React.ReactNode
}

export type WrapperProps = {
  children: React.ReactNode
  withPadding?: boolean
}

export type ContentWrapperProps = {
  children: React.ReactNode
  withPadding?: boolean
}
