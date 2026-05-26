import { useEffect, useMemo, useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { computeRecovery } from '../lib/math.js';
import { formatCurrency, formatNumber, formatPercentRate } from '../lib/format.js';

export default function RecoveryCalculator({ derived }) {
  const { launch, tasks, metrics } = useLaunch();

  const startRate = useMemo(() => {
    const actual = derived.conversionActual * 100;
    return Math.max(0, Math.min(8, Number.isFinite(actual) ? actual : 0));
  }, [derived.conversionActual]);

  const [rate, setRate] = useState(startRate);

  useEffect(() => {
    setRate(startRate);
  }, [startRate]);

  const recovery = computeRecovery(launch, metrics, rate, tasks);

  const verdict = (() => {
    if (recovery.revenueGoal <= 0) return 'Set a price and founding-member target on setup to see a verdict.';
    if (recovery.hitsGoal) {
      return `Goal hit — ${formatCurrency(recovery.surplus)} above target.`;
    }
    const short = recovery.revenueGoal - recovery.projectedRevenue;
    if (recovery.conversionToHitGoal > 0) {
      return `Falls ${formatCurrency(short)} short — lift conversion to ${formatPercentRate(
        recovery.conversionToHitGoal,
      )} to hit goal.`;
    }
    return `Falls ${formatCurrency(short)} short — add waitlist signups before recovery is meaningful.`;
  })();

  const verdictColor = recovery.hitsGoal ? '#83CCBD' : '#F65556';

  return (
    <section className="card">
      <header className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xl text-brand-navy">Recovery calculator</h3>
        <div className="text-xs uppercase tracking-wider text-brand-navy/60">
          What-if · final conversion
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 md:col-span-7">
          <div className="flex items-baseline justify-between mb-2">
            <div className="field-label">Final conversion rate</div>
            <div className="font-display text-2xl text-brand-pink leading-none">
              {formatPercentRate(rate)}
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-[#E1228C]"
          />
          <div className="flex justify-between text-[0.65rem] uppercase tracking-wider text-brand-navy/50 mt-1">
            <span>0%</span>
            <span>2%</span>
            <span>4%</span>
            <span>6%</span>
            <span>8%</span>
          </div>

          <div className="mt-4 rounded-[var(--radius-md)] px-4 py-3" style={{ background: 'rgba(29,32,63,0.04)' }}>
            <div className="text-xs uppercase tracking-wider" style={{ color: verdictColor }}>
              Verdict
            </div>
            <div className="mt-0.5 text-brand-navy font-semibold">{verdict}</div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5 space-y-3">
          <Stat label="Projected members" value={formatNumber(recovery.projectedMembers)} />
          <Stat label="Projected revenue" value={formatCurrency(recovery.projectedRevenue)} />
          <Stat label="Revenue goal" value={formatCurrency(recovery.revenueGoal)} muted />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="text-xs uppercase tracking-wider text-brand-navy/60">{label}</div>
      <div className="font-display text-2xl leading-none text-brand-navy">{value}</div>
    </div>
  );
}
