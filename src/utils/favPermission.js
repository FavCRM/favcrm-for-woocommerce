import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiFetch from '@wordpress/api-fetch';

function useUserCan(nonce) {
  try {
    // const [isLoading, setIsLoading] = useState(true)
    const [userCan, setUserCan] = useState({
      read: false,
      write: false,
      delete: false,
    })

    const { data, isLoading, error } = useQuery({
      queryKey: ['readPermission'],
      queryFn: async () => {
        const result = await apiFetch({
          path: `/fav/v1/permissions-check`,
          headers: {
            'X-WP-Nonce': nonce,
          }
        });

        return result;
      },
      retry: false,
    });

    useEffect(() => {
      if (isLoading) {
        return
      }
      const { data: userPermissions } = data
      setUserCan(() => ({
        ...userPermissions
      }))
    }, [isLoading]);

    return { isLoading, userCan }

  } catch (e) {
    throw e
  }
}

export { useUserCan }
