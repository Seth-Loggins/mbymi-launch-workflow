// Helpers for talking to the parent page when this app is embedded in an
// iframe (e.g. inside Kajabi). Safe no-ops when running standalone.
//
// Because the embedded iframe auto-grows to fit its content (no inner scroll),
// `position: fixed` inside it does NOT track the user's visible viewport — it
// pins to the iframe's own coordinate space. To center popups in the part of
// the iframe the user is actually looking at, the parent streams us its
// viewport geometry and we position accordingly.

import { useEffect, useState } from 'react';

const isEmbedded = typeof window !== 'undefined' && window.parent !== window;

// Latest viewport geometry from the parent, in IFRAME coordinates:
//   topWithin     — px from the iframe's top to the top of the visible region
//   visibleHeight — height of the visible region (clamped to the viewport)
let viewport = { topWithin: 0, visibleHeight: 0, viewportHeight: 0, received: false };

const listeners = new Set();
function notify() {
  listeners.forEach((cb) => {
    try {
      cb(viewport);
    } catch {
      /* ignore */
    }
  });
}

if (isEmbedded) {
  window.addEventListener('message', (e) => {
    if (e?.data?.type === 'mbymi-viewport') {
      viewport = {
        topWithin: Number(e.data.topWithin) || 0,
        visibleHeight: Number(e.data.visibleHeight) || 0,
        viewportHeight: Number(e.data.viewportHeight) || 0,
        received: true,
      };
      notify();
    }
  });
}

/**
 * Copy text to the clipboard via the PARENT window. The embedded iframe is
 * often sandboxed without clipboard permission, but the parent Kajabi page is
 * not — so we hand the text up and let the parent run navigator.clipboard.
 * Resolves true on confirmed success, false on timeout/failure.
 */
export function copyViaParent(text, timeoutMs = 600) {
  if (!isEmbedded) return Promise.resolve(false);
  return new Promise((resolve) => {
    const id = `copy-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    let settled = false;

    function onMsg(e) {
      if (e?.data?.type === 'mbymi-copy-result' && e.data.id === id) {
        settled = true;
        window.removeEventListener('message', onMsg);
        resolve(!!e.data.ok);
      }
    }
    window.addEventListener('message', onMsg);

    try {
      window.parent.postMessage({ type: 'mbymi-copy', id, text }, '*');
    } catch {
      window.removeEventListener('message', onMsg);
      resolve(false);
      return;
    }

    setTimeout(() => {
      if (!settled) {
        window.removeEventListener('message', onMsg);
        resolve(false);
      }
    }, timeoutMs);
  });
}

/** Ask the parent to (re)send its viewport geometry. */
export function requestViewport() {
  if (!isEmbedded) return;
  try {
    window.parent.postMessage({ type: 'mbymi-request-viewport' }, '*');
  } catch {
    /* ignore */
  }
}

/**
 * Ask the parent page to scroll the iframe into view (top of iframe → top of
 * viewport). Used as a gentle assist when a popup opens so the user is looking
 * at roughly the right place.
 */
export function scrollIframeIntoView() {
  if (!isEmbedded) return;
  try {
    window.parent.postMessage({ type: 'mbymi-scroll-into-view' }, '*');
  } catch {
    /* ignore */
  }
}

/**
 * React hook returning the centre Y (in iframe coordinates) of the user's
 * currently-visible region, so a popup can sit dead-centre on their screen.
 *
 * Standalone (not embedded): falls back to window scroll + innerHeight.
 * Embedded but no message yet: requests one and falls back to 0 + a guess.
 */
export function useVisibleCenterY() {
  const [centerY, setCenterY] = useState(() => computeCenter());

  useEffect(() => {
    function recompute() {
      setCenterY(computeCenter());
    }

    if (isEmbedded) {
      requestViewport();
      const cb = () => recompute();
      listeners.add(cb);
      // Nudge a couple of times in case the first message is mid-flight.
      const t1 = setTimeout(() => {
        requestViewport();
        recompute();
      }, 60);
      const t2 = setTimeout(recompute, 250);
      return () => {
        listeners.delete(cb);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // Standalone: track scroll/resize directly.
    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', recompute);
    recompute();
    return () => {
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
    };
  }, []);

  return centerY;
}

function computeCenter() {
  if (isEmbedded) {
    if (viewport.received && viewport.visibleHeight > 0) {
      return viewport.topWithin + viewport.visibleHeight / 2;
    }
    // No geometry yet — best effort: assume the user is near the top.
    const h = viewport.viewportHeight || (typeof window !== 'undefined' ? window.innerHeight : 700);
    return h / 2;
  }
  // Standalone.
  if (typeof window === 'undefined') return 350;
  return window.scrollY + window.innerHeight / 2;
}
