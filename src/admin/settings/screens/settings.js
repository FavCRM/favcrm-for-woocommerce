import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import LoadingSpinner from '../../../components/LoadingSpinner';

const { __ } = wp.i18n;

const permissions = [
  "Read",
  "Write",
]

export default function Settings({ nonce }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['settings'], queryFn: async () => {
      const result = await apiFetch({
        path: '/fav/v1/settings',
        headers: {
          'X-WP-Nonce': nonce,
        }
      });

      return result;
    }
  });

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
  const [roles, setRoles] = useState({
    "Administrator": ["Read", "Write"],
    "Shop Manager": ["Read"],
  });

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

  const handleLogout = async () => {
    const result = await apiFetch({
      path: '/fav/v1/company-logout',
      method: 'POST',
      headers: {
        'X-WP-Nonce': nonce,
      },
    })

    console.log(result)
    location.href = '/wp-admin/admin.php?page=favcrm-for-register';
  }

  return (
    <div>
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <h1 className="wp-heading-inline">{__('FavCRM for WooCommerce Account Settings', 'favcrm-for-woocommerce')}</h1>
          <button
            className="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <hr className="wp-header-end" />
      </div>
      <div>
        <form onSubmit={handleSubmit(onFinish)}>
          <table className="form-table">
            <tbody>
              <tr>
                <th scope="row">
                  <label htmlFor="pointsToCashConversionRate">
                    {__('Points to Cash Conversion Rate', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="pointsToCashConversionRate"
                    type="text"
                    className="regular-text mb-1"
                    {...register('pointsToCashConversionRate', { required: __('Required', 'favcrm-for-woocommerce') })}
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
                      <div className="error-message text-red-500 font-normal mb-4">{__(error, 'favcrm-for-woocommerce')}</div>
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
                        : __('Save', 'favcrm-for-woocommerce')
                    }
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <section className='w-1/3'>
            <h1>Access Control</h1>
            <div className="grid grid-cols-3">
              <div className='w-full p-4'></div> {permissions.map((perm, i) => (<div key={i} className='text-center font-bold p-4'>{perm}</div>))}
              {Object.keys(roles).map((role, i) => {
                return (
                  <React.Fragment key={i}>
                    <div key={i} className='h-8 font-bold text-end p-4'>{role}</div>
                    {permissions.map((perm, i) => (
                      <div key={i} className='text-center p-4'>
                        <input
                          type="checkbox"
                          name={perm}
                          checked={roles[role].find(thisPerm => thisPerm === perm)}
                          onChange={(e) => {
                            const { checked, name } = e.target
                            if (checked) {
                              setRoles(roles => ({ ...roles, [role]: [...roles[role], name] }))
                            } else {
                              setRoles(roles => ({
                                ...roles, [role]: roles[role].filter((exisitingPermission) => {
                                  return exisitingPermission !== name
                                })
                              }))
                            }
                          }}
                        />
                      </div>
                    ))}
                  </React.Fragment>
                )
              })}
              <div></div>
              <div>
                <button
                  className="button button-primary w-fit mx-auto"
                  type="button"
                  disabled={isMutating}
                >
                  {
                    __('Set Permission', 'favcrm-for-woocommerce')
                  }
                </button>
              </div>
              <div></div>
            </div>
          </section>
          <br />
        </form>
      </div>
    </div>
  )
}
