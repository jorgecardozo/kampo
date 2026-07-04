import { TabTemplate } from './Tab.template'
import { TabTemplateProps } from './Tab.types'

const Tab = ({ ...props }: TabTemplateProps) => {
  return <TabTemplate {...props} />
}

export default Tab
