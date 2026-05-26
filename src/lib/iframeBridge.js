// Helpers for talking to the parent page when this app is embedded in an
// iframe (e.g. inside Kajabi). Safe no-op when running standalone.

/**
 * Ask the parent page to scroll the iframe element into view so it sits at
 * the top of the user's viewport. Used by modals so they appear in the
 * user's visible area instead of at the geometric center of a tall iframe.
 *
 * The parent must have a small <script> listening for this message:
 *
 *   window.addEventListener('message', function (e) {
 *     if (e?.data?.type === 'mbymi-scroll-into-view') {
 *       var f = document.getElementById('mbymi-frame');
 *       if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
 *     }
 *   });
 */
export function scrollIframeIntoView() {
  if (typeof window === 'undefined') return;
  if (window.parent === window) return; // not in an iframe
  try {
    window.parent.postMessage({ type: 'mbymi-scroll-into-view' }, '*');
  } catch {
    // swallow — cross-origin restrictions etc.
  }
}
