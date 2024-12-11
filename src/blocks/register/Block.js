import apiFetch from '@wordpress/api-fetch'
import { useState, useEffect } from '@wordpress/element'
import { useForm, Controller } from 'react-hook-form'
import { __ } from '@wordpress/i18n'
import { countries } from 'country-codes-flags-phone-codes';
import i18nCountries from 'i18n-iso-countries';

import { ComboBox } from '../../components/ComboBox'
import LoadingSpinner from '../../components/LoadingSpinner';

i18nCountries.registerLocale(require('i18n-iso-countries/langs/en.json'));
i18nCountries.registerLocale(require('i18n-iso-countries/langs/zh.json'));

export default function Block({ nonce }) {
  const { control, register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    const locale = document.documentElement.lang.split('-')[0];

    setLocale(locale)
  }, [])

  const handleRegister = async (data) => {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    setError('');

    const result = await apiFetch({
      path: '/fav/v1/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce,
      },
      body: JSON.stringify({
        ...data,
        phone: `${data.areaCode}${data.phone}`,
      }),
    })

    if (result.registered === false) {
      if (result.message == 'DUPLICATED_PHONE' || result.message == 'FAILED_TO_CREATE_FAV_USER') {
        setError(__('This email has been registered', 'favored'))
      }

      setIsLoading(false)

      return;
    }

    window.location.href = '/';

    setIsLoading(false)
  }

  return (
    <div className="min-h-[500px] pb-64">
      <h1 className="mb-6">{__('Member Register', 'favored')}</h1>
      <div className="mb-8">
        <div className="flex flex-col mb-4">
          <label className="text-sm text-gray-500 mb-1">{__('Member name', 'favored')}</label>
          <input
            type="text"
            className="w-[300px] border px-4 py-2 rounded"
            { ...register('name', {
              required: __('Please enter your name', 'favored'),
            }) }
          />
          {
            errors?.name && <p className="mt-1 !mb-0 text-sm text-red-400">{errors?.name.message}</p>
          }
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-sm text-gray-500 mb-1">{__('Phone', 'favored')}</label>
          <div className="flex gap-2 w-[300px]">
            <Controller
              control={control}
              name="areaCode"
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
              }
            } />
            <div className="flex-1">
              <input
                type="tel"
                className="w-full border px-4 py-2 rounded"
                { ...register('phone', {
                  required: __('Please enter your phone number', 'favored'),
                }) }
              />
            </div>
          </div>
          {
            errors?.phone && <p className="mt-1 !mb-0 text-sm text-red-400">{errors?.phone.message}</p>
          }
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-sm text-gray-500 mb-1">{__('Email', 'favored')}</label>

          <input
            type="email"
            className="block w-[300px] border px-4 py-2 rounded"
            { ...register('email', {
              required: __('Please enter your email', 'favored'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: __('Invalid email address', 'favored'),
              }
            }) }
          />
          {
            errors?.email && <p className="mt-1 !mb-0 text-sm text-red-400">{errors?.email.message}</p>
          }
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-sm text-gray-500 mb-1">{__('Password', 'favored')}</label>
          <input
            type="password"
            className="w-[300px] border px-4 py-2 rounded"
            { ...register('password', {
              required: __('Please enter your password', 'favored'),
            }) }
          />
          {
            errors?.password && <p className="mt-1 !mb-0 text-sm text-red-400">{errors?.password.message}</p>
          }
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-sm text-gray-500 mb-1">{__('Referral phone (optional)', 'favored')}</label>
          <input
            type="tel"
            className="w-[300px] border px-4 py-2 rounded"
            { ...register('referral') }
          />
        </div>
        <div className="flex flex-col">
        <div className="mb-1">
          <Controller
            control={control}
            name="agreeToReceivePromotion"
            render={({ field }) => (
              <>
                <input
                  type="checkbox"
                  id="agreeToReceivePromotion"
                  className="mr-2 border-gray-400"
                  {...field}
                  value={undefined}
                  checked={field.value}
                />
                <label htmlFor="agreeToReceivePromotion" className="text-sm">{__('I agree to receive news and promotion notification', 'favored')}</label>
              </>
            )}
          />
        </div>
        <div className="mb-4">
          <Controller
            control={control}
            name="termsOfServices"
            rules={{ required: __('Please agree to the terms of services', 'favored') }}
            render={({ field }) => (
              <>
                <input
                  id="termsOfServices"
                  type="checkbox"
                  className="mr-2 border-gray-400"
                  {...field}
                  value={undefined}
                  checked={field.value}
                />
                <label htmlFor="termsOfServices" className="text-sm">{__('I read and agree to the terms of service', 'favored')}</label>
                {
                  errors?.termsOfServices && <p className="mt-1 text-sm text-red-400">{errors?.termsOfServices.message}</p>
                }
              </>
            )}
          />
        </div>
      </div>
        {
          error && (
            <div className="text-red-500 mb-4 text-sm">{error}</div>
          )
        }
        <div>
          <button
            className="bg-black text-white text-sm px-6 py-2"
            onClick={handleSubmit(handleRegister)}
          >
            {
              isLoading
                ? <LoadingSpinner isLoading={isLoading} color="text-white" size="h-4 w-4" />
                : __('Register', 'favored')
            }
          </button>
        </div>
      </div>
      <div className="text-sm">{__('Already have an account?', 'favored')} <a href="/account-login" className="text-gray-500 underline">{__('Login', 'favored')}</a></div>
    </div>
  )
}
