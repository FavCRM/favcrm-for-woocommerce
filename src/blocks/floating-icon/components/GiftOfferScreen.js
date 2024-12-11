import { X, ChevronLeft } from 'feather-icons-react'
import apiFetch from '@wordpress/api-fetch'
import { useQuery } from '@tanstack/react-query'
import { __, sprintf } from '@wordpress/i18n'

import LoadingSpinner from '../../../components/LoadingSpinner';
import { useToast } from './toast';

export default function GiftOfferScreen({ site, setScreen, member }) {
  const { toast } = useToast();
  const query = useQuery({ queryKey: ['giftOffers'], queryFn: async () => {
    const response = await apiFetch({
      path: '/fav/v1/gift-offers'
    });

    return response;
  }})

  const handleRedeem = async (giftOfferId) => {
    const result = await apiFetch({
      path: '/fav/v1/reward-redemptions/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gift_offer_id: giftOfferId,
      }),
    });

    if (result == 'INSUFFICIENT_POINTS_OR_STAMPS') {
      toast({
        title: __('Redeem failed', 'favored'),
        description: __('Insufficient points or stamps', 'favored'),
        status: 'error',
        variant: 'destructive'
      });
    } else if (!!result['id']) {
      toast({
        title: __('Redeem success', 'favored'),
        status: 'success',
        variant: 'success'
      });

      setScreen('welcome');
    }
  }

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
          <h3 className="text-sm text-gray-500 mb-4">{__('Gift Rewards', 'favored')}</h3>
          <LoadingSpinner isLoading={query.isLoading} />
          <div className="grid gap-y-2">
            {
              query.data?.map(offer => (
                <div key={offer.id} className="bg-white rounded-md w-full px-4 py-4 flex">
                  <div className="flex-1">
                    <div>{offer.name}</div>
                    <div className="text-gray-500 text-sm flex gap-x-4">
                      {
                        !!offer.points && (
                          <div>
                            {sprintf(__('%s Points', 'favored'), offer.points)}
                          </div>
                        )
                      }
                      {
                        !!offer.stamps && (
                          <div>
                            {sprintf(__('%s Stamps', 'favored'), offer.stamps)}
                          </div>
                        )
                      }
                    </div>
                  </div>
                  {
                    !!member && (offer.points || offer.stamps) && (
                      <div className="flex items-center">
                        <div
                          className="text-sm px-4 py-1 bg-green-500 hover:bg-green-700 text-white rounded cursor-pointer"
                          onClick={() => handleRedeem(offer.id)}
                        >
                          {__('Redeem', 'favored')}
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
