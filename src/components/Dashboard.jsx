import { useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import PhaseNav from './PhaseNav.jsx';
import StepCard, { LessonBodyBlock } from './StepCard.jsx';
import CompletedSteps from './CompletedSteps.jsx';
import LivePanel from './LivePanel.jsx';
import MetricsDrawer from './MetricsDrawer.jsx';
import AIBotModal from './AIBotModal.jsx';
import AILibraryDrawer from './AILibraryDrawer.jsx';
import WorkflowComplete from './WorkflowComplete.jsx';
import DebriefView from './DebriefView.jsx';
import DebriefSummary from './DebriefSummary.jsx';
import WelcomeGate from './WelcomeGate.jsx';
import SavedWorkflowsDrawer from './SavedWorkflowsDrawer.jsx';

export default function Dashboard() {
  const { launch, setOfferName, currentPhase, currentTask, resetLaunch, gateStep, openSavedWorkflows } = useLaunch();
  const onDebriefStep = currentTask?.id === 'mbymi-15-1';

  function handleReset() {
    if (window.confirm('Reset launch? This clears all answers, tasks, and metrics.')) {
      resetLaunch();
    }
  }

  // Pre-login: render ONLY the navy welcome screen. This keeps the workflow
  // hidden (so the user can't see it before signing in) and keeps the iframe
  // short (the gate is compact, so auto-resize keeps the embed small).
  if (gateStep !== 'workflow') {
    return <WelcomeGate />;
  }

  return (
    <div className="min-h-screen w-full">
      <PhaseNav />

      {/* Execution-guide link strip, just below the header. */}
      <div style={{ background: 'rgba(225,34,140,0.07)', borderBottom: '1px solid rgba(29,32,63,0.06)' }}>
        <div
          className="mx-auto text-sm text-brand-navy/75"
          style={{ maxWidth: '1280px', padding: '8px 24px' }}
        >
          If you want the step by step execution guide{' '}
          <a
            href="https://scribehow.com/page-embed/Monetize_Before_You_Make_It_tm__IlWMuS3PSTO4UGVm8K7x9w?removeLogo=true"
            target="_blank"
            rel="noreferrer noopener"
            className="font-semibold text-brand-pink hover:underline"
          >
            click here
          </a>
          .
        </div>
      </div>

      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '20px 24px 32px' }}>
        <LaunchTitle launch={launch} setOfferName={setOfferName} onReset={handleReset} onOpenSaved={openSavedWorkflows} />

        <PhaseIntro phase={currentPhase} />

        {/* Always two columns on desktop — md: (768px+) is wide enough for both
            sides to be useful. Drops to stacked single-column only on phones. */}
        {onDebriefStep ? (
          /* Debrief mode: form left, live summary right. Tabs are hidden — the
             whole right column is dedicated to the read-only mirror so the user
             can see everything they've entered at a glance while filling in. */
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="col-span-12 md:col-span-7">
              <DebriefStepHeader />
              <div className="mt-4">
                <DebriefView />
              </div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <div
                className="card"
                style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)' }}
              >
                <DebriefSummary />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="col-span-12 md:col-span-7 space-y-4">
              <CompletedSteps />
              <StepCard />
            </div>
            <div className="col-span-12 md:col-span-5">
              <LivePanel />
            </div>
          </div>
        )}
      </div>

      <MetricsDrawer />
      <AILibraryDrawer />
      <AIBotModal />
      <WorkflowComplete />
      <SavedWorkflowsDrawer />
    </div>
  );
}

function LaunchTitle({ launch, setOfferName, onReset, onOpenSaved }) {
  const { saveWorkflow } = useLaunch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(launch.offerName);
  const [justSaved, setJustSaved] = useState(false);

  function handleSaveProgress() {
    saveWorkflow();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

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
      <div className="shrink-0 flex items-center gap-2">
        <button
          onClick={handleSaveProgress}
          className="btn-dark"
          title="Save your progress so you can pick up where you left off"
        >
          {justSaved ? '✓ Saved' : '💾 Save'}
        </button>
        <button onClick={onOpenSaved} className="btn-ghost" title="View your saved launches">
          📂 Saved
        </button>
        <button onClick={onReset} className="btn-ghost">
          Reset
        </button>
      </div>
    </div>
  );
}

function DebriefStepHeader() {
  const { currentPhase, currentTask, openBot } = useLaunch();
  const config = getTaskConfig(currentTask.id);

  return (
    <div className="card" style={{ background: '#1D203F', color: '#fff' }}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="chip bg-brand-pink text-white">{currentPhase.label}</span>
      </div>
      <h2
        className="font-display tracking-wide"
        style={{ fontSize: '1.6rem', lineHeight: 1.1, overflowWrap: 'anywhere', wordBreak: 'break-word' }}
      >
        {currentTask.title}
      </h2>

      {Array.isArray(config.body) && config.body.length > 0 && (
        <div className="mt-3 space-y-3 max-w-2xl">
          {config.body.map((b, i) => (
            <LessonBodyBlock key={i} block={b} />
          ))}
        </div>
      )}

      <p className="mt-3 text-white/75 text-sm max-w-2xl">
        Fill in the structured debrief below. The right side mirrors back what you've entered. Hit{' '}
        <span className="font-semibold">Save Debrief</span> at the bottom to finish.
      </p>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => openBot(currentTask.id)}
          className="inline-flex items-center gap-2 font-bold uppercase tracking-wider"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: '#F89A2A',
            color: '#1D203F',
            border: 'none',
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            boxShadow: '0 4px 12px rgba(248,154,42,0.30)',
          }}
        >
          🤖 AI Assist
        </button>
      </div>
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
