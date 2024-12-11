import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';

import MembershipTierList from './screens/list';
import MembershipTierEdit from './screens/edit';

if (document.getElementById('favored-admin-membership-tier')) {
  const queryClient = new QueryClient();
  const element = document.getElementById('favored-admin-membership-tier');
  const nonce = element.getAttribute('data-nonce');

  const router = createMemoryRouter([
    {
      path: '/',
      element: <MembershipTierList nonce={nonce} />,
    },
    {
      path: '/add',
      element: <MembershipTierEdit nonce={nonce} />
    },
    {
      path: '/edit/:membershipTierId',
      element: <MembershipTierEdit nonce={nonce} />
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
