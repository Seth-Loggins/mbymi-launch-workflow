import { useEffect, useMemo, useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { computeAlerts, computeDerived } from '../lib/math.js';
import MetricsGrid from './MetricsGrid.jsx';
import RecoveryCalculator from './RecoveryCalculator.jsx';
import RiskAlerts from './RiskAlerts.jsx';
import MetricsEditor from './MetricsEditor.jsx';

export default function MetricsDrawer() {
  const {
    launch,
    tasks,
    metrics,
    processOrder,
    metricsOpen,
    closeMetricsDrawer,
  } = useLaunch();

  const [editorOpen, setEditorOpen] = useState(false);

  // Esc closes the drawer (but not when the editor modal is on top).
  useEffect(() => {
    if (!metricsOpen) return;
    function onKey(e) {
      if (e.key === 'Escape' && !editorOpen) closeMetricsDrawer();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [metricsOpen, editorOpen, closeMetricsDrawer]);

  const derived = useMemo(() => computeDerived(launch, metrics, tasks), [launch, metrics, tasks]);
  const alerts = useMemo(
    () => computeAlerts({ launch, metrics, tasks, derived, processOrder }),
    [launch, metrics, tasks, derived, processOrder],
  );

  if (!metricsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      style={{ background: 'rgba(29,32,63,0.45)' }}
      onMouseDown={closeMetricsDrawer}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="h-full overflow-y-auto"
        style={{
          width: 'min(560px, 96vw)',
          background: '#F4F2F2',
          boxShadow: '-12px 0 32px rgba(29,32,63,0.20)',
          padding: '20px 24px 32px',
        }}
      >
        <header className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink">
              Bonus panel
            </div>
            <h2 className="font-display text-2xl text-brand-navy">Launch metrics</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary" onClick={() => setEditorOpen(true)}>
              Update metrics
            </button>
            <button
              type="button"
              onClick={closeMetricsDrawer}
              className="text-brand-navy/50 hover:text-brand-navy"
              style={{ padding: '6px 10px', fontSize: '1.1rem' }}
              title="Close"
            >
              ✕
            </button>
          </div>
        </header>

        <p className="text-sm text-brand-navy/70 mb-5 max-w-md">
          These power the launch math: revenue vs goal, conversion, recovery, and risk alerts.
          Optional — the workbook stands on its own without them.
        </p>

        <div className="space-y-5">
          <MetricsGrid derived={derived} />
          <RecoveryCalculator derived={derived} />
          <RiskAlerts alerts={alerts} isSetupComplete={true} />
        </div>
      </div>

      {editorOpen && <MetricsEditor onClose={() => setEditorOpen(false)} />}
    </div>
  );
}
