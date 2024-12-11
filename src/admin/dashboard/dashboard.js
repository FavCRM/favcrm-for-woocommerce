import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Dashboard from './screens/dashboard';

const element = document.getElementById('favored-admin-dashboard');

if (element) {
  const queryClient = new QueryClient();
  const nonce = element.getAttribute('data-nonce');

  createRoot(element).render((
    <QueryClientProvider client={queryClient}>
      <Dashboard nonce={nonce} />
    </QueryClientProvider>
  ));
}
