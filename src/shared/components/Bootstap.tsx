// Libraries
import { useEffect, useState } from 'react'

// Hooks
import { useSession } from 'hooks/useSession'
import { useValidate } from 'hooks/useValidate'

// Store
import { useEffectOnce } from 'hooks/useEffectOnce'

interface BootstrapProps {
  children: React.ReactNode
}

export const Bootstrap = ({ children }: BootstrapProps) => {
  return <>{children}</>
}
