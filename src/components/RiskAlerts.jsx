const SEVERITY = {
  danger: {
    bg: 'rgba(246, 85, 86, 0.10)',
    border: '#F65556',
    label: 'Risk',
    labelBg: '#F65556',
  },
  warning: {
    bg: 'rgba(248, 154, 42, 0.12)',
    border: '#F89A2A',
    label: 'Heads-up',
    labelBg: '#F89A2A',
  },
  success: {
    bg: 'rgba(131, 204, 189, 0.20)',
    border: '#83CCBD',
    label: 'Wins',
    labelBg: '#83CCBD',
  },
};

export default function RiskAlerts({ alerts, isSetupComplete }) {
  if (!isSetupComplete) {
    return (
      <section className="card" style={{ opacity: 0.55 }}>
        <header className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xl text-brand-navy">Alerts</h3>
          <span className="chip bg-brand-navy/10 text-brand-navy">Unlocks after setup</span>
        </header>
        <p className="text-sm text-brand-navy/60">
          Once setup is done, this panel watches your numbers and warns when conversion drops,
          close day looms with steps remaining, or you beat a target.
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <header className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xl text-brand-navy">Alerts</h3>
        <div className="text-xs uppercase tracking-wider text-brand-navy/60">
          {alerts.length} active
        </div>
      </header>

      {alerts.length === 0 ? (
        <div
          className="rounded-[var(--radius-md)] px-4 py-3 text-sm text-brand-navy/70"
          style={{ background: 'rgba(29,32,63,0.04)' }}
        >
          No alerts yet. Update metrics to start tracking risk.
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((a, i) => {
            const s = SEVERITY[a.severity] ?? SEVERITY.warning;
            return (
              <li
                key={`${a.severity}-${i}`}
                className="rounded-[var(--radius-md)] px-4 py-3"
                style={{
                  background: s.bg,
                  borderLeft: `3px solid ${s.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="chip text-white" style={{ background: s.labelBg }}>
                    {s.label}
                  </span>
                  <span className="text-sm font-semibold text-brand-navy">{a.title}</span>
                </div>
                <div className="text-sm text-brand-navy/80">{a.message}</div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
