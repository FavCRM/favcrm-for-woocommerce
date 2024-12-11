import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import LoadingSpinner from '../../../components/LoadingSpinner';

const { __ } = wp.i18n;

export default function Settings({ nonce }) {
  const { data, isLoading, error } = useQuery({ queryKey: ['settings'], queryFn: async () => {
    const result = await apiFetch({
      path: '/fav/v1/settings',
      headers: {
        'X-WP-Nonce': nonce,
      }
    });

    return result;
  }});

  if (!data || isLoading) {
    return (
      <div className="flex">
        <LoadingSpinner
          isLoading={true}
          color="text-black"
          size="size-4"
        />
      </div>
    )
  }

  return (
    <SettingsContent
      nonce={nonce}
      settings={data}
    />
  )
}

function SettingsContent({ nonce, settings }) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: settings,
  });
  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const result = await apiFetch({
        path: '/fav/v1/settings',
        method: 'POST',
        headers: {
          'X-WP-Nonce': nonce,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return result;
    },
    onSuccess: (data) => {
      if (data?.errorCode) {
        setError(data.error);
      }
    }
  });

  const onFinish = (data) => {
    mutate(data);
  }

  return (
    <div>
      <div className="mb-2">
        <h1 className="wp-heading-inline">{__('FavCRM for WooCommerce Account Settings', 'favored')}</h1>
        <hr className="wp-header-end" />
      </div>
      <div>
        <form onSubmit={handleSubmit(onFinish)}>
          <table className="form-table">
            <tbody>
              <tr>
                <th scope="row">
                  <label htmlFor="pointsToCashConversionRate">
                    {__('Points to Cash Conversion Rate', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="pointsToCashConversionRate"
                    type="text"
                    className="regular-text mb-1"
                    {...register('pointsToCashConversionRate', { required: __('Required', 'favored')})}
                  />
                  <div>Note: Enter 0 to disable</div>
                  {
                    errors.pointsToCashConversionRate && (
                      <div className="mt-1 error-message text-red-500 font-normal">{errors.pointsToCashConversionRate.message}</div>
                    )
                  }
                </td>
              </tr>
              <tr>
                <th scope="row">
                </th>
                <td>
                  {
                    error && (
                      <div className="error-message text-red-500 font-normal mb-4">{__(error, 'favored')}</div>
                    )
                  }
                  <button
                    className="button button-primary"
                    type="submit"
                    disabled={isMutating}
                  >
                    {
                      isMutating
                        ? <LoadingSpinner
                            isLoading={isMutating}
                            color="text-black"
                            size="size-4"
                          />
                        : __('Save', 'favored')
                    }
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  )
}
