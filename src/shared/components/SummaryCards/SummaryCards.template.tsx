// Libraries
import React, { useState } from 'react'

// Types
import { SummaryCardsTemplateProps } from './SummaryCards.types'
import { TextBodyXs, TextHeadingH2, TextHeadingH4 } from 'components/Text'
import { DotsIcon } from 'components/Icons/DotsIcon'
import { PeopleIcon } from 'components/Icons/PeopleIcon'
import { BagMoneyIcon } from 'components/Icons/BagMoneyIcon'
import { CashDollarIcon } from 'components/Icons/CashDollarIcon'
import { PAYMENT_STATUS, PAYMENT_STATUS_LABEL } from 'lib/utils/constants'
import { formatNumberPrice } from 'lib/utils/helpers'

export const SummaryCardsTemplate = ({
  summary,
}: SummaryCardsTemplateProps) => {
  return (
    <div className="flex flex-wrap gap-8">
      <div className="md flex h-[200px] w-full flex-col gap-4 rounded-lg border-bright-turquoise-400 bg-white py-2 text-gray-500 shadow-lg md:w-[300px] lg:w-[400px]">
        <DotsIcon width={50} height={50}></DotsIcon>
        <div className="flex flex-col justify-center gap-4 pl-5">
          <TextHeadingH4 className="text-start font-bold">
            Empleados
          </TextHeadingH4>
          <div className="flex items-center gap-2">
            <PeopleIcon width={50} height={50} fill="#FFFFFF"></PeopleIcon>
            <TextHeadingH2>
              {formatNumberPrice(summary.total_people)}
            </TextHeadingH2>
          </div>
        </div>
      </div>
      <div className="flex h-[200px] w-full flex-col gap-4 rounded-lg border-bright-turquoise-400 bg-white py-2 text-gray-500 shadow-lg md:w-[300px] lg:w-[400px]">
        <DotsIcon width={50} height={50}></DotsIcon>
        <div className="flex flex-col items-start justify-center gap-4 px-5">
          <div className="flex w-full items-center justify-between gap-2">
            <TextHeadingH4 className="text-start font-bold">
              Ganancias
            </TextHeadingH4>
            <TextBodyXs className="pt-1">
              <span className="inline-flex items-center rounded-md bg-green-200 px-2 py-1 font-medium text-green-700 ring-1 ring-inset ring-gray-500/10">
                {PAYMENT_STATUS_LABEL[PAYMENT_STATUS['PAID']]}
              </span>
            </TextBodyXs>
          </div>
          <div className="flex items-center gap-2">
            <BagMoneyIcon width={50} height={50} fill="#FFFFFF"></BagMoneyIcon>

            <div className="flex items-center gap-2">
              <TextHeadingH2>
                {formatNumberPrice(summary.total_owner_price_pay)}{' '}
              </TextHeadingH2>
              {/* <TextHeadingH4 className="pt-3">Millones </TextHeadingH4> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[200px] w-full flex-col gap-4 rounded-lg border-bright-turquoise-400 bg-white py-2 text-gray-500 shadow-lg md:w-[300px] lg:w-[400px]">
        <DotsIcon width={50} height={50}></DotsIcon>
        <div className="flex flex-col items-start justify-center gap-4 px-5">
          <div className="flex w-full items-center justify-between gap-2">
            <TextHeadingH4 className="text-start font-bold">
              Ganancias
            </TextHeadingH4>
            <TextBodyXs className="pt-1">
              <span className="inline-flex items-center rounded-md bg-golden-fizz-200 px-2 py-1 font-medium text-golden-fizz-700 ring-1 ring-inset ring-gray-500/10">
                {PAYMENT_STATUS_LABEL[PAYMENT_STATUS['IN_PROGRESS']]}
              </span>
            </TextBodyXs>
          </div>
          <div className="flex items-center gap-2">
            <BagMoneyIcon width={50} height={50} fill="#FFFFFF"></BagMoneyIcon>

            <div className="flex items-center gap-2">
              <TextHeadingH2>
                {formatNumberPrice(summary.total_owner_price_in_progress)}{' '}
              </TextHeadingH2>
              {/* <TextHeadingH4 className="pt-3">Millones </TextHeadingH4> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[200px] w-full flex-col gap-4 rounded-lg border-bright-turquoise-400 bg-white py-2 text-gray-500 shadow-lg md:w-[300px] lg:w-[400px]">
        <DotsIcon width={50} height={50}></DotsIcon>
        <div className="flex flex-col items-start justify-center gap-4 px-5">
          <div className="flex w-full items-center justify-between gap-2">
            <TextHeadingH4 className="text-start font-bold">
              Ganancias
            </TextHeadingH4>
            <TextBodyXs className="pt-1">
              <span className="inline-flex items-center rounded-md bg-red-200 px-2 py-1 font-medium text-red-700 ring-1 ring-inset ring-gray-500/10">
                {PAYMENT_STATUS_LABEL[PAYMENT_STATUS['NOT_PAY']]}
              </span>
            </TextBodyXs>
          </div>

          <div className="flex items-center gap-2">
            <BagMoneyIcon width={50} height={50} fill="#FFFFFF"></BagMoneyIcon>

            <div className="flex items-center gap-2">
              <TextHeadingH2>
                {formatNumberPrice(summary.total_owner_price_no_pay)}
              </TextHeadingH2>
              {/* <TextHeadingH4 className="pt-3">Millones </TextHeadingH4> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[200px] w-full flex-col gap-4 rounded-lg border-bright-turquoise-400 bg-white py-2 text-gray-500 shadow-lg md:w-[300px] lg:w-[400px]">
        <DotsIcon width={50} height={50}></DotsIcon>
        <div className="flex flex-col items-start justify-center gap-4 px-5">
          <div className="flex w-full items-center justify-between gap-2">
            <TextHeadingH4 className="text-start font-bold">
              Pagos
            </TextHeadingH4>
            <TextBodyXs className="pt-1">
              <span className="inline-flex items-center rounded-md bg-green-200 px-2 py-1 font-medium text-green-700 ring-1 ring-inset ring-gray-500/10">
                {PAYMENT_STATUS_LABEL[PAYMENT_STATUS['PAID']]}
              </span>
            </TextBodyXs>
          </div>
          <div className="flex items-center gap-2">
            <CashDollarIcon
              width={50}
              height={50}
              fill="#FFFFFF"
            ></CashDollarIcon>

            <div className="flex items-center gap-2">
              <TextHeadingH2>
                {formatNumberPrice(summary.total_price_pay)}{' '}
              </TextHeadingH2>
              {/* <TextHeadingH4 className="pt-3">Millones </TextHeadingH4> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[200px] w-full flex-col gap-4 rounded-lg border-bright-turquoise-400 bg-white py-2 text-gray-500 shadow-lg md:w-[300px] lg:w-[400px]">
        <DotsIcon width={50} height={50}></DotsIcon>
        <div className="flex flex-col items-start justify-center gap-4 px-5">
          <div className="flex w-full items-center justify-between gap-2">
            <TextHeadingH4 className="text-start font-bold">
              Pagos
            </TextHeadingH4>
            <TextBodyXs className="pt-1">
              <span className="inline-flex items-center rounded-md bg-golden-fizz-200 px-2 py-1 font-medium text-golden-fizz-700 ring-1 ring-inset ring-gray-500/10">
                {PAYMENT_STATUS_LABEL[PAYMENT_STATUS['IN_PROGRESS']]}
              </span>
            </TextBodyXs>
          </div>
          <div className="flex items-center gap-2">
            <CashDollarIcon
              width={50}
              height={50}
              fill="#FFFFFF"
            ></CashDollarIcon>
            <div className="flex items-center gap-2">
              <TextHeadingH2>
                {formatNumberPrice(summary.total_price_in_progress)}{' '}
              </TextHeadingH2>
              {/* <TextHeadingH4 className="pt-3">Mil </TextHeadingH4> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[200px] w-full flex-col gap-4 rounded-lg border-bright-turquoise-400 bg-white py-2 text-gray-500 shadow-lg md:w-[300px] lg:w-[400px]">
        <DotsIcon width={50} height={50}></DotsIcon>
        <div className="flex flex-col items-start justify-center gap-4 px-5">
          <div className="flex w-full items-center justify-between gap-2">
            <TextHeadingH4 className="text-start font-bold">
              Pagos
            </TextHeadingH4>
            <TextBodyXs className="pt-1">
              <span className="inline-flex items-center rounded-md bg-red-200 px-2 py-1 font-medium text-red-700 ring-1 ring-inset ring-gray-500/10">
                {PAYMENT_STATUS_LABEL[PAYMENT_STATUS['NOT_PAY']]}
              </span>
            </TextBodyXs>
          </div>
          <div className="flex items-center gap-2">
            <CashDollarIcon
              width={50}
              height={50}
              fill="#FFFFFF"
            ></CashDollarIcon>
            <div className="flex items-center gap-2">
              <TextHeadingH2>
                {formatNumberPrice(summary.total_price_no_pay)}{' '}
              </TextHeadingH2>
              {/* <TextHeadingH4 className="pt-3">Mil </TextHeadingH4> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
