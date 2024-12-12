import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import LoadingSpinner from '../../../components/LoadingSpinner';

const { __ } = wp.i18n;

export default function Login({ nonce }) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const result = await apiFetch({
        path: '/fav/v1/company-login',
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
      if (data?.success) {
        window.location.href = '/wp-admin/admin.php?page=fav-crm';
      } else if (data?.errorCode) {
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
        <h1 className="wp-heading-inline">{__('FavCRM for WooCommerce Account Signin', 'favcrm-for-woocommerce')}</h1>
        <hr className="wp-header-end" />
      </div>
      <div>
        <form onSubmit={handleSubmit(onFinish)}>
          <table className="form-table">
            <tbody>
              <tr>
                <th scope="row">
                  <label for="email">
                    {__('Email', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="email"
                    type="text"
                    className="regular-text"
                    {...register('email', { required: __('Required', 'favcrm-for-woocommerce')})}
                  />
                  {
                    errors.email && (
                      <div className="mt-1 error-message text-red-500 font-normal">{errors.email.message}</div>
                    )
                  }
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="password">
                    {__('Password', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="password"
                    type="password"
                    className="regular-text"
                    {...register('password', { required: __('Required', 'favcrm-for-woocommerce')})}
                  />
                  {
                    errors.password && (
                      <div className="mt-1 error-message text-red-500 font-normal">{errors.password.message}</div>
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
                        : __('Submit', 'favcrm-for-woocommerce')
                    }
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <div className="flex gap-x-4 items-center mt-12">
          <div>{__('Not yet have an account?', 'favcrm-for-woocommerce')}</div>
          <a
            href="/wp-admin/admin.php?page=fav-crm-register"
            className="button"
          >
            {__('Sign Up', 'favcrm-for-woocommerce')}
          </a>
        </div>
      </div>
    </div>
  )
}
