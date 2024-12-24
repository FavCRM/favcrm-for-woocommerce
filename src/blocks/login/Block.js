import apiFetch from '@wordpress/api-fetch'
import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

import LoadingSpinner from '../../components/LoadingSpinner';

export default function Block({ nonce }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const handleLogin = async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    setError('');

    try {
      const result = await apiFetch({
        path: '/fav/v1/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!result.loggedin) {
        throw new Error('Login failed');
      }

      window.location.href = '/';
    } catch(e) {
      setError(__('Invalid email or password', 'favcrm-for-woocommerce'))

      setIsLoading(false)
    }
  }

  return (
    <div class="h-[500px]">
      <h1 class="mb-6">{__('Member Login', 'favcrm-for-woocommerce')}</h1>
      <div class="mb-8">
        <div class="flex flex-col mb-4">
          <label class="text-sm text-gray-500 mb-1">{__('Email', 'favcrm-for-woocommerce')}</label>
          <input
            type="text"
            class="w-[300px] border px-4 py-2 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class="flex flex-col mb-4">
          <label class="text-sm text-gray-500 mb-1">{__('Password', 'favcrm-for-woocommerce')}</label>
          <input
            type="password"
            class="w-[300px] border px-4 py-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {
          error && (
            <div className="text-red-500 mb-4 text-sm">{error}</div>
          )
        }
        <div>
          <button
            class="bg-black text-white text-sm px-6 py-2 h-[36px]"
            onClick={handleLogin}
          >
            {
              isLoading
                ? <LoadingSpinner isLoading={isLoading} color="text-white" size="h-4 w-4" />
                : __('Login', 'favcrm-for-woocommerce')
            }
          </button>
        </div>
      </div>
      <div class="text-sm">{__('Don\'t have an account?', 'favcrm-for-woocommerce')} <a href="/account-register" class="text-gray-500 underline">{__('Register', 'favcrm-for-woocommerce')}</a></div>
    </div>
  )
}
