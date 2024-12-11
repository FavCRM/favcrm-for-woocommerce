import { createRoot } from '@wordpress/element';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { Toaster } from './components/toast'
import Block from './Block';

const queryClient = new QueryClient()

window.addEventListener('load', () => {
  const domElement = document.getElementById('floating-icon-block');
  const nonce = domElement.getAttribute('data-nonce');
  const isUserLoggedOn = domElement.getAttribute('data-is-user-logged-on');
  const root = createRoot(domElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Block nonce={nonce} isUserLoggedOn={isUserLoggedOn} />
    </QueryClientProvider>
  );
});
