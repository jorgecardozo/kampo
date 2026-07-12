// Libraries
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { paths } from 'lib/utils/paths'

export const useValidate = () => {
  const router = useRouter()
  const pathname = usePathname()

  const pathsToValidate: Record<string, () => boolean> = {
    [paths.root]: () => true,
    [paths.forgot.path]: () => true,
    [paths.changePassword.path]: () => true,
    [paths.dashboard.path]: () => true,
  }

  useEffect(() => {
    if (pathsToValidate[pathname] && !pathsToValidate[pathname]()) {
      router.push(paths.dashboard.path)
    }
  }, [pathname])
}
