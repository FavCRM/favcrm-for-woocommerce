import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Login from './screens/login';

const element = document.getElementById('favored-admin-login');

if (element) {
  const queryClient = new QueryClient();
  const nonce = element.getAttribute('data-nonce');

  createRoot(element).render((
    <QueryClientProvider client={queryClient}>
      <Login nonce={nonce} />
    </QueryClientProvider>
  ));
}
