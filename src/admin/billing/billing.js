import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Billing from './screens/billing';

const element = document.getElementById('favored-admin-billing');

if (element) {
  const queryClient = new QueryClient();
  const nonce = element.getAttribute('data-nonce');

  createRoot(element).render((
    <QueryClientProvider client={queryClient}>
      <Billing nonce={nonce} />
    </QueryClientProvider>
  ));
}
