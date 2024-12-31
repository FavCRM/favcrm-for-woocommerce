import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiFetch from '@wordpress/api-fetch';

function useUserCan(nonce) {
  try {
    const [isLoading, setIsLoading] = useState(true)
    const [userCan, setUserCan] = useState({
      read: false,
      write: false,
      delete: false,
    })

    const { data: readResp, isLoading: readLoading, error: readErr } = useQuery({
      queryKey: ['readPermission'],
      queryFn: async () => {
        const result = await apiFetch({
          path: `/fav/v1/permissions-check?permission=read`,
          headers: {
            'X-WP-Nonce': nonce,
          }
        });

        return result;
      },
      retry: false,
    });

    const { data: writeResp, isLoading: writeLoading, error: writeErr } = useQuery({
      queryKey: ['writePermission'], queryFn: async () => {
        const result = await apiFetch({
          path: `/fav/v1/permissions-check?permission=write`,
          headers: {
            'X-WP-Nonce': nonce,
          }
        });

        return result;
      },
      retry: false,
    });

    const { data: deleteResp, isLoading: deleteLoading, error: deleteErr } = useQuery({
      queryKey: ['deletePermission'], queryFn: async () => {
        const result = await apiFetch({
          path: `/fav/v1/permissions-check?permission=delete`,
          headers: {
            'X-WP-Nonce': nonce,
          }
        });

        return result;
      },
      retry: false,
    });

    useEffect(() => {
      if (!readLoading && !writeLoading && !deleteLoading) {
        setIsLoading(() => false)
      }

      if (!isLoading) {
        setUserCan(() => ({
          ...userCan,
          read: !readErr,
          write: !writeErr,
          delete: !deleteErr,
        }))
      }
    }, [readLoading, writeLoading, deleteLoading, isLoading]);

    return { isLoading, userCan }

  } catch (e) {
    throw e
  }
}

export { useUserCan }
