import { __, sprintf } from '@wordpress/i18n'
import { Gift, X, ChevronRight, Divide } from 'feather-icons-react'

export default function WelcomeScreen({ site, setShow, setScreen }) {
  return (
    <>
      <header className="bg-gray-700 text-white px-4 pt-6 pb-16 sm:!rounded-t-2xl flex justify-between">
        <div>
          <div>{__('Welcome', 'favored')}</div>
          <h1 className="text-2xl font-bold">{site.title}</h1>
        </div>
        <div>
          <X className="cursor-pointer hover:stroke-[#EEE] duration-300" onClick={() => setShow(false)} />
        </div>
      </header>
      <div className="px-4 grid gap-y-4 pb-4">
        <div className="bg-white rounded-3xl flex flex-col items-center w-full -mt-8 px-4 py-6">
          <div className="font-medium mb-2">
            {sprintf(__('Become %s\'s member', 'favored'), site.title)}
          </div>
          {
            site.settings.pointsToCashConversionRate > 0 && (
              <div className="text-gray-500 text-sm mb-6">{site.settings.pointsToCashConversionRate} {__('Points', 'favored')} = $1</div>
            )
          }
          {
            !site.settings.pointsToCashConversionRate && (
              <div className="text-gray-500 text-sm mb-6">{__('To earn rewards and gifts', 'favored')}</div>
            )
          }
          <a href="/account-register" className="bg-gray-700 hover:bg-gray-500 duration-300 text-white px-6 py-2 rounded-full text-sm mb-4">{__('Register', 'favored')}</a>
          <div className="text-sm">{__('Already a member?', 'favored')} <a href="/account-login" className="underline underline-offet-2 text-gray-500">{__('Login', 'favored')}</a></div>
        </div>
        <div className="bg-white rounded-3xl flex flex-col items-center w-full px-4 py-6">
          <div className="font-medium mb-2">
            {sprintf(__('%s Points', 'favored'), site.title)}
          </div>
          <div className="text-gray-500 text-sm mb-6">{__('Earn points and rewards', 'favored')}</div>
          <div
            className="flex justify-between px-2 py-4 w-full cursor-pointer rounded-md hover:bg-gray-100 duration-200"
            onClick={() => setScreen('reward-scheme')}
          >
            <div className="flex items-center">
              <Divide className="mr-2 stroke-[#999]" />
              <div>{__('Earn Reward Points', 'favored')}</div>
            </div>
            <ChevronRight className="stroke-[#999]" />
          </div>
          <div
            className="flex justify-between px-2 py-4 w-full cursor-pointer rounded-md hover:bg-gray-100 duration-200"
            onClick={() => setScreen('gift-offer')}
          >
            <div className="flex items-center">
              <Gift className="mr-2 stroke-[#999]" />
              <div>{__('Redeem Gift Rewards', 'favored')}</div>
            </div>
            <ChevronRight className="stroke-[#999]" />
          </div>
        </div>
      </div>
    </>
  )
}
