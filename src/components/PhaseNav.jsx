import { useLaunch } from '../state/LaunchContext.jsx';

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
  } = useLaunch();

  const pct = Math.round(overallProgress * 100);

  return (
    <header
      className="w-full"
      style={{
        background: '#1D203F',
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="mx-auto flex items-center gap-4"
        style={{ maxWidth: '1280px', padding: '14px 24px' }}
      >
        <div className="shrink-0 flex items-center gap-2">
          <span className="chip bg-brand-pink text-white">MBYMI</span>
          <span className="font-display tracking-wider text-sm">Launch Workflow</span>
        </div>

        <nav className="flex items-center gap-2 flex-1 overflow-x-auto">
          {phases.map((p, i) => {
            const stats = phaseStats[p.id];
            const unlocked = isPhaseUnlocked(p.id);
            const isActive = currentPhaseId === p.id;
            const isComplete = stats?.complete;

            return (
              <button
                key={p.id}
                onClick={() => unlocked && goToPhase(p.id)}
                disabled={!unlocked}
                className="shrink-0 transition-colors"
                style={{
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  background: isActive
                    ? '#E1228C'
                    : isComplete
                      ? 'rgba(131,204,189,0.18)'
                      : 'rgba(255,255,255,0.06)',
                  color: isActive
                    ? '#fff'
                    : unlocked
                      ? '#fff'
                      : 'rgba(255,255,255,0.40)',
                  border: isActive
                    ? '1px solid #E1228C'
                    : '1px solid rgba(255,255,255,0.10)',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                }}
                title={unlocked ? p.blurb : 'Complete the previous phase first'}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: isComplete
                      ? '#83CCBD'
                      : isActive
                        ? 'rgba(255,255,255,0.20)'
                        : 'rgba(255,255,255,0.10)',
                    color: isComplete ? '#1D203F' : '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isComplete ? '✓' : unlocked ? i + 1 : '🔒'}
                </span>
                {i + 1}. {p.label}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-[0.65rem] uppercase tracking-wider text-white/60">
              Overall
            </span>
            <span className="font-display text-sm">
              {totalDone}/{totalTasks} · {pct}%
            </span>
          </div>
          <div className="w-28 hidden md:block">
            <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: '#E1228C' }}
              />
            </div>
          </div>
          <button
            onClick={openMetricsDrawer}
            className="shrink-0 text-xs font-semibold uppercase tracking-wider"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
            }}
          >
            📊 Metrics
          </button>
        </div>
      </div>
    </header>
  );
}
