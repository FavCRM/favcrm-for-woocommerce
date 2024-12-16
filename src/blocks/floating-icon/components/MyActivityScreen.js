import { X, ChevronLeft } from 'feather-icons-react'
import apiFetch from '@wordpress/api-fetch'
import { useQuery } from '@tanstack/react-query'
import { __, sprintf } from '@wordpress/i18n'

import LoadingSpinner from '../../../components/LoadingSpinner';

export default function ActivityScreen({ site, setScreen }) {
  const query = useQuery({ queryKey: ['activities'], queryFn: async () => {
    const response = await apiFetch({
      path: '/fav/v1/my-activities'
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
          <h3 className="text-sm text-gray-500 mb-4">{__('Reward Activities', 'favcrm-for-woocommerce')}</h3>
          <LoadingSpinner isLoading={query.isLoading} />
          <div className="grid gap-y-2">
            {
              query.data?.items.map(activity => (
                <div key={activity.id} className="bg-white rounded-md w-full px-4 py-4">
                  <div>{activity.transactionType}</div>
                  <div className="text-gray-500 text-sm flex gap-x-4">
                    {
                      !!activity.points && (
                        <div>{sprintf(__('%s Points', 'favcrm-for-woocommerce'), new Intl.NumberFormat('en-US').format(activity.points))}</div>
                      )
                    }
                    {
                      !!activity.stamps && (
                        <div>{sprintf(__('%s Stamps', 'favcrm-for-woocommerce'), new Intl.NumberFormat('en-US').format(activity.stamps))}</div>
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
