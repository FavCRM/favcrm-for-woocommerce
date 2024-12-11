import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';

import GiftOfferList from './screens/list';
import GiftOfferEdit from './screens/edit';

if (document.getElementById('favored-admin-gift-offer')) {
  const queryClient = new QueryClient();
  const element = document.getElementById('favored-admin-gift-offer');
  const nonce = element.getAttribute('data-nonce');

  const router = createMemoryRouter([
    {
      path: '/',
      element: <GiftOfferList nonce={nonce} />,
    },
    {
      path: '/add',
      element: <GiftOfferEdit nonce={nonce} />
    },
    {
      path: '/edit/:giftOfferId',
      element: <GiftOfferEdit nonce={nonce} />
    },
  ], {
    initialEntries: ['/'],
  });

  createRoot(element).render((
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  ));
}
