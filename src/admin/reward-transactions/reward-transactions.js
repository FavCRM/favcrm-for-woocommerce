import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';

import RewardTransactionList from './screens/list';

if (document.getElementById('favored-admin-reward-transaction')) {
  const queryClient = new QueryClient();
  const element = document.getElementById('favored-admin-reward-transaction');
  const nonce = element.getAttribute('data-nonce');

  const router = createMemoryRouter([
    {
      path: '/',
      element: <RewardTransactionList nonce={nonce} />,
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
