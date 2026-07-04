// Libraries
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { paths } from 'lib/utils/paths'

export const useValidate = () => {
  const router = useRouter()

  const pathsToValidate: Record<string, () => boolean> = {
    [paths.root]: () => true,
    [paths.forgot.path]: () => true,
    [paths.changePassword.path]: () => true,
    [paths.dashboard.path]: () => true,
  }

  useEffect(() => {
    if (pathsToValidate[router.pathname] && !pathsToValidate[router.pathname]()) {
      router.push(paths.dashboard.path)
    }
  }, [router.pathname])
}
