import { useEffect, useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import DebriefStepCard from './DebriefStepCard.jsx';

export default function StepCard() {
  const {
    currentTask,
    currentPhase,
    phaseStepIndex,
    phaseStats,
    completeTask,
    goToPhase,
    phases,
    openBot,
    openMetricsDrawer,
  } = useLaunch();

  if (!currentTask) {
    const phaseIdx = phases.findIndex((p) => p.id === currentPhase.id);
    const nextPhase = phases[phaseIdx + 1];
    return (
      <div className="card" style={{ background: '#83CCBD', color: '#1D203F' }}>
        <div className="chip bg-brand-navy text-white mb-3">Phase complete</div>
        <h2 className="font-display tracking-wide" style={{ fontSize: '2rem', lineHeight: 1.1 }}>
          {currentPhase.label} is done. Nice work.
        </h2>
        <p className="mt-2 text-brand-navy/80 max-w-xl">{currentPhase.blurb}</p>
        {nextPhase ? (
          <button className="btn-dark mt-5" onClick={() => goToPhase(nextPhase.id)}>
            Start phase {phaseIdx + 2} · {nextPhase.label} →
          </button>
        ) : (
          <p className="mt-5 font-semibold">All six phases complete — launch is fully scoped.</p>
        )}
      </div>
    );
  }

  const currentTaskConfig = getTaskConfig(currentTask.id);
  if (currentTaskConfig.inputType === 'debrief') {
    return <DebriefStepCard task={currentTask} phase={currentPhase} phaseStepIndex={phaseStepIndex} phaseStats={phaseStats} />;
  }

  return (
    <ActiveStep
      task={currentTask}
      phase={currentPhase}
      phaseStepIndex={phaseStepIndex}
      phaseStats={phaseStats}
      onComplete={completeTask}
      onOpenBot={openBot}
      onOpenMetrics={openMetricsDrawer}
    />
  );
}

function ActiveStep({ task, phase, phaseStepIndex, phaseStats, onComplete, onOpenBot, onOpenMetrics }) {
  const config = getTaskConfig(task.id);
  const stats = phaseStats[phase.id];

  // Local draft state — only commits to context when user clicks Continue.
  // We key by task.id so switching tasks resets the draft cleanly.
  const [draft, setDraft] = useState(() => seedDraft(task, config));
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    setDraft(seedDraft(task, config));
    setShowExample(false);
  }, [task.id]);

  const valid = validate(draft, config);

  function handleContinue() {
    if (!valid) return;
    const answer = serializeAnswer(draft, config);
    onComplete(task.id, answer);
  }

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
      {config.helper && (
        <p className="mt-2 text-white/70 text-sm max-w-2xl">{config.helper}</p>
      )}
      <div className="mt-3">
        <TrainingVideoLink url={config.videoUrl} />
      </div>

      <div className="mt-5 max-w-2xl">
        <StepInput config={config} draft={draft} setDraft={setDraft} task={task} />
      </div>

      {config.promptMetricsUpdate && (
        <div
          className="mt-4 max-w-2xl flex items-start gap-3 px-3 py-2.5"
          style={{
            background: 'rgba(248,154,42,0.12)',
            border: '1px solid rgba(248,154,42,0.4)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>📊</span>
          <div className="flex-1 text-sm text-white">
            <span className="font-semibold">Good moment to check your metrics.</span>{' '}
            <span className="text-white/75">
              After this step you'll have fresh numbers to log — open the metrics drawer to see how
              you're tracking vs goal.
            </span>
          </div>
          <button
            onClick={onOpenMetrics}
            className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wider"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              background: '#F89A2A',
              color: '#1D203F',
            }}
          >
            Update metrics →
          </button>
        </div>
      )}

      {config.example && (
        <div className="mt-4 max-w-2xl">
          <button
            type="button"
            onClick={() => setShowExample((v) => !v)}
            className="text-xs font-semibold uppercase tracking-wider text-brand-pink"
          >
            {showExample ? '▾ Hide example' : '▸ See an example'}
          </button>
          {showExample && (
            <div
              className="mt-2 rounded-[var(--radius-md)] px-4 py-3 text-sm whitespace-pre-line"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)' }}
            >
              {config.example}
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3 flex-wrap">
        <button
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleContinue}
          disabled={!valid}
        >
          {config.inputType === 'acknowledge' ? 'Mark complete →' : 'Continue →'}
        </button>

        {config.aiBot && (
          <button
            type="button"
            onClick={() => onOpenBot(task.id)}
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

        <span className="text-xs text-white/50 ml-auto">
          {config.inputType === 'text' && config.minChars
            ? `${draftCharCount(draft)}/${config.minChars} chars`
            : ''}
        </span>
      </div>
    </div>
  );
}

/* ---------- Training video link --------------------------------------- */

function TrainingVideoLink({ url }) {
  // Placeholder when no URL is configured. The user will swap in real video
  // links via the `videoUrl` field in mbymiTaskConfig.js.
  if (!url) {
    return (
      <div
        className="inline-flex items-center gap-2 text-xs text-white/55"
        title="Training video coming soon"
      >
        <span style={{ fontSize: '0.95rem' }}>📹</span>
        <span className="italic">Training video coming soon</span>
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-brand-pink transition-colors"
      style={{
        background: 'rgba(255,255,255,0.10)',
        padding: '6px 12px',
        borderRadius: 999,
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: '0.95rem' }}>📹</span>
      Watch the training
    </a>
  );
}

/* ---------- input renderers per type ----------------------------------- */

function StepInput({ config, draft, setDraft }) {
  const baseInput = {
    className:
      'w-full bg-white/10 text-white placeholder-white/40 text-base outline-none transition focus:bg-white/15',
    style: {
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
    },
  };

  switch (config.inputType) {
    case 'text':
      return (
        <textarea
          {...baseInput}
          rows={Math.max(4, Math.min(10, Math.ceil((config.minChars ?? 60) / 18)))}
          placeholder={config.placeholder ?? 'Type your answer…'}
          value={draft.text ?? ''}
          onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          autoFocus
        />
      );

    case 'number':
      return (
        <div className="flex items-center gap-2">
          {config.prefix && (
            <span className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {config.prefix}
            </span>
          )}
          <input
            {...baseInput}
            type="number"
            inputMode="numeric"
            min="0"
            placeholder={config.placeholder ?? '0'}
            value={draft.number ?? ''}
            onChange={(e) => setDraft({ ...draft, number: e.target.value })}
            autoFocus
          />
          {config.unit && (
            <span className="text-sm uppercase tracking-wider text-white/60">{config.unit}</span>
          )}
        </div>
      );

    case 'date':
      return (
        <input
          {...baseInput}
          type="date"
          value={draft.date ?? ''}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
        />
      );

    case 'note':
      return (
        <input
          {...baseInput}
          type="text"
          placeholder={config.placeholder ?? 'Optional notes / URL'}
          value={draft.text ?? ''}
          onChange={(e) => setDraft({ ...draft, text: e.target.value })}
        />
      );

    case 'acknowledge':
    default:
      return (
        <div
          className="rounded-[var(--radius-md)] px-4 py-3 text-sm"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)' }}
        >
          External action — when you've done this in Kajabi / your tool / IRL, mark it complete to
          advance.
        </div>
      );
  }
}

/* ---------- helpers ---------------------------------------------------- */

function seedDraft(task, config) {
  const answer = task.answer;
  switch (config.inputType) {
    case 'text':
    case 'note':
      return { text: typeof answer === 'string' ? answer : '' };
    case 'number':
      return { number: answer != null ? String(answer) : '' };
    case 'date':
      return { date: typeof answer === 'string' ? answer : '' };
    default:
      return {};
  }
}

function validate(draft, config) {
  switch (config.inputType) {
    case 'text':
      return (draft.text ?? '').trim().length >= (config.minChars ?? 1);
    case 'note':
      return true; // optional
    case 'number':
      return Number(draft.number) > 0;
    case 'date':
      return true; // optional
    case 'acknowledge':
    default:
      return true;
  }
}

function serializeAnswer(draft, config) {
  switch (config.inputType) {
    case 'text':
    case 'note':
      return (draft.text ?? '').trim() || null;
    case 'number':
      return Number(draft.number) || 0;
    case 'date':
      return draft.date || null;
    case 'acknowledge':
    default:
      return null;
  }
}

function draftCharCount(draft) {
  return (draft.text ?? '').trim().length;
}
