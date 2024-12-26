import { useState } from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { __ } from '@wordpress/i18n'
import { X, ChevronLeft } from 'feather-icons-react'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'

import LoadingSpinner from '../../../components/LoadingSpinner';

function RewardRedemption({ rewardRedemption }) {
  const { CART_STORE_KEY } = window.wc.wcBlocksData;
  const useSelect = wp.data.useSelect;
  const result = useSelect((select) => {
    const cartStore = select(CART_STORE_KEY);
    const cartData = cartStore.getCartData();

    return {
      isApplyingCoupon: cartStore.isApplyingCoupon(),
      isRemovingCoupon: cartStore.isRemovingCoupon(),
      appliedCoupons: cartData.coupons,
    }
  });
  const { applyCoupon, removeCoupon } = wp.data.dispatch(CART_STORE_KEY);
  const [isHovering, setIsHovering] = useState(false);

  const isLoading = result.isApplyingCoupon || result.isRemovingCoupon;

  const isCouponApplied = (couponCode) => {
    return result.appliedCoupons?.some(coupon => coupon.code.toUpperCase() === couponCode.toUpperCase());
  }

  return (
    <div className="bg-white rounded-md w-full px-4 py-4 flex">
      <div className="flex-1">
        <div>{rewardRedemption.giftOffer.name}</div>
        <div className="text-gray-500 text-sm">
          {rewardRedemption.giftOffer.description}
        </div>
        {
          rewardRedemption.expiryDate && (
            <div className="text-gray-500 text-sm">
              {__('Valid Until', 'favcrm-for-woocommerce')} {rewardRedemption.expiryDate}
            </div>
          )
        }
      </div>
      {
        !!rewardRedemption.couponCode && (
          <div className="flex items-center">
            <div
              className="relative text-sm px-4 py-1 border border-dashed border-gray-500 hover:bg-gray-100 text-gray-800 font-medium rounded cursor-pointer min-h-[30px] min-w-[80px] flex items-center justify-center"
              onClick={async () => {
                if (isCouponApplied(rewardRedemption.couponCode)) {
                  removeCoupon(rewardRedemption.couponCode);
                  return;
                }
                applyCoupon(rewardRedemption.couponCode)
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {
                isLoading
                  ? (
                      <LoadingSpinner
                        isLoading={isLoading}
                        size="h-4 w-4"
                      />
                  )
                  : rewardRedemption.couponCode
              }
              {
                !isLoading && isCouponApplied(rewardRedemption.couponCode) && (
                  <div className={classNames('absolute top-0 right-0 bottom-0 left-0 text-white text-xs flex items-center justify-center', {
                    'bg-green-500': !isHovering,
                    'bg-gray-500': isHovering,
                  })}>
                    {
                      isHovering
                        ? __('Remove', 'favcrm-for-woocommerce')
                        : __('Applied', 'favcrm-for-woocommerce')
                    }
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

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
          <div>{site.title} {__('Member Zone', 'favcrm-for-woocommerce')}</div>
        </div>
        <div>
          <X className="cursor-pointer hover:stroke-[#EEE] duration-300" onClick={() => setScreen('welcome')} />
        </div>
      </header>
      <main className="p-4">
        <div>
          <h3 className="text-sm text-gray-500 mb-4">{__('My Rewards', 'favcrm-for-woocommerce')}</h3>
          <LoadingSpinner isLoading={query.isLoading} />
          <div className="grid gap-y-2">
            {
              query.data?.items.map(rewardRedemption => (
                <RewardRedemption
                  key={rewardRedemption.id}
                  rewardRedemption={rewardRedemption}
                />
              ))
            }
          </div>
        </div>
      </main>
    </div>
  )
}
