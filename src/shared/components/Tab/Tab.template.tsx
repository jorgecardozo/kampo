// Libraries
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

// Components
import { DynamicDropdown } from 'components/DynamicDropdown'

// Types
import { Tab, TabTemplateProps } from './Tab.types'

export const TabTemplate = ({
  tabs,
  openTab,
  keyIndex,
  setOpenTab,
}: TabTemplateProps) => {
  const mobileTab = tabs.map((tab: Tab, index: number) => {
    return { value: `${index}`, label: tab.name }
  })

  const [selectedMenuOption, setSelectedMenuOption] = useState(mobileTab[0])

  const selectMenuOptionHandler = (selected: any) => {
    setSelectedMenuOption(selected)
    setOpenTab(selected.label)
  }

  useEffect(() => {
    const newTab = mobileTab.find((tab) => tab.label === openTab)
    setSelectedMenuOption(newTab)
  }, [openTab])

  return (
    <div className="h-full border-gray-200 text-center font-medium text-black dark:border-gray-700 dark:text-gray-400">
      <div className="md:hidden">
        <DynamicDropdown
          options={mobileTab}
          selectedOption={selectedMenuOption}
          onSelectOption={selectMenuOptionHandler}
          placeHolder="Elige un rol"
          color={'white'}
          backgroundColor={'#0b757a'}
          fontWeight="bold"
        />
      </div>
      <ul className="-mb-px flex-wrap hidden md:flex">
        {tabs.map((tab: Tab) => (
          <li key={tab.name}>
            <a
              onClick={() => setOpenTab(tab.name)}
              className={clsx(
                'border-transparent inline-block cursor-pointer hover:border-tab-line-bg rounded-t-lg border-b-2 p-2 px-4 transition duration-300 hover:text-black dark:hover:text-tab-line-bg font-bold',
                openTab === tab.name
                  ? 'border-tab-line-bg border-t-2 border-x bg-tab-bg text-tab-text-selected  hover:bg-tab-selected-hover-bg hover:text-tab-text-selected-hover-bg'
                  : 'hover:border-gray-300 mt-[2px]'
              )}
            >
              {tab.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="h-[calc(100%-20px)] box-border py-2">
        {tabs.map((tab) => {
          if (tab.name !== openTab) return
          return (
            <div
              key={`${tab.name}-${keyIndex}`}
              className={
                tab.name === openTab ? 'flex flex-col h-full' : 'hidden'
              }
            >
              {tab.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
