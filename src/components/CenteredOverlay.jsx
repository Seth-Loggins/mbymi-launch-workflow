import { useEffect } from 'react';
import { scrollIframeIntoView, useVisibleCenterY } from '../lib/iframeBridge.js';

/**
 * A backdrop + centered content box that lands in the middle of the user's
 * VISIBLE viewport — even when the app is an auto-grown iframe taller than the
 * screen. Uses the parent's streamed viewport geometry (see iframeBridge).
 *
 * Props:
 *   onClose — called when the backdrop is clicked
 *   width   — CSS width for the content box
 *   zIndex  — base z-index (backdrop = z, content = z+1)
 *   children
 */
export default function CenteredOverlay({ onClose, width = 'min(900px, calc(100% - 32px))', zIndex = 50, children }) {
  const centerY = useVisibleCenterY();

  // On open, nudge the parent to bring the iframe into view too.
  useEffect(() => {
    scrollIframeIntoView();
  }, []);

  return (
    <>
      <div
        onMouseDown={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(29,32,63,0.55)',
          zIndex,
        }}
      />
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: centerY,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width,
          zIndex: zIndex + 1,
        }}
      >
        {children}
      </div>
    </>
  );
}
