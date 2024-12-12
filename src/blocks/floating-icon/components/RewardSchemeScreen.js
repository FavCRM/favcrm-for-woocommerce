import { X, ChevronLeft } from 'feather-icons-react'
import apiFetch from '@wordpress/api-fetch'
import { useQuery } from '@tanstack/react-query'
import { __, sprintf } from '@wordpress/i18n'

import LoadingSpinner from '../../../components/LoadingSpinner';

export default function RewardSchemeScreen({ site, setScreen }) {
  const query = useQuery({ queryKey: ['rewardSchemes'], queryFn: async () => {
    const response = await apiFetch({
      path: '/fav/v1/reward-schemes'
    });

    return response;
  }})

  return (
    <div>
      <header className="bg-gray-700 text-white px-4 py-6 sm:!rounded-t-2xl flex justify-between">
        <div className="flex gap-x-2">
          <ChevronLeft className="cursor-pointer" onClick={() => setScreen('welcome')} />
          <div>{site.title} {__('Member Zone', 'favcrm-for-woocommerce')}</div>
        </div>
        <div>
          <X className="cursor-pointer hover:stroke-[#EEE] duration-300" onClick={() => setScreen('welcome')} />
        </div>
      </header>
      <main className="p-4">
        <div>
          <h3 className="text-sm text-gray-500 mb-4">{__('Reward Scheme', 'favcrm-for-woocommerce')}</h3>
          <LoadingSpinner isLoading={query.isLoading} />
          <div className="grid gap-y-2">
            {
              query.data?.map(scheme => (
                <div key={scheme.id} className="bg-white rounded-md w-full px-4 py-4">
                  <div>{scheme.name}</div>
                  <div className="text-gray-500 text-sm flex gap-x-2">
                    <div>
                      {sprintf(__('Every $%s spent and earn', 'favcrm-for-woocommerce'), parseFloat(scheme.amount))}
                    </div>
                    {
                      !!scheme.points && (
                        <div>{sprintf(__('%s Points', 'favcrm-for-woocommerce'), parseFloat(scheme.points))}</div>
                      )
                    }
                    {
                      !!scheme.points && !!scheme.stamps && (
                        <div>{__('and', 'favcrm-for-woocommerce')}</div>
                      )
                    }
                    {
                      !!scheme.stamps && (
                        <div>{sprintf(__('%s Stamps', 'favcrm-for-woocommerce'), parseFloat(scheme.stamps))}</div>
                      )
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </main>
    </div>
  )
}
