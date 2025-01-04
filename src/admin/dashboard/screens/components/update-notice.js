import apiFetch from '@wordpress/api-fetch';
import { useQuery } from '@tanstack/react-query';

const { __, sprintf } = wp.i18n;

export default function UpdateNotice({ nonce }) {
  const { data } = useQuery({ queryKey: ['update-notice'], queryFn: async () => {
    const result = await apiFetch({
      path: '/fav/v1/update-notice',
      headers: {
        'X-WP-Nonce': nonce,
      }
    });

    return result;
  }});

  if (!data) {
    return null;
  }

  return (
    <div
      className="notice notice-info"
    >
      <div className="flex">
        <p className="font-bold">{sprintf(__('A new version of FavCRM for WooCommerce (v%s) is available.', 'favcrm-for-woocommerce'), data)}</p>
        <p><a href="https://storage.googleapis.com/favcrm/favcrm-for-woocommerce.zip">{__('Download', 'favcrm-for-woocommerce')}</a></p>
      </div>
    </div>
  )
}
