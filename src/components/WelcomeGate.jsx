import { useEffect, useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { scrollIframeIntoView } from '../lib/iframeBridge.js';

/**
 * Two-step intro shown on first mount:
 *   1. Welcome — "Sign in with Google" (stubbed) or "Try Demo"
 *   2. Name Your Launch — short form to title this launch
 *
 * After step 2 the gate dismisses and the regular workflow renders.
 */
export default function WelcomeGate() {
  const { gateStep } = useLaunch();

  useEffect(() => {
    if (gateStep !== 'workflow') scrollIframeIntoView();
  }, [gateStep]);

  if (gateStep === 'workflow') return null;

  // Full-navy compact screen rendered INSTEAD of the workflow. Min height is
  // just enough to comfortably frame the card, so the embedded iframe stays
  // short during sign-in.
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        background: '#1D203F',
        minHeight: 560,
        padding: '40px 16px',
      }}
    >
      <div style={{ width: 'min(560px, 100%)' }}>
        {gateStep === 'welcome' ? <WelcomeStep /> : <NameLaunchStep />}
      </div>
    </div>
  );
}

/* ---------- Step 1: Welcome ------------------------------------------ */

function WelcomeStep() {
  const { enterAsDemo, enterAsGoogle } = useLaunch();
  const [pending, setPending] = useState(null); // 'google' | 'demo' | null

  function handleGoogle() {
    if (pending) return;
    setPending('google');
    // Stubbed — simulate a brief loading state so the button feels like real
    // auth, then drop into the name-launch step.
    setTimeout(() => {
      enterAsGoogle();
      setPending(null);
    }, 400);
  }

  function handleDemo() {
    if (pending) return;
    enterAsDemo();
  }

  return (
    <div
      className="card text-center"
      style={{
        width: 'min(480px, 96vw)',
        padding: '32px 28px',
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 60px rgba(29,32,63,0.30)',
      }}
    >
      <div
        className="inline-flex items-center justify-center mb-3 font-bold uppercase tracking-wider"
        style={{
          background: '#E1228C',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: 999,
          fontSize: '0.65rem',
          letterSpacing: '0.08em',
        }}
      >
        MBYMI Launch Execution Experience
      </div>
      <h2
        className="font-display tracking-wide text-brand-navy"
        style={{ fontSize: '1.85rem', lineHeight: 1.1 }}
      >
        Welcome
      </h2>
      <p className="mt-2 text-brand-navy/70 text-sm">
        Pick how you want to start. Sign in to save your launches to your account, or jump in with
        the demo to see what it does.
      </p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={!!pending}
          className="w-full inline-flex items-center justify-center gap-3 font-semibold text-brand-navy transition-shadow"
          style={{
            background: '#fff',
            border: '1px solid rgba(29,32,63,0.20)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '0.9rem',
            opacity: pending && pending !== 'google' ? 0.5 : 1,
            boxShadow: '0 1px 2px rgba(29,32,63,0.06)',
          }}
        >
          <GoogleGlyph />
          {pending === 'google' ? 'Signing you in…' : 'Sign in with Google'}
        </button>

        <button
          type="button"
          onClick={handleDemo}
          disabled={!!pending}
          className="w-full inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-colors"
          style={{
            background: '#F89A2A',
            color: '#1D203F',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '0.78rem',
            letterSpacing: '0.06em',
            opacity: pending ? 0.5 : 1,
            boxShadow: '0 4px 12px rgba(248,154,42,0.30)',
          }}
        >
          🧪 Try the Demo
        </button>
      </div>

      <p className="mt-5 text-xs text-brand-navy/55">
        Demo mode uses temporary in-memory state — perfect for testing. Google sign-in connects
        your account when persistence is wired up.
      </p>
    </div>
  );
}

function GoogleGlyph() {
  // Inline Google "G" mark, no external assets needed.
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M16.51 8.18c0-.57-.05-1.13-.15-1.65H9v3.13h4.21a3.6 3.6 0 0 1-1.56 2.36v1.96h2.52c1.48-1.36 2.34-3.36 2.34-5.8z"
        fill="#4285F4"
      />
      <path
        d="M9 17c2.11 0 3.88-.7 5.17-1.9l-2.52-1.96c-.7.47-1.6.75-2.65.75-2.04 0-3.77-1.38-4.39-3.23H1.99v2.03A8 8 0 0 0 9 17z"
        fill="#34A853"
      />
      <path
        d="M4.61 10.66a4.8 4.8 0 0 1 0-3.07V5.56H1.99a8 8 0 0 0 0 6.88l2.62-1.78z"
        fill="#FBBC05"
      />
      <path
        d="M9 4.4c1.15 0 2.18.4 2.99 1.17l2.24-2.24A8 8 0 0 0 9 1a8 8 0 0 0-7.01 4.56l2.62 2.03C5.23 5.78 6.96 4.4 9 4.4z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ---------- Step 2: Name your launch --------------------------------- */

function NameLaunchStep() {
  const { userName, userMode, finishNamingLaunch, launch, reopenWelcome } = useLaunch();
  const [value, setValue] = useState(launch.offerName ?? '');

  // Focus the input on mount.
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.getElementById('mbymi-launch-name-input');
      el?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    finishNamingLaunch(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card text-left"
      style={{
        width: 'min(520px, 96vw)',
        padding: '28px 28px',
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 60px rgba(29,32,63,0.30)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="inline-flex items-center font-semibold uppercase tracking-wider"
          style={{
            background: 'rgba(225,34,140,0.10)',
            color: '#E1228C',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
          }}
        >
          Step 2 of 2 · {userMode === 'demo' ? 'Demo mode' : `Signed in as ${userName}`}
        </div>
        <button
          type="button"
          onClick={reopenWelcome}
          className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 hover:text-brand-pink"
        >
          ← Back
        </button>
      </div>

      <h2 className="font-display tracking-wide text-brand-navy" style={{ fontSize: '1.8rem', lineHeight: 1.1 }}>
        Name your launch
      </h2>
      <p className="mt-1 text-sm text-brand-navy/70">
        What are you calling this beta? You can rename it any time from the header.
      </p>

      <label className="block mt-5">
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/70 mb-1.5">
          Launch name
        </div>
        <input
          id="mbymi-launch-name-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. The Productized Coach Beta"
          className="w-full outline-none text-base text-brand-navy"
          style={{
            background: '#fff',
            border: '1px solid rgba(29,32,63,0.20)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
          }}
        />
      </label>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => finishNamingLaunch('')}
          className="btn-ghost"
        >
          Skip
        </button>
        <button
          type="submit"
          disabled={!value.trim()}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start the experience →
        </button>
      </div>
    </form>
  );
}
