import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';

import MemberList from './screens/list';
import MemberEdit from './screens/edit';

if (document.getElementById('favored-admin-member-list')) {
  const queryClient = new QueryClient();
  const element = document.getElementById('favored-admin-member-list');
  const nonce = element.getAttribute('data-nonce');

  const router = createMemoryRouter([
    {
      path: '/',
      element: <MemberList nonce={nonce} />,
    },
    {
      path: '/edit',
      element: <MemberEdit nonce={nonce} />
    },
    {
      path: '/edit/:memberId',
      element: <MemberEdit nonce={nonce} />
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
