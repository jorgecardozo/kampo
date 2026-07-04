import { ReactElement } from 'react'
import MainFull from './MainFull'

// Helper para el patrón de layout persistente (Next.js getLayout).
// Uso en una página:  Page.getLayout = mainLayout(pageTitle)
export const mainLayout =
  (pageTitle?: string) =>
  (page: ReactElement) =>
    <MainFull pageTitle={pageTitle}>{page}</MainFull>
