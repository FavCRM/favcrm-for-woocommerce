import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Settings from './screens/settings';

const element = document.getElementById('favored-admin-settings');

if (element) {
  const queryClient = new QueryClient();
  const nonce = element.getAttribute('data-nonce');

  createRoot(element).render((
    <QueryClientProvider client={queryClient}>
      <Settings nonce={nonce} />
    </QueryClientProvider>
  ));
}
