import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Register from './screens/register';

const element = document.getElementById('favored-admin-register');

if (element) {
  const queryClient = new QueryClient();
  const nonce = element.getAttribute('data-nonce');

  createRoot(element).render((
    <QueryClientProvider client={queryClient}>
      <Register nonce={nonce} />
    </QueryClientProvider>
  ));
}
