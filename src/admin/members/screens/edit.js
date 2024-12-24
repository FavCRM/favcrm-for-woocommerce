import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from '@wordpress/api-fetch';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form'
import i18nCountries from 'i18n-iso-countries';
const { __ } = wp.i18n;
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import parsePhoneNumber from 'libphonenumber-js'

import LoadingSpinner from '../../../components/LoadingSpinner';
import { useFetch } from '../../services/useFetch';
import { countries } from 'country-codes-flags-phone-codes';
import { ComboBox } from '../../../components/ComboBox'
import { getMonths, getDayByMonth } from '../../../utils/monthDay';

dayjs.extend(customParseFormat);

i18nCountries.registerLocale(require('i18n-iso-countries/langs/en.json'));
i18nCountries.registerLocale(require('i18n-iso-countries/langs/zh.json'));

export default function MemberForm({ nonce }) {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const [locale, setLocale] = useState('en')

  const { data: tiers, isLoading: tiersLoading, error: tiersError, refetch: tiersRefresh } = useFetch("membership-tiers", `/fav/v1/membership-tiers`, nonce)
  const { data: thisMember, isLoading: memberLoading, error: memberError, refetch: memberRefresh } = useFetch("member", `/fav/v1/members/${memberId}`, nonce)

  const action = memberId ? "Edit" : "Add"
  const [error, setError] = useState('');
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { defaultValues, errors },
  } = useForm();

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const reqData = {
        ...data,
        phone: `${data?.areaCode}${data?.phone}`,
        birthMonthAndDay: `${data.month}-${data.day}`,
        membershipTier: +data.membershipTier,
      }

      if (!memberId) {
        return await apiFetch({
          path: '/fav/v1/members',
          method: 'POST',
          headers: {
            'X-WP-Nonce': nonce,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        });
      }

      return await apiFetch({
        path: `/fav/v1/members/${memberId}`,
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
        window.location.href = '/wp-admin/admin.php?page=fav-crm-members';
      } else if (data?.errorCode || data?.error) {
        setError(data.error);
      }
    }
  });

  useEffect(() => {
    const locale = document.documentElement.lang.split('-')[0];
    setLocale(locale)
  }, [])

  useEffect(() => {
    if (!memberLoading && thisMember) {
      const birthMonthAndDay = dayjs(thisMember.birthMonthAndDay, 'MMM-DD')
      const phoneNumber = parsePhoneNumber(thisMember.phone)

      reset({
        ...thisMember,
        areaCode: `+${phoneNumber?.countryCallingCode}`,
        phone: phoneNumber?.nationalNumber,
        membershipTier: thisMember.membershipTier?.id,
        referralMember: thisMember?.referralMember?.phone,
        month: birthMonthAndDay.format('MMM'),
        day: birthMonthAndDay.format('DD'),
      })
    }
  }, [tiersLoading, memberLoading])

  const onFinish = (data) => {
    mutate(data);
  }

  if ((tiersLoading || memberLoading)) {
    return null;
  }

  const selectedMonth = watch('month')

  return (
    <div>
      <div className="mb-2 flex gap-2 ">
        <h1 className="wp-heading-inline">{__(`${action} Member`, 'favcrm-for-woocommerce')}</h1>
        <hr className="wp-header-end" />
        {
          memberId && (
            <div className="my-auto">
              <button
                className="cursor-pointer p-1 text-red-800 bg-slate-50 border-solid border-red-800 rounded hover:text-white hover:bg-red-800"
                type="button"
                onClick={async () => {
                  if (!confirm(`You are about to delete member ${defaultValues?.name}, click confirm to delete.`)) {
                    return
                  }

                  const deleteResponse = await apiFetch({
                    path: `/fav/v1/members/${memberId}`,
                    method: 'DELETE',
                    headers: {
                      'X-WP-Nonce': nonce,
                      'Content-Type': 'application/json',
                    },
                  });

                  window.location.href = '/wp-admin/admin.php?page=fav-crm-members';
                }}> Delete </button>
            </div>
          )
        }
      </div>
      <div>
        <form onSubmit={handleSubmit(onFinish)}>
          <table className="form-table">
            <tbody>
              <tr>
                <th scope="row">
                  <label htmlFor="email">
                    {__('Email', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <input
                    id="email"
                    type="text"
                    className="regular-text"
                    {...register('email', {
                      required: __('Please enter email address', 'favcrm-for-woocommerce'),
                      pattern: {
                        value: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.email?.message}</div>}
                </td>
              </tr>
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
                    {...register('name', { required: __('Please enter your full name', 'favcrm-for-woocommerce') })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.name?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="phone">
                    {__('Phone', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <div className="regular-text">
                    <div className="flex gap-x-2">
                      <Controller
                        name="areaCode"
                        control={control}
                        render={({ field: f }) => {
                          return (
                            <ComboBox
                              defaultValue={f.value}
                              onChange={f.onChange}
                              options={countries.map(country => {
                                const countryName = i18nCountries.getName(country.code, locale);
                                return {
                                  value: country.dialCode,
                                  label: `${country.flag} ${country.dialCode} ${countryName}`,
                                  selectedLabel: country.dialCode,
                                }
                              })}
                            />
                          )
                        }}
                      />
                      <div className="flex-1">
                        <input
                          type="tel"
                          className="w-full border px-4 py-2 rounded"
                          {...register('phone', { required: __('Please enter phone number', 'favcrm-for-woocommerce') })}
                        />
                      </div>
                    </div>
                    {
                      errors.phone && (
                        <p className="mt-1 !mb-0 text-sm text-red-400">{errors.phone?.message}</p>
                      )
                    }
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="membershipTier">
                    {__('Membership Tier', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <select
                    type="text"
                    className="regular-text"
                    {...register('membershipTier')}
                  >
                    <option value="">Select</option>
                    {
                      tiers.items?.map(tier => (
                        <option key={tier.id} value={tier.id}>{tier?.name}</option>
                      ))
                    }
                  </select>
                  {
                    errors.contactPerson && (
                      <div className="mt-1 error-message text-red-500 font-normal">{errors.membershipTier?.message}</div>
                    )
                  }
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="Birth Month and Day">
                    {__('Birth Month and Day', 'favcrm-for-woocommerce')}
                  </label>
                </th>
                <td>
                  <div>
                    <select
                      id="month"
                      {...register('month', { required: 'Required' })}
                    >
                      <option value="">Month</option>
                      {
                        getMonths().map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))
                      }
                    </select>
                    <select
                      id="day"
                      {...register('day', { required: 'Required' })}
                    >
                      <option value="">Day</option>
                      {
                        getDayByMonth(selectedMonth)?.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))
                      }
                    </select>
                  </div>
                  {
                    (errors.day || errors.month) && (
                      <div className="mt-1 error-message text-red-500 font-normal">
                        {__('Please select birth month and day', 'favcrm-for-woocommerce')}
                      </div>
                    )
                  }
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="Referral Phone"> {__('Referral Phone', 'favcrm-for-woocommerce')} </label>
                </th>
                <td>
                  <input
                    id="referralMember"
                    type="text"
                    className="regular-text"
                    {...register('referralMember', {
                      // required: __('Required', 'favcrm-for-woocommerce'),
                      // value: member.referralMember?.phone,
                      // onChange: (e) => {
                      //   const { name, value } = e.target
                      //   setMember((m) => ({ ...m, [name]: value }))
                      // }
                    })}
                  />
                  {
                    errors.referralMember && (
                      <div className="mt-1 error-message text-red-500 font-normal">{errors.referralMember?.message}</div>
                    )
                  }
                </td>
              </tr>

              {/* show when update existing member */}
              {/*
                memberId ?
                  <>
                    <tr>
                      <th scope="row">
                      </th>
                      <td>
                        <hr />
                        <div className="text-sm">Member Status</div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                      </th>
                      <td>
                        <hr />
                        <div className="text-sm">Member Dependent</div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                      </th>
                      <td>
                        <hr />
                        <div className="text-sm">Spending Records</div>
                        <div className="text-sm">Redemption History</div>
                        <div className="text-sm">Reward Transactions</div>
                        <div className="text-sm">Service Package Orders</div>
                      </td>
                    </tr>
                  </>
                  : <></>
              */}
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
                          : __(!memberId ? 'Add' : 'Save', 'favcrm-for-woocommerce')
                      }
                    </button>
                    <button
                      className="cursor-pointer p-2 rounded border border-red-700 text-red-700 bg-slate-50 hover:bg-slate-100"
                      type="button"
                      onClick={() => navigate(-1)}
                    >
                      {__(!memberId ? 'Back' : 'Cancel', 'favcrm-for-woocommerce')}
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
