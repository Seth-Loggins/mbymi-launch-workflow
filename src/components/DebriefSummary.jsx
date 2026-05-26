import { useLaunch } from '../state/LaunchContext.jsx';
import { formatCurrency, formatDateShort } from '../lib/format.js';

/**
 * Live, read-only mirror of the Debrief form. Shown on the right side of the
 * dashboard when the user is on the Launch Debrief step — they fill in the
 * form on the left, the summary on the right updates as they type.
 */

function Section({ title, children }) {
  return (
    <section
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(29,32,63,0.08)',
        padding: '12px 14px',
      }}
      className="mb-3"
    >
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/60 mb-2">
        {title}
      </div>
      {children}
    </section>
  );
}

function Row({ label, value, accent }) {
  const isFilled = value !== '' && value !== null && value !== undefined;
  return (
    <div className="flex items-baseline justify-between gap-3 py-1 text-sm">
      <div className="text-brand-navy/60 shrink-0">{label}</div>
      <div
        className="font-semibold text-right truncate"
        style={{ color: isFilled ? (accent ?? '#1D203F') : 'rgba(29,32,63,0.30)' }}
        title={isFilled ? String(value) : '—'}
      >
        {isFilled ? value : '—'}
      </div>
    </div>
  );
}

function Quote({ value, accent }) {
  if (!value) {
    return (
      <div className="text-sm italic text-brand-navy/35">— not filled in yet —</div>
    );
  }
  return (
    <div
      className="text-sm whitespace-pre-line"
      style={{
        background: 'rgba(29,32,63,0.04)',
        borderLeft: `2px solid ${accent ?? '#E1228C'}`,
        padding: '8px 10px',
        borderRadius: 4,
        color: '#1D203F',
      }}
    >
      {value}
    </div>
  );
}

function pctSum(parts) {
  const sum = parts.reduce((acc, n) => acc + (Number(n) || 0), 0);
  return sum;
}

export default function DebriefSummary() {
  const { debriefDraft, launch } = useLaunch();
  const d = debriefDraft;

  const totalRevenue = d.offers.reduce(
    (sum, o) => sum + (Number(o.offerPrice) || 0) * (Number(o.unitsSold) || 0),
    0,
  );
  const totalUnits = d.offers.reduce((sum, o) => sum + (Number(o.unitsSold) || 0), 0);

  const leadSum = pctSum([
    d.listAudience.paidPercent,
    d.listAudience.organicPercent,
    d.listAudience.partnerPercent,
  ]);

  const cplAuto =
    Number(d.listAudience.totalAdSpend) > 0 && Number(d.listAudience.totalRegistrants) > 0
      ? (Number(d.listAudience.totalAdSpend) / Number(d.listAudience.totalRegistrants)).toFixed(2)
      : '';

  return (
    <div>
      <div className="mb-3">
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink">
          Live preview
        </div>
        <h3 className="font-display text-xl text-brand-navy" style={{ lineHeight: 1.1 }}>
          {launch.offerName?.trim() || 'Your launch'} · Debrief
        </h3>
        <p className="text-xs text-brand-navy/55 mt-0.5">
          Updates as you fill in the form on the left.
        </p>
      </div>

      <Section title="Launch details">
        <Row label="Campaign name" value={d.launchDetails.campaignName} />
        <Row
          label="Start date"
          value={d.launchDetails.campaignStartDate ? formatDateShort(d.launchDetails.campaignStartDate) : ''}
        />
        <Row label="Promotion type" value={d.launchDetails.promotionType} />
        <Row label="Audience segment" value={d.launchDetails.audienceSegment} />
      </Section>

      <Section title={`Offers · ${d.offers.length}`}>
        {d.offers.map((o, i) => {
          const revenue = (Number(o.offerPrice) || 0) * (Number(o.unitsSold) || 0);
          const filled = o.offerName || o.offerPrice || o.unitsSold;
          return (
            <div
              key={o.id}
              className="mb-2 pb-2"
              style={{
                borderBottom: i < d.offers.length - 1 ? '1px dashed rgba(29,32,63,0.10)' : 'none',
              }}
            >
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/45 mb-1">
                Offer {i + 1}
              </div>
              {!filled ? (
                <div className="text-sm italic text-brand-navy/35">— not filled in yet —</div>
              ) : (
                <>
                  <Row label="Name" value={o.offerName} />
                  <Row label="Payment" value={o.paymentStructure} />
                  <Row label="Price" value={o.offerPrice ? formatCurrency(o.offerPrice) : ''} />
                  <Row label="Units sold" value={o.unitsSold} />
                  <Row label="Revenue" value={revenue ? formatCurrency(revenue) : ''} accent="#E1228C" />
                </>
              )}
            </div>
          );
        })}
        <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(29,32,63,0.08)' }}>
          <Row label="Total units" value={totalUnits || ''} />
          <Row label="Total revenue" value={totalRevenue ? formatCurrency(totalRevenue) : ''} accent="#E1228C" />
        </div>
      </Section>

      <Section title="List & audience">
        <Row label="Registrants" value={d.listAudience.totalRegistrants} />
        <Row label="List at start" value={d.listAudience.listSizeAtStart} />
        <Row label="List today" value={d.listAudience.listSizeToday} />
        {leadSum > 0 && (
          <>
            <Row
              label="Paid"
              value={d.listAudience.paidPercent ? `${d.listAudience.paidPercent}%` : ''}
            />
            <Row
              label="Organic"
              value={d.listAudience.organicPercent ? `${d.listAudience.organicPercent}%` : ''}
            />
            <Row
              label="Partner"
              value={d.listAudience.partnerPercent ? `${d.listAudience.partnerPercent}%` : ''}
            />
            <Row
              label="Sum check"
              value={`${leadSum}%`}
              accent={leadSum === 100 ? '#83CCBD' : '#F65556'}
            />
          </>
        )}
        <Row
          label="Ad spend"
          value={d.listAudience.totalAdSpend ? formatCurrency(d.listAudience.totalAdSpend) : ''}
        />
        <Row
          label="Cost per lead"
          value={
            d.listAudience.costPerLead
              ? formatCurrency(d.listAudience.costPerLead)
              : cplAuto
                ? `${formatCurrency(cplAuto)} (auto)`
                : ''
          }
        />
      </Section>

      <Section title={`Registration & attendance · ${d.registrationAttendance.landingPages.length} page${d.registrationAttendance.landingPages.length === 1 ? '' : 's'}`}>
        {d.registrationAttendance.landingPages.length === 0 ? (
          <div className="text-sm italic text-brand-navy/35 mb-2">— no landing pages added yet —</div>
        ) : (
          <ul className="space-y-1 mb-2">
            {d.registrationAttendance.landingPages.map((p) => (
              <li key={p.id} className="text-xs">
                <span className="font-semibold text-brand-navy">{p.label || '(no label)'}</span>
                <span className="text-brand-navy/55"> — {p.url || '(no URL)'}</span>
              </li>
            ))}
          </ul>
        )}
        <Row label="Live attendees" value={d.registrationAttendance.liveAttendees} />
        <Row label="Replay views" value={d.registrationAttendance.replayViews} />
        <Row label="Avg. watch time" value={d.registrationAttendance.avgWatchTime} />
      </Section>

      <Section title="Email performance">
        <Row label="Total emails sent" value={d.emailPerformance.totalEmailsSent} />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider mb-1" style={{ color: '#83CCBD' }}>
              Best
            </div>
            <Row label="Subject" value={d.emailPerformance.bestSubject} />
            <Row
              label="Open rate"
              value={d.emailPerformance.bestOpenRate ? `${d.emailPerformance.bestOpenRate}%` : ''}
            />
          </div>
          <div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider mb-1" style={{ color: '#F65556' }}>
              Worst
            </div>
            <Row label="Subject" value={d.emailPerformance.worstSubject} />
            <Row
              label="Open rate"
              value={d.emailPerformance.worstOpenRate ? `${d.emailPerformance.worstOpenRate}%` : ''}
            />
          </div>
        </div>
      </Section>

      <Section title="Sales & conversions">
        <Row label="Sales page visitors" value={d.salesConversions.salesPageVisitors} />
        <Row label="Checkout visitors" value={d.salesConversions.checkoutPageVisitors} />
        <Row
          label="Order bump take rate"
          value={d.salesConversions.orderBumpRate ? `${d.salesConversions.orderBumpRate}%` : ''}
        />
        <Row
          label="Upsell conversion"
          value={d.salesConversions.upsellConversion ? `${d.salesConversions.upsellConversion}%` : ''}
        />
        <Row
          label="Downsell conversion"
          value={d.salesConversions.downsellConversion ? `${d.salesConversions.downsellConversion}%` : ''}
        />
      </Section>

      <Section title="Lessons learned">
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider mb-1" style={{ color: '#83CCBD' }}>
          What worked best
        </div>
        <Quote value={d.lessonsLearned.whatWorked} accent="#83CCBD" />
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider mt-3 mb-1" style={{ color: '#F65556' }}>
          What didn't work
        </div>
        <Quote value={d.lessonsLearned.whatDidntWork} accent="#F65556" />
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider mt-3 mb-1 text-brand-navy/60">
          Biggest surprise
        </div>
        <Quote value={d.lessonsLearned.biggestSurprise} />
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider mt-3 mb-1 text-brand-navy/60">
          Customer feedback
        </div>
        <Quote value={d.lessonsLearned.customerFeedback} />
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider mt-3 mb-1 text-brand-navy/60">
          Tech issues
        </div>
        <Quote value={d.lessonsLearned.techIssues} />
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider mt-3 mb-1 text-brand-navy/60">
          Team capacity
        </div>
        <Quote value={d.lessonsLearned.teamCapacity} />
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider mt-3 mb-1 text-brand-navy/60">
          What to test next
        </div>
        <Quote value={d.lessonsLearned.whatToTest} accent="#F89A2A" />
      </Section>
    </div>
  );
}
