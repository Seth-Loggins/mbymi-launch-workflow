import { useEffect } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';

/**
 * The Launch Debrief step (mbymi-15-1) doesn't ask the user to type something
 * here — instead it points them at the Debrief tab on the Live Build panel,
 * which has the structured 7-section form. When they hit "Save debrief" over
 * there, the task auto-completes and the celebration fires.
 *
 * We auto-switch the Live Build panel to the Debrief view as soon as this
 * step becomes active so the user doesn't have to hunt for it.
 */
export default function DebriefStepCard({ task, phase, phaseStepIndex, phaseStats }) {
  const config = getTaskConfig(task.id);
  const stats = phaseStats[phase.id];
  const { setLivePanelView, livePanelView, openBot } = useLaunch();

  useEffect(() => {
    if (livePanelView !== 'debrief') setLivePanelView('debrief');
    // We intentionally only run this on mount of this step — the user is free
    // to flip the panel away if they want, we won't keep snapping it back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card" style={{ background: '#1D203F', color: '#fff' }}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="chip bg-brand-pink text-white">
          Step {phaseStepIndex} of {stats.total} · {phase.label}
        </span>
        <span className="chip bg-white/10 text-white">{task.process}</span>
      </div>

      <h2 className="font-display tracking-wide" style={{ fontSize: '1.85rem', lineHeight: 1.15 }}>
        {task.title}
      </h2>
      {config.helper && <p className="mt-2 text-white/75 text-sm max-w-2xl">{config.helper}</p>}

      <div
        className="mt-5 rounded-[var(--radius-md)] px-4 py-3 text-sm max-w-2xl"
        style={{ background: 'rgba(225,34,140,0.15)', border: '1px solid rgba(225,34,140,0.4)' }}
      >
        <div className="font-semibold text-white mb-1">➡ Switch to the Debrief tab</div>
        <div className="text-white/75">
          The full 7-section debrief lives in the Live Build panel on the right. Fill it in section
          by section, then hit <span className="font-semibold">Save Debrief</span> at the bottom to
          finish the workflow.
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setLivePanelView('debrief')}
          className="btn-primary"
        >
          Open Debrief →
        </button>
        {config.aiBot && (
          <button
            type="button"
            onClick={() => openBot(task.id)}
            className="inline-flex items-center gap-2 font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5"
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              background: '#F89A2A',
              color: '#1D203F',
              border: 'none',
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
              boxShadow: '0 6px 18px rgba(248,154,42,0.30)',
            }}
            title={`Open ${config.aiBot.name}`}
          >
            <span style={{ fontSize: '1rem' }}>🤖</span> AI Assist
          </button>
        )}
      </div>
    </div>
  );
}
