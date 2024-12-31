import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import LoadingSpinner from '../../../components/LoadingSpinner';

const { __ } = wp.i18n;

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
    >
      <AclForm nonce={nonce} />
    </SettingsContent>
  )
}

function SettingsContent({ children, nonce, settings }) {
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

  const { mutate: aclMutate, isPending: isAclMutating } = useMutation({
    mutationFn: async (data) => {
      const result = await apiFetch({
        path: '/fav/v1/settings/access-control',
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
        </form>

        <div className='w-full h-1 border border-l-0 border-r-0 border-t-0 border-b-1 border-slate-300 border-solid'></div>

        {children}
      </div>
    </div>
  )
}

function AclForm({ nonce }) {
  const permissions = [
    "Read",
    "Write",
    "Delete",
  ]

  const { data, isLoading, error: aclError } = useQuery({
    queryKey: ['access-control'], queryFn: async () => {
      const result = await apiFetch({
        path: '/fav/v1/settings/access-control',
        headers: {
          'X-WP-Nonce': nonce,
        }
      });

      setRoles(() => ({ ...result }))
      return result;
    }
  });

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const reqData = Object.keys(data).reduce((acc, roleName) => {
        acc[roleName] = data[roleName].permissions
        return acc
      }, {})
      const result = await apiFetch({
        path: '/fav/v1/settings/access-control',
        method: 'POST',
        headers: {
          'X-WP-Nonce': nonce,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData),
      });

      return result;
    },
    onSuccess: (data) => {
      if (data?.errorCode) {
        setError(data.error);
      }
    }
  });

  const [roles, setRoles] = useState(data || {});

  return !isLoading && (
    <form onSubmit={(e) => {
      e.preventDefault()
      mutate(roles)
    }}>
      <section className='w-1/3'>
        <h1>Access Control</h1>
        <div className={`grid grid-cols-${permissions.length + 1}`}>
          <div className='border border-solid border-slate-300 border-t-0 border-l-0'>&nbsp;</div>
          {
            permissions.map((perm, i) => (
              <div key={i} className='text-center font-bold p-4 border border-solid border-slate-300 border-t-0 border-l-0'>{perm}</div>
            ))
          }
          {Object.keys(roles).map((roleCode, i) => {
            return (
              <React.Fragment key={i}>
                <div key={i} className='h-8 font-bold text-end p-4 border border-solid border-slate-300 border-t-0 border-l-0'>{roles[roleCode]?.roleName}</div>
                {permissions.map((perm, i) => (
                  <div key={i} className='text-center p-4 border border-solid border-slate-300 border-t-0 border-l-0'>
                    <input
                      type="checkbox"
                      name={perm}
                      checked={roles[roleCode]?.permissions.find(thisPerm => thisPerm === perm)}
                      onChange={(e) => {
                        const { checked, name } = e.target
                        if (checked) { // add checked permission
                          setRoles(roles => ({
                            ...roles,
                            [roleCode]: {
                              ...roles[roleCode],
                              permissions: [...roles[roleCode]?.permissions, name]
                            }
                          }))
                        } else { // remove permission
                          setRoles(roles => ({
                            ...roles,
                            [roleCode]: {
                              ...roles[roleCode],
                              permissions: roles[roleCode]?.permissions.filter((exisitingPermission) => {
                                return exisitingPermission !== name
                              })
                            }
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
              type="submit"
              disabled={isMutating}
            >
              {
                isMutating
                  ? <LoadingSpinner
                    isLoading={isMutating}
                    color="text-black"
                    size="size-4"
                  /> :
                  __('Set Permission', 'favcrm-for-woocommerce')
              }
            </button>
          </div>
          <div></div>
        </div>
      </section>
    </form>
  )
}
