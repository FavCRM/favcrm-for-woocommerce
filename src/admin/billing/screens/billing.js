import React from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useQuery, useMutation } from '@tanstack/react-query';
import classNames from 'classnames';

import LoadingSpinner from '../../../components/LoadingSpinner';

const { __ } = wp.i18n;

export default function Billing({ nonce }) {
  const { data, isLoading, error } = useQuery({ queryKey: ['subscriptionPlans'], queryFn: async () => {
    const result = await apiFetch({
      path: '/fav/v1/subscription-plans',
      headers: {
        'X-WP-Nonce': nonce,
      }
    });

    return result;
  }});
  const { data: subscriptionData, refetch } = useQuery({ queryKey: ['subscription'], queryFn: async () => {
    const result = await apiFetch({
      path: '/fav/v1/subscription',
      headers: {
        'X-WP-Nonce': nonce,
      }
    });

    return result;
  }});
  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async ({ priceId, subscriptionId }) => {
      const result = await apiFetch({
        path: '/fav/v1/change-subscription-plan',
        method: 'POST',
        headers: {
          'X-WP-Nonce': nonce,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          subscription_id: subscriptionId,
        }),
      });

      return result;
    },
    onSuccess: ({ data }) => {
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.status === 'success') {
        refetch();
      }
    }
  });

  const handlePlanChange = (priceId) => {
    mutate({
      priceId,
      subscriptionId: subscriptionData?.stripeSubscriptionId,
    });
  }

  const getSubscriptionButtonText = (item) => {
    if (!subscriptionData || isMutating) {
      return (
        <LoadingSpinner
          isLoading={isMutating}
          color="text-black"
          size="size-4"
        />
      )
    }

    if (item.id === subscriptionData?.plan) {
      return __('Current Plan', 'favcrm-for-woocommerce');
    } else {
      return __('Change Plan', 'favcrm-for-woocommerce');
    }
  }

  return (
    <div>
      <div className="mb-2">
        <h1 className="wp-heading-inline">{__('Billing', 'favcrm-for-woocommerce')}</h1>
        <h2 className="mt-0 text-gray-500 font-normal">{__('Manage billing and your subscription plan.', 'favcrm-for-woocommerce')}</h2>
        <hr className="wp-header-end" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {
          isLoading && Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white shadow rounded p-4">
              <div className="animate-pulse rounded-md bg-[#AAA] h-6 w-1/2 mb-1"></div>
              <div className="animate-pulse rounded-md bg-[#AAA] h-6 w-1/4 mb-2"></div>
              <div className="animate-pulse rounded-md bg-[#AAA] h-6 w-1/4"></div>
            </div>
          ))
        }
        {
          data?.items?.map((item) => (
            <div
              key={item.key}
              className="bg-white shadow rounded p-4"
            >
              <div className="flex justify-between">
                <h2 className="my-0 text-lg font-semibold">{item.name}</h2>
                {
                  parseFloat(item.price) === 0 && (
                    <span className="text-gray-500">Free</span>
                  )
                }
                {
                  parseFloat(item.price) !== 0 && (
                    <span className="text-gray-500">${parseFloat(item.price)}/mo</span>
                  )
                }
              </div>
              <p className="my-0 text-gray-500">{item.description}</p>
              <ul className="list-disc list-inside mt-2">
                {
                  item.features.map((feature) => (
                    <li key={feature.name}>
                      <span>{feature.value}</span>
                      <span>&nbsp;</span>
                      <span>{feature.name}</span>
                    </li>
                  ))
                }
              </ul>
              <div className="mt-4">
                <button
                  disabled={item.id === subscriptionData?.plan || isMutating || !subscriptionData}
                  className={classNames('button button-primary', {
                    'opacity-50 !cursor-default': isMutating || !subscriptionData,
                  })}
                  onClick={() => {
                    if (item.id !== subscriptionData.plan) {
                      handlePlanChange(item.stripePriceId)
                    }
                  }}
                >
                  {getSubscriptionButtonText(item)}
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
