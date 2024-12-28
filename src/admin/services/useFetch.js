import { useQuery } from '@tanstack/react-query';
import apiFetch from '@wordpress/api-fetch';

function useFetch(key, pageLink, nonce, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      try {
        const result = await apiFetch({
          // path: '/fav/v1/membership-tiers',
          path: pageLink,
          headers: {
            'X-WP-Nonce': nonce,
          }
        });
        // console.log({ result })

        return result;
      } catch (err) {
        console.error("failed to fetch, err: ", err.message)
      }
    },
    enabled,
  });

  return { data, isLoading, error, refetch }
}

export { useFetch }
