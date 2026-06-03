import { useLaunch } from '../state/LaunchContext.jsx';

/**
 * A deliberately tight, single-row nav. Goals:
 *   - one consistent line height (no wrapping chips)
 *   - no large circular badges — small dots / icons instead
 *   - the active phase is the only "filled" pill; everything else is plain text
 *   - right-side actions are icon-leading buttons that match the brand pill height
 */
export default function PhaseNav() {
  const {
    phases,
    currentPhaseId,
    goToPhase,
    phaseStats,
    isPhaseUnlocked,
    overallProgress,
    totalDone,
    totalTasks,
    openMetricsDrawer,
    openAILibrary,
  } = useLaunch();

  const pct = Math.round(overallProgress * 100);

  return (
    <header
      style={{
        background: '#1D203F',
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="mx-auto flex items-center gap-3"
        style={{ maxWidth: '1280px', padding: '8px 20px' }}
      >
        {/* Brand */}
        <div
          className="shrink-0 inline-flex items-center font-bold uppercase tracking-wider whitespace-nowrap"
          style={{
            background: '#E1228C',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
          }}
          title="MBYMI Launch Execution Experience"
        >
          MBYMI Launch Execution Experience
        </div>

        {/* Phase nav */}
        <nav className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {phases.map((p, i) => {
            const stats = phaseStats[p.id];
            const unlocked = isPhaseUnlocked(p.id);
            const isActive = currentPhaseId === p.id;
            const isComplete = stats?.complete;

            return (
              <PhaseItem
                key={p.id}
                index={i + 1}
                label={p.label}
                blurb={p.blurb}
                active={isActive}
                complete={isComplete}
                unlocked={unlocked}
                onClick={() => unlocked && goToPhase(p.id)}
              />
            );
          })}
        </nav>

        {/* Progress + actions */}
        <div className="shrink-0 flex items-center gap-2">
          <ProgressPill totalDone={totalDone} totalTasks={totalTasks} pct={pct} />

          <IconButton
            onClick={openAILibrary}
            icon="🤖"
            label="AI Hub"
            accent="#F89A2A"
            title="AI Hub — all bots in one place"
          />
          <IconButton
            onClick={openMetricsDrawer}
            icon="📊"
            label="Metrics"
            title="Launch metrics"
          />
        </div>
      </div>
    </header>
  );
}

/* ---------- Phase pill ------------------------------------------------ */

function PhaseItem({ index, label, blurb, active, complete, unlocked, onClick }) {
  // Color story: active = solid pink, complete = green text + check, current
  // path forward (unlocked but not active) = white text, locked = grey + lock.
  let bg = 'transparent';
  let color = unlocked ? '#fff' : 'rgba(255,255,255,0.40)';
  let prefix = unlocked ? `${index}.` : '🔒';

  if (active) {
    bg = '#E1228C';
    color = '#fff';
  } else if (complete) {
    color = '#83CCBD';
    prefix = '✓';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!unlocked}
      className="shrink-0 inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider transition-colors"
      style={{
        padding: '5px 10px',
        borderRadius: 999,
        background: bg,
        color,
        fontSize: '0.7rem',
        letterSpacing: '0.06em',
        cursor: unlocked ? 'pointer' : 'not-allowed',
        whiteSpace: 'nowrap',
        border: 'none',
      }}
      title={unlocked ? blurb : 'Complete the previous phase first'}
    >
      <span style={{ opacity: active ? 1 : 0.65, fontSize: complete && !active ? '0.75rem' : 'inherit' }}>
        {prefix}
      </span>
      {label}
    </button>
  );
}

/* ---------- Progress pill --------------------------------------------- */

function ProgressPill({ totalDone, totalTasks, pct }) {
  return (
    <div
      className="hidden md:flex items-center gap-2"
      style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '4px 10px',
        borderRadius: 999,
      }}
      title={`${totalDone} of ${totalTasks} steps complete`}
    >
      <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/70">
        {pct}%
      </span>
      <span
        style={{
          width: 64,
          height: 4,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.15)',
          overflow: 'hidden',
          display: 'inline-block',
        }}
      >
        <span
          style={{
            display: 'block',
            height: '100%',
            width: `${pct}%`,
            background: '#E1228C',
            transition: 'width 240ms ease',
          }}
        />
      </span>
    </div>
  );
}

/* ---------- Icon button ----------------------------------------------- */

function IconButton({ onClick, icon, label, title, accent }) {
  // Icon-leading, label-trailing. Saffron accent for the AI button so it
  // visually distinguishes from Metrics without dominating the bar.
  const color = accent ?? '#fff';
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider transition-colors"
      style={{
        padding: '5px 10px',
        borderRadius: 999,
        background: accent ? 'rgba(248,154,42,0.14)' : 'rgba(255,255,255,0.06)',
        border: accent ? '1px solid rgba(248,154,42,0.40)' : '1px solid rgba(255,255,255,0.12)',
        color,
        letterSpacing: '0.06em',
      }}
    >
      <span style={{ fontSize: '0.85rem' }}>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
