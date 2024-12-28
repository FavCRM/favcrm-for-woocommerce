import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from '@wordpress/api-fetch';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form'
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useFetch } from '../../services/useFetch';
const { __ } = wp.i18n;

export default function MembershipTierForm({ nonce }) {
  const navigate = useNavigate();
  const { membershipTierId } = useParams();
  const [locale, setLocale] = useState('en')

  const {
    data: thisMembershipTier,
  } = useFetch('membership-tier', `/fav/v1/membership-tiers/${membershipTierId}`, nonce, !!membershipTierId)

  useEffect(() => {
    const locale = document.documentElement.lang.split('-')[0];
    setLocale(locale)
  }, [])

  useEffect(() => {
    if (thisMembershipTier) {
      reset({
        ...thisMembershipTier,
        spendingCount: +thisMembershipTier.spendingCount,
        totalSpendingAmount: +thisMembershipTier.totalSpendingAmount,
        multiplier: +thisMembershipTier.multiplier,
        discount: +thisMembershipTier.discount,
      })
    }
  }, [thisMembershipTier])

  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm({
    defaultValues: {
      name: "",
      spendingCount: 0,
      totalSpendingAmount: 0,
      description: "",
      multiplier: 1,
      discount: 0,
    },
  });

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      if (!membershipTierId) {
        return await apiFetch({
          path: '/fav/v1/membership-tiers',
          method: 'POST',
          headers: {
            'X-WP-Nonce': nonce,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      return await apiFetch({
        path: `/fav/v1/membership-tiers/${membershipTierId}`,
        method: 'PATCH',
        headers: {
          'X-WP-Nonce': nonce,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      if (data?.success) {
        window.location.href = '/wp-admin/admin.php?page=fav-crm-membership-tiers';
      } else if (data?.errorCode || data?.error) {
        setError(data.error);
      }
    }
  });

  const onSubmit = (data) => {
    mutate(data);
  }

  return (
    <div>
      <div className="mb-2 flex gap-2 ">
        <h1 className="wp-heading-inline">
          {
            !!membershipTierId
              ? __(`Edit Membership Tier`, 'favcrm-for-woocommerce')
              : __(`Add Membership Tier`, 'favcrm-for-woocommerce')
          }
        </h1>
        <hr className="wp-header-end" />
        {
          !!membershipTierId && (
            <div className="my-auto">
              <button
                className="cursor-pointer p-1 text-red-800 bg-slate-50 border-solid border-red-800 rounded hover:text-white hover:bg-red-800"
                type="button"
                onClick={async () => {
                  if (!confirm(`You are about to delete membership ${thisMembershipTier?.name}, click confirm to delete.`))
                    return

                  const deleteResponse = await apiFetch({
                    path: `/fav/v1/membership-tiers/${membershipTierId}`,
                    method: 'DELETE',
                    headers: {
                      'X-WP-Nonce': nonce,
                      'Content-Type': 'application/json',
                    },
                  });

                  window.location.href = '/wp-admin/admin.php?page=fav-crm-membership-tiers';
                }}
              >
                Delete
              </button>
            </div>
          )
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
                  <label htmlFor="spendingCount">
                    {__('Spending Count', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="spendingCount"
                    type="number"
                    className="regular-text"
                    {...register('spendingCount', {
                      required: __('Spending Count is required', 'favcrm-for-woocommerce'),
                      validate: {
                        validRange: v => (v >= 0) || "Spending Count should be >= 0",
                      },
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.spendingCount?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="totalSpendingAmount">
                    {__('Total Spending Amount', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="totalSpendingAmount"
                    type="number"
                    className="regular-text"
                    {...register('totalSpendingAmount', {
                      valueAsNumber: true,
                      required: __('Total Spending Amount is required', 'favcrm-for-woocommerce'),
                      validate: {
                        validRange: v => (v >= 0) || "Total Spending Amount should be>= 0",
                      },
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.totalSpendingAmount?.message}</div>}
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
                  <label htmlFor="multiplier">
                    {__('Multiplier', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="multiplier"
                    type="number"
                    className="regular-text"
                    {...register('multiplier', {
                      valueAsNumber: true,
                      validate: {
                        validRange: v => v >= 1 || "Multiplier should be >= 1",
                      }
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.multiplier?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="discount">
                    {__('Discount (%)', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="discount"
                    type="number"
                    className="regular-text"
                    {
                    ...register('discount', {
                      valueAsNumber: true,
                      validate: {
                        validRange: v => (v >= 0 && v <= 100) || "Discount should between 0-100",
                      }
                    })
                    }
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.discount?.message}</div>}
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
                          : __(!membershipTierId ? 'Add' : 'Save', 'favcrm-for-woocommerce')
                      }
                    </button>
                    <button
                      className="cursor-pointer p-2 rounded border border-red-700 text-red-700 bg-slate-50 hover:bg-slate-100"
                      type="button"
                      onClick={() => navigate(-1)}
                    >
                      {__(!membershipTierId ? 'Back' : 'Cancel', 'favcrm-for-woocommerce')}
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
