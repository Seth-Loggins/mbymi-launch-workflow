import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useLaunch } from '../state/LaunchContext.jsx';
import CenteredOverlay from './CenteredOverlay.jsx';

/**
 * Modal-style celebration shown when the user clicks "Save Debrief" and the
 * launch workflow is complete. Fires three bursts of confetti from the bottom
 * corners using the BBD brand palette.
 */
export default function WorkflowComplete() {
  const {
    workflowComplete,
    dismissCelebration,
    launch,
    resetLaunch,
    saveWorkflow,
    openSavedWorkflows,
  } = useLaunch();
  const autoSavedRef = useRef(false);

  // Auto-save the finished launch to "Saved workflows" the moment the debrief
  // is completed (the celebration appears). Guarded so it saves exactly once
  // per completion, and resets when the celebration is dismissed.
  useEffect(() => {
    if (workflowComplete && !autoSavedRef.current) {
      saveWorkflow();
      autoSavedRef.current = true;
    } else if (!workflowComplete) {
      autoSavedRef.current = false;
    }
  }, [workflowComplete, saveWorkflow]);

  useEffect(() => {
    if (!workflowComplete) return;

    const colors = ['#E1228C', '#83CCBD', '#F89A2A', '#F65556', '#1D203F'];
    const duration = 2200;
    const end = Date.now() + duration;

    function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 1 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    }
    frame();

    // One big center burst on entry.
    confetti({
      particleCount: 140,
      spread: 80,
      startVelocity: 38,
      origin: { x: 0.5, y: 0.5 },
      colors,
    });
  }, [workflowComplete]);

  if (!workflowComplete) return null;

  return (
    <CenteredOverlay onClose={dismissCelebration} width="min(560px, calc(100% - 32px))" zIndex={50}>
      <div
        className="card text-center"
        style={{
          padding: '32px 28px',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 60px rgba(29,32,63,0.30)',
        }}
      >
        <div
          className="inline-flex items-center justify-center mb-4"
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: 'rgba(225,34,140,0.12)',
            fontSize: '2rem',
          }}
        >
          🎉
        </div>
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink mb-1">
          MBYMI Launch Execution Experience Complete
        </div>
        <h2
          className="font-display tracking-wide text-brand-navy"
          style={{ fontSize: '2.2rem', lineHeight: 1.05 }}
        >
          You did it.
        </h2>
        <p className="mt-3 text-brand-navy/75 text-sm max-w-md mx-auto">
          {launch.offerName?.trim() ? (
            <>
              The <span className="font-semibold">{launch.offerName}</span> launch is fully scoped,
              executed, and debriefed. Take a beat, then ship the next one.
            </>
          ) : (
            <>
              Your launch is fully scoped, executed, and debriefed. Take a beat, then ship the next
              one.
            </>
          )}
        </p>

        <p className="mt-3 text-[0.8rem] font-semibold uppercase tracking-wider text-brand-pink">
          💾 Saved to your launches automatically
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => {
              dismissCelebration();
              openSavedWorkflows();
            }}
            className="btn-dark"
          >
            📂 View saved launches
          </button>
          <button
            type="button"
            onClick={dismissCelebration}
            className="btn-primary"
          >
            Back to your launch
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Start a brand new launch? This clears all answers, tasks, dates, and metrics. (Save it first if you want to keep it.)',
                )
              ) {
                resetLaunch();
              }
            }}
            className="btn-ghost"
          >
            Start a new launch
          </button>
        </div>
      </div>
    </CenteredOverlay>
  );
}
