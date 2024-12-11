import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import LoadingSpinner from '../../../components/LoadingSpinner';

const { __ } = wp.i18n;

export default function Register({ nonce }) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: '',
      phone: '',
      email: '',
      contactPerson: '',
      referralSource: '',
      agreeToTermsAndConditions: false,
    },
  });
  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const result = await apiFetch({
        path: '/fav/v1/company-signup',
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
        <h1 className="wp-heading-inline">{__('FavCRM for WooCommerce Account Registration', 'favored')}</h1>
        <h2 className="mt-0 text-gray-500 font-normal">{__('Create new account and get started', 'favored')}</h2>
        <hr className="wp-header-end" />
      </div>
      <div>
        <form onSubmit={handleSubmit(onFinish)}>
          <table className="form-table">
            <tbody>
              <tr>
                <th scope="row">
                  <label for="companyName">
                    {__('Company Name', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="companyName"
                    type="text"
                    className="regular-text"
                    {...register('companyName', { required: __('Required', 'favored')})}
                  />
                  {
                    errors.companyName && (
                      <div className="mt-1 error-message text-red-500 font-normal">{errors.companyName.message}</div>
                    )
                  }
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="phone">
                    {__('Phone', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="phone"
                    type="text"
                    className="regular-text"
                    {...register('phone', { required: __('Required', 'favored')})}
                  />
                  {
                    errors.phone && (
                      <div className="mt-1 error-message text-red-500 font-normal">{errors.phone.message}</div>
                    )
                  }
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="email">
                    {__('Email', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="email"
                    type="text"
                    className="regular-text"
                    {...register('email', { required: __('Required', 'favored')})}
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
                  <label for="contactPerson">
                    {__('Contact Person', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="contactPerson"
                    type="text"
                    className="regular-text"
                    {...register('contactPerson', { required: __('Required', 'favored')})}
                  />
                  {
                    errors.contactPerson && (
                      <div className="mt-1 error-message text-red-500 font-normal">{errors.contactPerson.message}</div>
                    )
                  }
                </td>
              </tr>
              <tr>
                <th scope="row">Checkbox</th>
                <td>
                  <fieldset>
                    <legend className="screen-reader-text">
                      <span>checkbox</span>
                    </legend>
                    <label for="agreeToTermsAndConditions">
                      <input
                        id="agreeToTermsAndConditions"
                        name="agreeToTermsAndConditions"
                        type="checkbox"
                        {...register('agreeToTermsAndConditions', { required: __('Please check the terms of service', 'favored')})}
                      />
                      I've read and agree to the terms of service
                    </label>
                    {
                      errors.agreeToTermsAndConditions && (
                        <div className="error-message text-red-500 font-normal">{errors.agreeToTermsAndConditions.message}</div>
                      )
                    }
                  </fieldset>
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
                        : __('Submit', 'favored')
                    }
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <div className="flex gap-x-4 items-center mt-12">
          <div>{__('Already registered?', 'favored')}</div>
          <a
            href="/wp-admin/admin.php?page=fav-crm-login"
            className="button"
          >
            {__('Login', 'favored')}
          </a>
        </div>
      </div>
    </div>
  )
}
