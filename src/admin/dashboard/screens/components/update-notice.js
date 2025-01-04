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
        <p><a href="/wp-admin/plugins.php">{__('Update Now', 'favcrm-for-woocommerce')}</a></p>
      </div>
    </div>
  )
}
