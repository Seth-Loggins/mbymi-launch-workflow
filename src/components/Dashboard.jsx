import { useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import PhaseNav from './PhaseNav.jsx';
import StepCard from './StepCard.jsx';
import CompletedSteps from './CompletedSteps.jsx';
import LivePanel from './LivePanel.jsx';
import MetricsDrawer from './MetricsDrawer.jsx';
import AIBotModal from './AIBotModal.jsx';

export default function Dashboard() {
  const { launch, setOfferName, currentPhase, resetLaunch } = useLaunch();

  function handleReset() {
    if (window.confirm('Reset launch? This clears all answers, tasks, and metrics.')) {
      resetLaunch();
    }
  }

  return (
    <div className="min-h-screen w-full">
      <PhaseNav />

      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '20px 24px 32px' }}>
        <LaunchTitle launch={launch} setOfferName={setOfferName} onReset={handleReset} />

        <PhaseIntro phase={currentPhase} />

        {/* Always two columns on desktop — md: (768px+) is wide enough for both
            sides to be useful. Drops to stacked single-column only on phones. */}
        <div className="grid grid-cols-12 gap-6 mt-5">
          <div className="col-span-12 md:col-span-7 space-y-4">
            <CompletedSteps />
            <StepCard />
          </div>
          <div className="col-span-12 md:col-span-5">
            <LivePanel />
          </div>
        </div>
      </div>

      <MetricsDrawer />
      <AIBotModal />
    </div>
  );
}

function LaunchTitle({ launch, setOfferName, onReset }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(launch.offerName);

  function startEdit() {
    setDraft(launch.offerName);
    setEditing(true);
  }
  function save(e) {
    e?.preventDefault();
    setOfferName(draft.trim());
    setEditing(false);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55">
          Launch
        </div>
        {editing ? (
          <form onSubmit={save} className="mt-1 flex items-center gap-2">
            <input
              autoFocus
              className="field-input"
              style={{ maxWidth: 480 }}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={save}
              placeholder="Name your launch (e.g. The Productized Coach Beta)"
            />
          </form>
        ) : (
          <button
            onClick={startEdit}
            className="font-display text-3xl tracking-wide text-brand-navy text-left hover:text-brand-pink transition-colors"
            style={{ lineHeight: 1.1 }}
            title="Click to rename"
          >
            {launch.offerName?.trim() ? launch.offerName : 'Name your launch'}
            <span className="ml-2 text-brand-navy/30 text-base">✎</span>
          </button>
        )}
      </div>
      <button onClick={onReset} className="btn-ghost shrink-0">
        Reset
      </button>
    </div>
  );
}

function PhaseIntro({ phase }) {
  return (
    <div
      className="mt-4 px-4 py-3 rounded-[var(--radius-md)]"
      style={{
        background: 'rgba(225,34,140,0.08)',
        borderLeft: '3px solid #E1228C',
      }}
    >
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink">
        Current phase
      </div>
      <div className="flex items-baseline gap-3 mt-0.5">
        <div className="font-display text-2xl text-brand-navy">{phase.label}</div>
        <div className="text-sm text-brand-navy/70">{phase.blurb}</div>
      </div>
    </div>
  );
}
