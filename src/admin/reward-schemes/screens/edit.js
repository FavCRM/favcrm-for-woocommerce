import { __ } from '@wordpress/i18n';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from '@wordpress/api-fetch';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form'
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useFetch } from '../../services/useFetch';

export default function RewardSchemeForm({ nonce }) {
  const navigate = useNavigate();
  const { rewardSchemeId } = useParams();
  const [locale, setLocale] = useState('en')

  // console.log({ rewardSchemeId })
  const {
    data: thisRewardScheme,
    isLoading: rewardSchemeLoading,
    error: rewardSchemeError,
    refetch: rewardSchemeRefresh
  } = useFetch("reward-scheme", `/fav/v1/reward-schemes/${rewardSchemeId}`, nonce)

  useEffect(() => {
    const locale = document.documentElement.lang.split('-')[0];
    setLocale(locale)

    if (!rewardSchemeLoading) {
      // set existing records for PATCH update
      if (rewardSchemeId) {
        reset({ ...thisRewardScheme })
      }
    }

  }, [rewardSchemeLoading])

  const action = rewardSchemeId ? "Edit" : "Add"

  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const reqData = { ...data }

      if (!rewardSchemeId) {
        return await apiFetch({
          path: '/fav/v1/reward-schemes',
          method: 'POST',
          headers: {
            'X-WP-Nonce': nonce,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        });
      }

      return await apiFetch({
        path: `/fav/v1/reward-schemes/${rewardSchemeId}`,
        method: 'PATCH',
        headers: {
          'X-WP-Nonce': nonce,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData),
      });
    },
    onSuccess: (data) => {
      if (data?.success) {
        window.location.href = '/wp-admin/admin.php?page=fav-crm-reward-schemes';
      } else if (data?.errorCode || data?.error) {
        setError(data.error);
      }
    }
  });

  const onSubmit = (data) => {
    mutate(data);
  }

  return (
    (!rewardSchemeLoading) &&
    <div>
      <div className="mb-2 flex gap-2 ">
        <h1 className="wp-heading-inline">{__(`${action} Reward Scheme`, 'favcrm-for-woocommerce')}</h1>
        <hr className="wp-header-end" />
        {
          !!rewardSchemeId &&
          <div className="my-auto">
            <button
              className="cursor-pointer p-1 text-red-800 bg-slate-50 border-solid border-red-800 rounded hover:text-white hover:bg-red-800"
              type="button"
              onClick={async () => {
                if (!confirm(`You are about to delete scheme ${thisRewardScheme?.name}, click confirm to delete.`))
                  return

                const deleteResponse = await apiFetch({
                  path: `/fav/v1/reward-schemes/${rewardSchemeId}`,
                  method: 'DELETE',
                  headers: {
                    'X-WP-Nonce': nonce,
                    'Content-Type': 'application/json',
                  },
                });

                window.location.href = '/wp-admin/admin.php?page=fav-crm-reward-schemes';
              }}> Delete </button>
          </div>
        }
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="form-table">
            <tbody>
              <tr>
                <th scope="row">
                  <label htmlFor="Name">
                    {__('Name', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="name"
                    type="text"
                    className="regular-text"
                    {...register('name', { required: __('Tier name is required', 'favcrm-for-woocommerce') })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.name?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="amount">
                    {__('Amount', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="amount"
                    type="text"
                    className="regular-text"
                    {...register('amount', {
                      required: __('Amount is required', 'favcrm-for-woocommerce'),
                      validate: {
                        isNumber: v => parseInt(v) || "Please enter nubmer",
                        validRange: v => (v >= 0) || "Amount should be >= 0",
                      },
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.amount?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="points">
                    {__('Points', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="points"
                    type="text"
                    className="regular-text"
                    {...register('points', {
                      required: __('Points is required', 'favcrm-for-woocommerce'),
                      validate: {
                        isNumber: v => parseInt(v) || "Please enter nubmer",
                        validRange: v => (v >= 0) || "Points should be>= 0",
                      },
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.points?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="stamps">
                    {__('Stamps', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="stamps"
                    type="text"
                    className="regular-text"
                    {...register('stamps', {
                      validate: {
                        isNumber: v => parseInt(v) || "Please enter nubmer",
                        validRange: v => (v >= 0) || "Stamps should >= 0",
                      }
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.stamps?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="description">
                    {__('Description', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="description"
                    type="text"
                    className="regular-text"
                    {...register('description', {})}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.description?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="isDefault">
                    {__('Default', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="isDefault"
                    type="checkbox"
                    className="regular-text"
                    {
                    ...register('isDefault', {})
                    }
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.isDefault?.message}</div>}
                </td>
              </tr>

              <tr>
                <th scope="row">
                </th>
                <td>
                  {
                    error && (
                      <div className="error-message text-red-500 font-normal mb-4">error: {__(error, 'favcrm-for-woocommerce')}</div>
                    )
                  }
                  <div className="flex gap-2">
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
                          : __(!rewardSchemeId ? 'Add' : 'Save', 'favcrm-for-woocommerce')
                      }
                    </button>
                    <button
                      className="cursor-pointer p-2 rounded border border-red-700 text-red-700 bg-slate-50 hover:bg-slate-100"
                      type="button"
                      onClick={() => navigate(-1)}
                    >
                      {__(!rewardSchemeId ? 'Back' : 'Cancel', 'favcrm-for-woocommerce')}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  )
}
