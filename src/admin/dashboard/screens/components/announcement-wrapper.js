import apiFetch from '@wordpress/api-fetch';
import { useQuery } from '@tanstack/react-query';

export default function AnnouncementWrapper({ nonce }) {
  // notice-error, notice-warning, notice-success, notice-info
  const { data } = useQuery({ queryKey: ['announcements'], queryFn: async () => {
    const result = await apiFetch({
      path: '/fav/v1/announcements',
      headers: {
        'X-WP-Nonce': nonce,
      }
    });

    return result;
  }});

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div>
      {
        data?.map(announcement => (
          <div
            key={announcement.id}
            className="notice notice-info py-3"
          >
            <div className="flex">
              <div className="flex-1">
                <strong>{announcement.title}</strong>
              </div>
              {/* <div
                className="cursor-pointer flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path></svg>
              </div> */}
            </div>
            {
              !!announcement.body && (
                <div className="mt-1">
                  <div>{announcement.body}</div>
                </div>
              )
            }
            {/* <div className="mt-2">
              <a href="#" className="button">Dismiss</a>
            </div> */}
          </div>
        ))
      }
    </div>
  )
}
