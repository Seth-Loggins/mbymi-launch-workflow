import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// ---------------------------------------------------------------------------
// Iframe auto-resize bridge
// ---------------------------------------------------------------------------
// When the app is embedded inside another page (e.g. Kajabi), broadcast the
// current document height up to the parent. The parent listens for these
// "mbymi-resize" messages and sets the <iframe> height to match — that's how
// we kill the inner scrollbar without forcing a fixed iframe height.
//
// Safe no-op when not embedded (window.parent === window).
// ---------------------------------------------------------------------------
if (typeof window !== 'undefined' && window.parent !== window) {
  let lastHeight = 0;

  function postHeight() {
    const h = Math.max(
      document.documentElement.scrollHeight,
      document.body?.scrollHeight ?? 0,
    );
    if (h && h !== lastHeight) {
      lastHeight = h;
      window.parent.postMessage({ type: 'mbymi-resize', height: h }, '*');
    }
  }

  // Watch the body for any size change (covers expand/collapse of steps,
  // adding completed-step cards, playbook growing, etc.).
  const ro = new ResizeObserver(() => postHeight());
  ro.observe(document.documentElement);

  // Initial sends — first paint, then a couple of nudges after fonts/images
  // settle so we don't lock in an undersized height.
  postHeight();
  setTimeout(postHeight, 100);
  setTimeout(postHeight, 500);
  setTimeout(postHeight, 1500);
}
