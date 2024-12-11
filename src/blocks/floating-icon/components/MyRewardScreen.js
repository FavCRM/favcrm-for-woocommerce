import { X, ChevronLeft } from 'feather-icons-react'
import apiFetch from '@wordpress/api-fetch'
import { useQuery } from '@tanstack/react-query'
import { __ } from '@wordpress/i18n'

import LoadingSpinner from '../../../components/LoadingSpinner';

export default function MyRewardScreen({ site, setScreen }) {
  const query = useQuery({ queryKey: ['myRewards'], queryFn: async () => {
    const response = await apiFetch({
      path: '/fav/v1/my-rewards'
    });

    return response;
  }})

  return (
    <div>
      <header className="bg-gray-700 text-white px-4 py-6 sm:!rounded-t-2xl flex justify-between">
        <div className="flex gap-x-2">
          <ChevronLeft className="cursor-pointer" onClick={() => setScreen('welcome')} />
          <div>{site.title} {__('Member Zone', 'favored')}</div>
        </div>
        <div>
          <X className="cursor-pointer hover:stroke-[#EEE] duration-300" onClick={() => setScreen('welcome')} />
        </div>
      </header>
      <main className="p-4">
        <div>
          <h3 className="text-sm text-gray-500 mb-4">我的禮品奬賞</h3>
          <LoadingSpinner isLoading={query.isLoading} />
          <div className="grid gap-y-2">
            {
              query.data?.map(rewardRedemption => (
                <div key={rewardRedemption.id} className="bg-white rounded-md w-full px-4 py-4 flex">
                  <div className="flex-1">
                    <div>{rewardRedemption.giftOffer.name}</div>
                    <div className="text-gray-500 text-sm">
                      {rewardRedemption.giftOffer.description}
                    </div>
                    {
                      rewardRedemption.expiryDate && (
                        <div className="text-gray-500 text-sm">
                          有效期至 {rewardRedemption.expiryDate}
                        </div>
                      )
                    }
                  </div>
                  {
                    !!rewardRedemption.couponCode && (
                      <div className="flex items-center">
                        <div
                          className="text-sm px-4 py-1 border border-dashed border-gray-500 hover:bg-gray-100 text-gray-800 font-medium rounded cursor-pointer"
                        >
                          {rewardRedemption.couponCode}
                        </div>
                      </div>
                    )
                  }
                </div>
              ))
            }
          </div>
        </div>
      </main>
    </div>
  )
}
