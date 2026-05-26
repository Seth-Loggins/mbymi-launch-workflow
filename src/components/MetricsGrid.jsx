import { useLaunch } from '../state/LaunchContext.jsx';
import { makeLaunchView } from '../lib/math.js';
import { formatCurrency, formatNumber, formatPercent } from '../lib/format.js';

function MetricCard({ label, primary, secondary, progress, warn, accent }) {
  const pct = progress == null ? null : Math.min(1, Math.max(0, progress));
  const fillColor = warn ? '#F89A2A' : '#E1228C';
  const cardBg = warn ? 'rgba(248,154,42,0.08)' : '#fff';
  const accentColor = accent ?? '#1D203F';

  return (
    <div className="card-tight" style={{ background: cardBg }}>
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/60">
        {label}
      </div>
      <div
        className="font-display mt-0.5 leading-none"
        style={{ fontSize: '1.6rem', color: accentColor }}
      >
        {primary}
      </div>
      {secondary && <div className="text-xs text-brand-navy/60 mt-1">{secondary}</div>}
      {pct != null && (
        <div className="progress-track mt-3">
          <div
            className="progress-fill"
            style={{ width: `${Math.round(pct * 100)}%`, backgroundColor: fillColor }}
          />
        </div>
      )}
    </div>
  );
}

const WARN_THRESHOLD = 0.7;

export default function MetricsGrid({ derived }) {
  const { launch, tasks, metrics } = useLaunch();
  const view = makeLaunchView(launch, tasks);

  const revenueRatio = derived.revenueGoal > 0 ? metrics.revenueActual / derived.revenueGoal : 0;
  const membersRatio =
    view.foundingMembersTarget > 0
      ? metrics.membersEnrolledActual / view.foundingMembersTarget
      : 0;
  const waitlistRatio =
    view.launchListTarget > 0 ? metrics.waitlistSignupsActual / view.launchListTarget : 0;
  const conversionRatio =
    derived.conversionGoal > 0 ? derived.conversionActual / derived.conversionGoal : 0;

  const eplWarn = revenueRatio > 0 && revenueRatio < WARN_THRESHOLD;
  const showUpWarn = metrics.webinarShowUpsActual > 0 && derived.showUpRate < 0.3;

  return (
    <section>
      <header className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xl text-brand-navy">Launch metrics</h3>
        <div className="text-xs uppercase tracking-wider text-brand-navy/60">
          Manual entry · refresh resets
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Revenue"
          primary={formatCurrency(metrics.revenueActual)}
          secondary={`Goal ${formatCurrency(derived.revenueGoal)}`}
          progress={revenueRatio}
          warn={metrics.revenueActual > 0 && revenueRatio < WARN_THRESHOLD}
          accent="#E1228C"
        />
        <MetricCard
          label="Founding members"
          primary={`${formatNumber(metrics.membersEnrolledActual)} / ${formatNumber(
            view.foundingMembersTarget,
          )}`}
          secondary="Enrolled vs target"
          progress={membersRatio}
          warn={metrics.membersEnrolledActual > 0 && membersRatio < WARN_THRESHOLD}
        />
        <MetricCard
          label="Waitlist signups"
          primary={`${formatNumber(metrics.waitlistSignupsActual)} / ${formatNumber(
            view.launchListTarget,
          )}`}
          secondary="Leads vs goal"
          progress={waitlistRatio}
          warn={metrics.waitlistSignupsActual > 0 && waitlistRatio < WARN_THRESHOLD}
        />
        <MetricCard
          label="Conversion rate"
          primary={formatPercent(derived.conversionActual)}
          secondary={`Goal ${formatPercent(derived.conversionGoal)}`}
          progress={conversionRatio}
          warn={
            metrics.membersEnrolledActual > 0 &&
            derived.conversionActual < derived.conversionGoal &&
            derived.conversionGoal > 0
          }
        />
        <MetricCard
          label="Earnings per lead"
          primary={formatCurrency(derived.earningsPerLead)}
          secondary={
            metrics.waitlistSignupsActual > 0
              ? `${formatCurrency(metrics.revenueActual)} / ${formatNumber(
                  metrics.waitlistSignupsActual,
                )} leads`
              : 'Enter waitlist + revenue'
          }
          progress={null}
          warn={eplWarn}
        />
        <MetricCard
          label="Webinar show-up rate"
          primary={formatPercent(derived.showUpRate)}
          secondary={
            metrics.waitlistSignupsActual > 0
              ? `${formatNumber(metrics.webinarShowUpsActual)} of ${formatNumber(
                  metrics.waitlistSignupsActual,
                )} signups`
              : 'Optional metric'
          }
          progress={null}
          warn={showUpWarn}
        />
      </div>
    </section>
  );
}
