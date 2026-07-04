export type TabTemplateProps = {
  tab?: string
  tabs?: Array<Tab>
  openTab?: string
  keyIndex?: number
  setOpenTab?: React.Dispatch<React.SetStateAction<string>>
}

export type Tab = {
  name: string
  content: React.ReactNode
}
