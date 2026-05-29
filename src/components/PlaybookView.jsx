import { useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { makeLaunchView } from '../lib/math.js';
import { formatCurrency, formatDateShort, formatNumber, formatPercent } from '../lib/format.js';

// Resolves a task by id with its answer, or null.
function answerOf(tasks, id) {
  const t = tasks.find((x) => x.id === id);
  return t?.answer ?? null;
}

function Section({ title, filled, children }) {
  return (
    <section
      style={{
        borderTop: '1px solid rgba(29,32,63,0.08)',
        paddingTop: 12,
        paddingBottom: 12,
        opacity: filled ? 1 : 0.5,
      }}
    >
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/60 mb-2">
        {title}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }) {
  return <div className="text-sm text-brand-navy/40 italic">{children}</div>;
}

// Returns the first sentence (or ~90 chars) of a string, for the collapsed
// playbook preview.
function firstSentence(text) {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  const match = trimmed.match(/^.*?[.!?](\s|$)/);
  let snippet = match ? match[0].trim() : trimmed;
  if (snippet.length > 90) snippet = `${snippet.slice(0, 90).trim()}…`;
  else if (snippet.length < trimmed.length) snippet = `${snippet} …`;
  return snippet;
}

function Quote({ children }) {
  const [expanded, setExpanded] = useState(false);
  const text = typeof children === 'string' ? children : String(children ?? '');
  const isLong = text.trim().replace(/\s+/g, ' ').length > 90 || /[.!?]/.test(text);
  const preview = firstSentence(text);
  const showToggle = isLong && preview !== text.trim();

  return (
    <div
      className="text-sm text-brand-navy/85 whitespace-pre-line"
      style={{
        background: 'rgba(29,32,63,0.04)',
        borderLeft: '2px solid #E1228C',
        padding: '8px 10px',
        borderRadius: 4,
      }}
    >
      {expanded ? text : preview}
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="ml-1 text-[0.7rem] font-semibold uppercase tracking-wider text-brand-pink hover:underline"
        >
          {expanded ? 'less' : 'more'}
        </button>
      )}
    </div>
  );
}

export default function PlaybookView() {
  const { launch, tasks } = useLaunch();
  const view = makeLaunchView(launch, tasks);

  const revenueGoal = view.foundingMemberPrice * view.foundingMembersTarget;
  const conversionGoal =
    view.launchListTarget > 0 ? view.foundingMembersTarget / view.launchListTarget : 0;

  const offerDef = answerOf(tasks, 'mbymi-09-1');
  const productOutline = answerOf(tasks, 'mbymi-09-2');

  const momentum = answerOf(tasks, 'mbymi-02-1');
  const announcement = answerOf(tasks, 'mbymi-02-2');

  const contentSched = answerOf(tasks, 'mbymi-03-1');
  const regDeadline = answerOf(tasks, 'mbymi-03-2');
  const followUps = answerOf(tasks, 'mbymi-03-3');
  const initialAnnouncement = answerOf(tasks, 'mbymi-03-4');

  const confirmEmail = answerOf(tasks, 'mbymi-05-4');
  const day0 = answerOf(tasks, 'mbymi-07-1');
  const day2 = answerOf(tasks, 'mbymi-07-2');
  const day4 = answerOf(tasks, 'mbymi-07-3');
  const caseStudies = answerOf(tasks, 'mbymi-07-4');

  const promoChannels = answerOf(tasks, 'mbymi-08-1');
  const promoCopy = answerOf(tasks, 'mbymi-08-2');

  const flashAnnouncement = answerOf(tasks, 'mbymi-11-1');
  const webinarPlan = answerOf(tasks, 'mbymi-12-1');
  const followUpSeq = answerOf(tasks, 'mbymi-13-2');
  const closeDayEmail = answerOf(tasks, 'mbymi-14-1');
  const debrief = answerOf(tasks, 'mbymi-15-1');

  return (
    <div>
      {/* Header */}
      <div className="mb-3">
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink">
          MBYMI Launch Playbook
        </div>
        <div className="font-display text-2xl text-brand-navy" style={{ lineHeight: 1.1 }}>
          {launch.offerName?.trim() ? launch.offerName : 'Untitled launch'}
        </div>
      </div>

      <Section title="Offer" filled={view.foundingMemberPrice > 0 || offerDef}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-brand-navy">
          <div className="text-brand-navy/60">Price</div>
          <div className="font-semibold text-right">
            {view.foundingMemberPrice > 0 ? formatCurrency(view.foundingMemberPrice) : <Empty>—</Empty>}
          </div>
          <div className="text-brand-navy/60">Founders accepted</div>
          <div className="font-semibold text-right">
            {view.foundingMembersTarget > 0 ? formatNumber(view.foundingMembersTarget) : <Empty>—</Empty>}
          </div>
          <div className="text-brand-navy/60">Revenue goal</div>
          <div className="font-semibold text-right" style={{ color: '#E1228C' }}>
            {revenueGoal > 0 ? formatCurrency(revenueGoal) : <Empty>—</Empty>}
          </div>
        </div>
        {offerDef && (
          <div className="mt-3">
            <Quote>{offerDef}</Quote>
          </div>
        )}
      </Section>

      <Section title="Audience targets" filled={view.launchListTarget > 0}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-brand-navy">
          <div className="text-brand-navy/60">Launch list target</div>
          <div className="font-semibold text-right">
            {view.launchListTarget > 0 ? formatNumber(view.launchListTarget) : <Empty>—</Empty>}
          </div>
          <div className="text-brand-navy/60">Conversion goal</div>
          <div className="font-semibold text-right">
            {conversionGoal > 0 ? formatPercent(conversionGoal) : <Empty>—</Empty>}
          </div>
        </div>
      </Section>

      {(() => {
        const debrief = answerOf(tasks, 'mbymi-04-1');
        const closeDay = answerOf(tasks, 'mbymi-04-2');
        const followUp = answerOf(tasks, 'mbymi-04-3');
        const webinar = answerOf(tasks, 'mbymi-04-4');
        const flashSale = answerOf(tasks, 'mbymi-04-5');
        const filled = regDeadline || debrief || closeDay || followUp || webinar || flashSale;
        return (
          <Section title="Key dates" filled={filled}>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-brand-navy">
              <div className="text-brand-navy/60">Registration deadline</div>
              <div className="font-semibold text-right">
                {regDeadline ? formatDateShort(regDeadline) : <Empty>—</Empty>}
              </div>
              <div className="text-brand-navy/60">Flash sale day</div>
              <div className="font-semibold text-right">
                {flashSale ? formatDateShort(flashSale) : <Empty>—</Empty>}
              </div>
              <div className="text-brand-navy/60">Webinar day</div>
              <div className="font-semibold text-right">
                {webinar ? formatDateShort(webinar) : <Empty>—</Empty>}
              </div>
              <div className="text-brand-navy/60">4-day follow-up starts</div>
              <div className="font-semibold text-right">
                {followUp ? formatDateShort(followUp) : <Empty>—</Empty>}
              </div>
              <div className="text-brand-navy/60">Close day</div>
              <div className="font-semibold text-right" style={{ color: '#E1228C' }}>
                {closeDay ? formatDateShort(closeDay) : <Empty>—</Empty>}
              </div>
              <div className="text-brand-navy/60">Launch debrief</div>
              <div className="font-semibold text-right">
                {debrief ? formatDateShort(debrief) : <Empty>—</Empty>}
              </div>
            </div>
          </Section>
        );
      })()}

      <Section title="Map It · Momentum + Announcement" filled={momentum || announcement}>
        <div className="space-y-2">
          {momentum ? <Quote>{momentum}</Quote> : <Empty>Phase 1 plan not filled yet.</Empty>}
          {announcement ? <Quote>{announcement}</Quote> : <Empty>Phase 2 plan not filled yet.</Empty>}
        </div>
      </Section>

      <Section title="Book It · Content + Announcements" filled={contentSched || initialAnnouncement || followUps}>
        <div className="space-y-2">
          {contentSched ? <Quote>{contentSched}</Quote> : <Empty>No content schedule yet.</Empty>}
          {initialAnnouncement && <Quote>{initialAnnouncement}</Quote>}
          {followUps && <Quote>{followUps}</Quote>}
        </div>
      </Section>

      <Section
        title="Waitlist sequence"
        filled={confirmEmail || day0 || day2 || day4 || caseStudies}
      >
        {[
          { label: 'Confirmation', value: confirmEmail },
          { label: 'Day 0 · Thank you', value: day0 },
          { label: 'Day 2 · Origin story', value: day2 },
          { label: 'Day 4 · Stats/trends', value: day4 },
          { label: 'Day 6–10 · Case studies', value: caseStudies },
        ].map((row) => (
          <div key={row.label} className="mb-2">
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-0.5">
              {row.label}
            </div>
            {row.value ? <Quote>{row.value}</Quote> : <Empty>—</Empty>}
          </div>
        ))}
      </Section>

      <Section title="Promote priority waitlist" filled={promoChannels || promoCopy}>
        {promoChannels ? <Quote>{promoChannels}</Quote> : <Empty>No channels picked yet.</Empty>}
        {promoCopy && (
          <div className="mt-2">
            <Quote>{promoCopy}</Quote>
          </div>
        )}
      </Section>

      <Section title="Product outline" filled={productOutline}>
        {productOutline ? <Quote>{productOutline}</Quote> : <Empty>Outline not drafted yet.</Empty>}
      </Section>

      <Section title="Flash sale + Webinar" filled={flashAnnouncement || webinarPlan}>
        {flashAnnouncement && (
          <div className="mb-2">
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-0.5">
              Flash sale announcement
            </div>
            <Quote>{flashAnnouncement}</Quote>
          </div>
        )}
        {webinarPlan && (
          <div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-0.5">
              Webinar plan
            </div>
            <Quote>{webinarPlan}</Quote>
          </div>
        )}
        {!flashAnnouncement && !webinarPlan && <Empty>Not drafted yet.</Empty>}
      </Section>

      <Section title="Close + follow-up" filled={followUpSeq || closeDayEmail}>
        {followUpSeq && (
          <div className="mb-2">
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-0.5">
              4-day follow-up sequence
            </div>
            <Quote>{followUpSeq}</Quote>
          </div>
        )}
        {closeDayEmail && (
          <div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-0.5">
              Close day email
            </div>
            <Quote>{closeDayEmail}</Quote>
          </div>
        )}
        {!followUpSeq && !closeDayEmail && <Empty>Not drafted yet.</Empty>}
      </Section>

      <Section title="Debrief" filled={debrief}>
        {debrief ? <Quote>{debrief}</Quote> : <Empty>Run the launch first.</Empty>}
      </Section>
    </div>
  );
}
