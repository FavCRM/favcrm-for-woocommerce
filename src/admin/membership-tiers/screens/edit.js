import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from '@wordpress/api-fetch';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form'
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useFetch } from '../../services/useFetch';
const { __ } = wp.i18n;

export default function MembershipTierForm({ nonce }) {
  const navigate = useNavigate();
  const { membershipTierId } = useParams();
  const [locale, setLocale] = useState('en')
  const [membershipTiers, setMembershipTiers] = useState([])

  // console.log({ membershipTierId })
  const {
    data: allTiers,
    isLoading: membertierLoading,
    error: membertierError,
    refetch: membertierRefresh
  } = useFetch("membership-tiers", `/fav/v1/membership-tiers?page=1&page_size=1000`, nonce)

  const thisMembershipTier = (() => {
    if (!membershipTierId) return null
    return allTiers?.items?.find(tier => +tier?.id === +membershipTierId)
  })()

  useEffect(() => {
    const locale = document.documentElement.lang.split('-')[0];
    setLocale(locale)

    if (!membertierLoading && allTiers?.items) {
      // set existing records for PATCH update
      if (membershipTierId) {
        reset({
          ...thisMembershipTier,
          spendingCount: +thisMembershipTier.spendingCount,
          totalSpendingAmount: +thisMembershipTier.totalSpendingAmount,
          multiplier: +thisMembershipTier.multiplier,
          discount: +thisMembershipTier.discount,
        })
      }

      setMembershipTiers(() => allTiers?.items)
    }

  }, [membertierLoading])

  const action = membershipTierId ? "Edit" : "Add"

  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm();

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const reqData = { ...data }

      const result = await (async () => {
        if (!membershipTierId) {
          return await apiFetch({
            path: '/fav/v1/membership-tiers',
            method: 'POST',
            headers: {
              'X-WP-Nonce': nonce,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData),
          });
        }

        return await apiFetch({
          path: `/fav/v1/membership-tiers/${membershipTierId}`,
          method: 'PATCH',
          headers: {
            'X-WP-Nonce': nonce,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        });
      })()

      return result;
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
    // console.log("submitting...")
    const hasConflict = membershipTiers.find(({ spendingCount, totalSpendingAmount }) => {
      return +spendingCount === +data.spendingCount &&
        +totalSpendingAmount === +data.totalSpendingAmount
    })

    /* handle create new if conflict, Key (company_id, spending_count, total_spending_amount) */
    if (!membershipTierId && hasConflict) {
      setError(`spending count(${hasConflict.spendingCount}) & total spending amount(${hasConflict.totalSpendingAmount}) are conflicting with existing tier: ${hasConflict.name}, please change these fields to different value`)
      return
    }

    mutate(data);
  }

  return (
    (!membertierLoading) &&
    <div>
      <div className="mb-2 flex gap-2 ">
        <h1 className="wp-heading-inline">{__(`${action} Membership Tier`, 'favored')}</h1>
        <hr className="wp-header-end" />
        {
          !!membershipTierId &&
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
                  <label for="Name">
                    {__('Name', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="name"
                    type="text"
                    className="regular-text"
                    {...register('name', { required: __('Tier name is required', 'favored') })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.name?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="spendingCount">
                    {__('Spending Count', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="spendingCount"
                    type="text"
                    className="regular-text"
                    {...register('spendingCount', {
                      required: __('Spending Count is required', 'favored'),
                      validate: {
                        isNumber: v => parseInt(v) || "Please enter nubmer",
                        validRange: v => (v >= 0) || "Spending Count should be >= 0",
                      },
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.spendingCount?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="totalSpendingAmount">
                    {__('Total Spending Amount', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="totalSpendingAmount"
                    type="text"
                    className="regular-text"
                    {...register('totalSpendingAmount', {
                      required: __('Total Spending Amount is required', 'favored'),
                      validate: {
                        isNumber: v => parseInt(v) || "Please enter nubmer",
                        validRange: v => (v >= 0) || "Total Spending Amount should be>= 0",
                      },
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.totalSpendingAmount?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="description">
                    {__('Description', 'favored')}
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
                  <label for="multiplier">
                    {__('Multiplier', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="multiplier"
                    type="text"
                    className="regular-text"
                    {...register('multiplier', {
                      validate: {
                        isNumber: v => parseInt(v) || "Please enter nubmer",
                        validRange: v => (v >= 0) || "Multiplier should >= 0",
                      }
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.multiplier?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="discount">
                    {__('Discount (%)', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="discount"
                    type="text"
                    className="regular-text"
                    {
                    ...register('discount', {
                      validate: {
                        isNumber: v => v === 0 ? true : parseInt(v) || "Please enter nubmer",
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
                      <div className="error-message text-red-500 font-normal mb-4">error: {__(error, 'favored')}</div>
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
                          : __(!membershipTierId ? 'Add' : 'Save', 'favored')
                      }
                    </button>
                    <button
                      className="cursor-pointer p-2 rounded border border-red-700 text-red-700 bg-slate-50 hover:bg-slate-100"
                      type="button"
                      onClick={() => navigate(-1)}
                    >
                      {__(!membershipTierId ? 'Back' : 'Cancel', 'favored')}
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
