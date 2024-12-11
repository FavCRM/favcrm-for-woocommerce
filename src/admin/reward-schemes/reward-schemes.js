import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';

import RewardSchemeList from './screens/list';
import RewardSchemeEdit from './screens/edit';

if (document.getElementById('favored-admin-reward-scheme')) {
  const queryClient = new QueryClient();
  const element = document.getElementById('favored-admin-reward-scheme');
  const nonce = element.getAttribute('data-nonce');

  const router = createMemoryRouter([
    {
      path: '/',
      element: <RewardSchemeList nonce={nonce} />,
    },
    // {
    //   path: '/add',
    //   element: <RewardSchemeEdit nonce={nonce} />
    // },
    {
      path: '/edit/:rewardSchemeId',
      element: <RewardSchemeEdit nonce={nonce} />
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
