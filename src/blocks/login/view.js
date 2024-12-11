import { createRoot } from '@wordpress/element';

import Block from './Block';

window.addEventListener('load', () => {
  const domElement = document.getElementById('login-block');
  const nonce = domElement.getAttribute('data-nonce');
  const root = createRoot(domElement);

  root.render(<Block nonce={nonce} />);
});
