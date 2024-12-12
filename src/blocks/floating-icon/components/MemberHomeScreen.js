import { __ } from '@wordpress/i18n'
import { Gift, X, ChevronRight, Divide, FileText } from 'feather-icons-react'

export default function MemberHomeScreen({ site, setShow, setScreen, member }) {
  const numberFormat = new Intl.NumberFormat('en-US', {})

  return (
    <>
      <header className="bg-gray-700 text-white px-4 pt-6 pb-16 sm:!rounded-t-2xl flex justify-between">
        <div>
          <div>{__('Reward Balance', 'favcrm-for-woocommerce')}</div>
          <h1 className="text-2xl font-bold">{numberFormat.format(member.points)}</h1>
        </div>
        <div>
          <X className="cursor-pointer hover:stroke-[#EEE] duration-300" onClick={() => setShow(false)} />
        </div>
      </header>
      <div className="px-4 grid gap-y-4 pb-4">
        <div className="bg-white rounded-3xl flex flex-col items-center w-full -mt-8 px-4 py-6">
          <div className="font-medium mb-2">{site.title} {__('Points', 'favcrm-for-woocommerce')}</div>
          {
            site.settings.pointsToCashConversionRate > 0 && (
              <div className="text-gray-500 text-sm mb-6">{site.settings.pointsToCashConversionRate} {__('Points', 'favcrm-for-woocommerce')} = $1</div>
            )
          }
          {
            !site.settings.pointsToCashConversionRate && (
              <div className="text-gray-500 text-sm mb-6">{__('To earn rewards and gifts', 'favcrm-for-woocommerce')}</div>
            )
          }
          <div
            className="flex justify-between px-2 py-4 w-full cursor-pointer rounded-md hover:bg-gray-100 duration-200"
            onClick={() => setScreen('reward-scheme')}
          >
            <div className="flex items-center">
              <Divide className="mr-2 stroke-[#999]" />
              <div>{__('Earn points and rewards', 'favcrm-for-woocommerce')}</div>
            </div>
            <ChevronRight className="stroke-[#999]" />
          </div>
          <div
            className="flex justify-between px-2 py-4 w-full cursor-pointer rounded-md hover:bg-gray-100 duration-200"
            onClick={() => setScreen('gift-offer')}
          >
            <div className="flex items-center">
              <Gift className="mr-2 stroke-[#999]" />
              <div>{__('Redeem Gift Rewards', 'favcrm-for-woocommerce')}</div>
            </div>
            <ChevronRight className="stroke-[#999]" />
          </div>
        </div>
        <div className="bg-white rounded-3xl flex flex-col items-center w-full px-4 py-6">
          <div
            className="flex justify-between px-2 py-4 w-full cursor-pointer rounded-md hover:bg-gray-100 duration-200"
            onClick={() => setScreen('my-reward')}
          >
            <div className="flex items-center">
              <Gift className="mr-2 stroke-[#999]" />
              <div>{__('My Rewards', 'favcrm-for-woocommerce')}</div>
            </div>
            <ChevronRight className="stroke-[#999]" />
          </div>
          <div
            className="flex justify-between px-2 py-4 w-full cursor-pointer rounded-md hover:bg-gray-100 duration-200"
            onClick={() => setScreen('activity')}
          >
            <div className="flex items-center">
              <FileText className="mr-2 stroke-[#999]" />
              <div>{__('Reward Activities', 'favcrm-for-woocommerce')}</div>
            </div>
            <ChevronRight className="stroke-[#999]" />
          </div>
        </div>
      </div>
    </>
  )
}
