// Safeguard for fetch property in iframe sandbox
try {
  const origFetch = window.fetch ? window.fetch.bind(window) : undefined;
  let curFetch = origFetch;
  Object.defineProperty(window, 'fetch', {
    get: () => curFetch,
    set: (fn) => { curFetch = fn; },
    configurable: true,
    enumerable: true
  });
} catch {
  // ignore
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'katex/dist/katex.min.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker for full offline support
registerSW({
  immediate: true,
  onNeedRefresh() {},
  onOfflineReady() {
    console.log('App ready to work offline!');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
