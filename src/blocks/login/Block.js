import apiFetch from '@wordpress/api-fetch'
import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

import LoadingSpinner from '../../components/LoadingSpinner';

export default function Block({ nonce }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)

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

    if (result.loggedin) {
      window.location.href = '/';
    }

    setIsLoading(false)
  }

  return (
    <div class="h-[500px]">
      <h1 class="mb-6">{__('Member Login', 'favored')}</h1>
      <div class="mb-8">
        <div class="flex flex-col mb-4">
          <label class="text-sm text-gray-500 mb-1">{__('Email', 'favored')}</label>
          <input
            type="text"
            class="w-[300px] border px-4 py-2 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class="flex flex-col mb-4">
          <label class="text-sm text-gray-500 mb-1">{__('Password', 'favored')}</label>
          <input
            type="password"
            class="w-[300px] border px-4 py-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            class="bg-black text-white text-sm px-6 py-2 h-[36px]"
            onClick={handleLogin}
          >
            {
              isLoading
                ? <LoadingSpinner isLoading={isLoading} color="text-white" size="h-4 w-4" />
                : __('Login', 'favored')
            }
          </button>
        </div>
      </div>
      <div class="text-sm">{__('Don\'t have an account?', 'favored')} <a href="/account-register" class="text-gray-500 underline">{__('Register', 'favored')}</a></div>
    </div>
  )
}
