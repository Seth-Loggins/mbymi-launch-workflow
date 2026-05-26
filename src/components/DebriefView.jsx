import { useLaunch } from '../state/LaunchContext.jsx';
import { formatDateShort } from '../lib/format.js';

const PROMOTION_TYPES = ['', 'Webinar', 'Challenge', 'Live launch', 'Evergreen', 'Email-only', 'Other'];
const PAYMENT_STRUCTURES = ['One-Time', 'Payment Plan', 'Subscription', 'Subscription + One-Time'];

/* ---------- shared field primitives ---------------------------------- */

function FieldLabel({ children, optional }) {
  return (
    <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/70 mb-1.5">
      {children}
      {optional && <span className="ml-1 text-brand-navy/40 normal-case">(opt)</span>}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, optional, type = 'text', prefix, suffix }) {
  return (
    <label className="block">
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <div
        className="flex items-center"
        style={{
          background: '#fff',
          border: '1px solid rgba(29,32,63,0.18)',
          borderRadius: 'var(--radius-md)',
          padding: '0 10px',
          transition: 'border-color 120ms',
        }}
      >
        {prefix && <span className="text-brand-navy/60 mr-1">{prefix}</span>}
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent text-sm text-brand-navy"
          style={{ padding: '8px 0', minWidth: 0 }}
        />
        {suffix && <span className="text-brand-navy/60 ml-1 text-sm">{suffix}</span>}
      </div>
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder, optional, rows = 3 }) {
  return (
    <label className="block">
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full outline-none text-sm text-brand-navy resize-y"
        style={{
          background: '#fff',
          border: '1px solid rgba(29,32,63,0.18)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 10px',
        }}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, optional }) {
  return (
    <label className="block">
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full outline-none text-sm text-brand-navy"
        style={{
          background: '#fff',
          border: '1px solid rgba(29,32,63,0.18)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 10px',
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || 'Select type…'}
          </option>
        ))}
      </select>
    </label>
  );
}

function Section({ num, title, children }) {
  return (
    <section
      className="mb-4"
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(29,32,63,0.08)',
        padding: '14px 16px',
      }}
    >
      <header className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center justify-center font-bold"
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            background: '#1D203F',
            color: '#fff',
            fontSize: '0.7rem',
          }}
        >
          {num}
        </span>
        <h3 className="font-display tracking-wide text-brand-navy" style={{ fontSize: '1rem' }}>
          {title}
        </h3>
      </header>
      {children}
    </section>
  );
}

/* ---------- main view ------------------------------------------------- */

export default function DebriefView() {
  const {
    debriefDraft,
    debriefHistory,
    setDebriefField,
    setOfferField,
    addOffer,
    removeOffer,
    setLandingPageField,
    addLandingPage,
    removeLandingPage,
    saveDebrief,
    clearDebriefDraft,
    deleteDebriefHistoryEntry,
    loadDebriefFromHistory,
  } = useLaunch();

  function handleSave() {
    saveDebrief();
  }

  function handleClear() {
    if (
      window.confirm(
        'Clear the debrief form? Anything you saved already stays safe in history below.',
      )
    ) {
      clearDebriefDraft();
    }
  }

  function handleLoad(id, savedAt) {
    const ok = window.confirm(
      `Load the debrief from ${new Date(savedAt).toLocaleString()} into the form above? Anything you have in the form right now will be replaced (but it's not deleted — re-save to keep a new snapshot).`,
    );
    if (ok) loadDebriefFromHistory(id);
  }

  function handleDelete(id) {
    if (window.confirm('Delete this debrief snapshot? This cannot be undone.')) {
      deleteDebriefHistoryEntry(id);
    }
  }

  // Auto-calc cost per lead if ad spend + total registrants are both filled and
  // user hasn't manually set CPL.
  const adSpend = Number(debriefDraft.listAudience.totalAdSpend) || 0;
  const totalLeads = Number(debriefDraft.listAudience.totalRegistrants) || 0;
  const autoCpl = adSpend > 0 && totalLeads > 0 ? (adSpend / totalLeads).toFixed(2) : '';

  return (
    <div>
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink mb-2">
        Business by Design
      </div>
      <h2 className="font-display text-3xl text-brand-navy mb-1" style={{ lineHeight: 1.05 }}>
        LAUNCH DEBRIEF
      </h2>
      <p className="text-sm text-brand-navy/70 mb-4">
        Document your launch results. Every number tells a story — capture it while it's fresh.
      </p>

      {/* ---- Section 1: Launch details ---- */}
      <Section num="1" title="Launch details">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <TextField
            label="Campaign name"
            value={debriefDraft.launchDetails.campaignName}
            onChange={(v) => setDebriefField('launchDetails', 'campaignName', v)}
            placeholder="e.g. Spring 2026 BBD Launch"
          />
          <TextField
            label="Campaign start date"
            type="date"
            value={debriefDraft.launchDetails.campaignStartDate}
            onChange={(v) => setDebriefField('launchDetails', 'campaignStartDate', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <SelectField
            label="Promotion type"
            value={debriefDraft.launchDetails.promotionType}
            onChange={(v) => setDebriefField('launchDetails', 'promotionType', v)}
            options={PROMOTION_TYPES}
          />
          <TextField
            label="Audience segment"
            optional
            value={debriefDraft.launchDetails.audienceSegment}
            onChange={(v) => setDebriefField('launchDetails', 'audienceSegment', v)}
            placeholder="e.g. Full list, warm buyers only, new leads"
          />
        </div>
        <p className="text-xs text-brand-navy/55">Which portion of your list you promoted to.</p>
      </Section>

      {/* ---- Section 2: Offers ---- */}
      <Section num="2" title="Your offer(s)">
        <p className="text-xs text-brand-navy/65 mb-3">
          Add each offer separately — including order bumps, upsells, and payment plans. Revenue is
          calculated automatically.
        </p>
        {debriefDraft.offers.map((offer, idx) => (
          <div
            key={offer.id}
            className="mb-3"
            style={{
              background: 'rgba(29,32,63,0.03)',
              border: '1px solid rgba(29,32,63,0.10)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink">
                Offer {idx + 1}
              </div>
              {debriefDraft.offers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOffer(offer.id)}
                  className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 hover:text-brand-orange"
                >
                  ✕ Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <TextField
                label="Offer name"
                value={offer.offerName}
                onChange={(v) => setOfferField(offer.id, 'offerName', v)}
                placeholder="e.g. BBD Accelerator"
              />
              <SelectField
                label="Payment structure"
                value={offer.paymentStructure}
                onChange={(v) => setOfferField(offer.id, 'paymentStructure', v)}
                options={PAYMENT_STRUCTURES}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Offer price"
                type="number"
                prefix="$"
                value={offer.offerPrice}
                onChange={(v) => setOfferField(offer.id, 'offerPrice', v)}
                placeholder="997"
              />
              <TextField
                label="Units sold"
                type="number"
                value={offer.unitsSold}
                onChange={(v) => setOfferField(offer.id, 'unitsSold', v)}
                placeholder="0"
              />
            </div>
            <div className="mt-3 text-xs text-brand-navy/65">
              Revenue: <span className="font-semibold text-brand-pink">
                ${((Number(offer.offerPrice) || 0) * (Number(offer.unitsSold) || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addOffer}
          className="w-full text-xs font-semibold uppercase tracking-wider text-brand-pink"
          style={{
            border: '1px dashed rgba(225,34,140,0.5)',
            borderRadius: 'var(--radius-md)',
            padding: '10px',
            background: 'rgba(225,34,140,0.04)',
          }}
        >
          + Add Another Offer
        </button>
      </Section>

      {/* ---- Section 3: List & Audience ---- */}
      <Section num="3" title="List & audience">
        <div className="mb-3">
          <TextField
            label="Total launch registrants"
            type="number"
            value={debriefDraft.listAudience.totalRegistrants}
            onChange={(v) => setDebriefField('listAudience', 'totalRegistrants', v)}
            placeholder="e.g. 1,500"
          />
          <p className="mt-1 text-xs text-brand-navy/55">Total leads who entered your launch.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <TextField
              label="List size at start"
              optional
              type="number"
              value={debriefDraft.listAudience.listSizeAtStart}
              onChange={(v) => setDebriefField('listAudience', 'listSizeAtStart', v)}
              placeholder="e.g. 12,000"
            />
            <p className="mt-1 text-xs text-brand-navy/55">Email subscribers before the launch.</p>
          </div>
          <div>
            <TextField
              label="List size today"
              optional
              type="number"
              value={debriefDraft.listAudience.listSizeToday}
              onChange={(v) => setDebriefField('listAudience', 'listSizeToday', v)}
              placeholder="e.g. 12,800"
            />
            <p className="mt-1 text-xs text-brand-navy/55">Email subscribers right now.</p>
          </div>
        </div>
        <FieldLabel>Lead source breakdown <span className="normal-case text-brand-navy/40">(optional — must add to 100%)</span></FieldLabel>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <TextField
            label="Paid %"
            type="number"
            suffix="%"
            value={debriefDraft.listAudience.paidPercent}
            onChange={(v) => setDebriefField('listAudience', 'paidPercent', v)}
            placeholder="40"
          />
          <TextField
            label="Organic %"
            type="number"
            suffix="%"
            value={debriefDraft.listAudience.organicPercent}
            onChange={(v) => setDebriefField('listAudience', 'organicPercent', v)}
            placeholder="45"
          />
          <TextField
            label="Partner / affiliate %"
            type="number"
            suffix="%"
            value={debriefDraft.listAudience.partnerPercent}
            onChange={(v) => setDebriefField('listAudience', 'partnerPercent', v)}
            placeholder="15"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Total ad spend"
            optional
            type="number"
            prefix="$"
            value={debriefDraft.listAudience.totalAdSpend}
            onChange={(v) => setDebriefField('listAudience', 'totalAdSpend', v)}
            placeholder="0"
          />
          <div>
            <TextField
              label="Cost per lead"
              optional
              type="number"
              prefix="$"
              value={debriefDraft.listAudience.costPerLead || autoCpl}
              onChange={(v) => setDebriefField('listAudience', 'costPerLead', v)}
              placeholder={autoCpl || 'auto'}
            />
            <p className="mt-1 text-xs text-brand-navy/55">
              Enter ad spend + list size above to auto-calculate.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Section 4: Registration & Attendance ---- */}
      <Section num="4" title="Registration & attendance">
        <FieldLabel>Landing pages</FieldLabel>
        {debriefDraft.registrationAttendance.landingPages.length > 0 && (
          <ul className="space-y-2 mb-2">
            {debriefDraft.registrationAttendance.landingPages.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-12 gap-2 items-center px-2 py-2"
                style={{
                  background: 'rgba(29,32,63,0.03)',
                  border: '1px solid rgba(29,32,63,0.08)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <input
                  type="text"
                  value={p.label}
                  onChange={(e) => setLandingPageField(p.id, 'label', e.target.value)}
                  placeholder="Label (e.g. Webinar Reg Page)"
                  className="col-span-4 outline-none text-sm bg-transparent text-brand-navy"
                />
                <input
                  type="text"
                  value={p.url}
                  onChange={(e) => setLandingPageField(p.id, 'url', e.target.value)}
                  placeholder="https://…"
                  className="col-span-7 outline-none text-sm bg-transparent text-brand-navy"
                />
                <button
                  type="button"
                  onClick={() => removeLandingPage(p.id)}
                  className="col-span-1 text-brand-navy/40 hover:text-brand-orange text-right"
                  title="Remove"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={addLandingPage}
          className="w-full text-xs font-semibold uppercase tracking-wider text-brand-pink mb-3"
          style={{
            border: '1px dashed rgba(225,34,140,0.5)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            background: 'rgba(225,34,140,0.04)',
          }}
        >
          + Add Landing Page
        </button>
        <FieldLabel>Event attendance</FieldLabel>
        <div className="grid grid-cols-3 gap-3">
          <TextField
            label="Live attendees"
            optional
            type="number"
            value={debriefDraft.registrationAttendance.liveAttendees}
            onChange={(v) => setDebriefField('registrationAttendance', 'liveAttendees', v)}
            placeholder="0"
          />
          <TextField
            label="Replay views / opt-ins"
            optional
            type="number"
            value={debriefDraft.registrationAttendance.replayViews}
            onChange={(v) => setDebriefField('registrationAttendance', 'replayViews', v)}
            placeholder="0"
          />
          <TextField
            label="Avg. watch time"
            optional
            value={debriefDraft.registrationAttendance.avgWatchTime}
            onChange={(v) => setDebriefField('registrationAttendance', 'avgWatchTime', v)}
            placeholder="e.g. 42 min"
          />
        </div>
        <p className="text-xs text-brand-navy/55 mt-1">Number of live attendees.</p>
      </Section>

      {/* ---- Section 5: Email Performance ---- */}
      <Section num="5" title="Email performance">
        <div className="mb-3">
          <TextField
            label="Total emails sent"
            optional
            type="number"
            value={debriefDraft.emailPerformance.totalEmailsSent}
            onChange={(v) => setDebriefField('emailPerformance', 'totalEmailsSent', v)}
            placeholder="e.g. 18"
          />
          <p className="mt-1 text-xs text-brand-navy/55">
            Individual broadcast emails written and sent during this launch.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>
              <span style={{ color: '#83CCBD' }}>Best performing email</span>
            </FieldLabel>
            <div className="space-y-3">
              <TextField
                label="Subject line"
                optional
                value={debriefDraft.emailPerformance.bestSubject}
                onChange={(v) => setDebriefField('emailPerformance', 'bestSubject', v)}
                placeholder="e.g. You'll never believe…"
              />
              <TextField
                label="Open rate"
                optional
                type="number"
                suffix="%"
                value={debriefDraft.emailPerformance.bestOpenRate}
                onChange={(v) => setDebriefField('emailPerformance', 'bestOpenRate', v)}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <FieldLabel>
              <span style={{ color: '#F65556' }}>Worst performing email</span>
            </FieldLabel>
            <div className="space-y-3">
              <TextField
                label="Subject line"
                optional
                value={debriefDraft.emailPerformance.worstSubject}
                onChange={(v) => setDebriefField('emailPerformance', 'worstSubject', v)}
                placeholder="e.g. Last chance (again)"
              />
              <TextField
                label="Open rate / metric"
                optional
                type="number"
                suffix="%"
                value={debriefDraft.emailPerformance.worstOpenRate}
                onChange={(v) => setDebriefField('emailPerformance', 'worstOpenRate', v)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 6: Sales & Conversions ---- */}
      <Section num="6" title="Sales & conversions">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <TextField
            label="Sales page unique visitors"
            optional
            type="number"
            value={debriefDraft.salesConversions.salesPageVisitors}
            onChange={(v) => setDebriefField('salesConversions', 'salesPageVisitors', v)}
            placeholder="0"
          />
          <TextField
            label="Checkout page unique visitors"
            optional
            type="number"
            value={debriefDraft.salesConversions.checkoutPageVisitors}
            onChange={(v) => setDebriefField('salesConversions', 'checkoutPageVisitors', v)}
            placeholder="0"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <TextField
              label="Order bump take rate"
              optional
              type="number"
              suffix="%"
              value={debriefDraft.salesConversions.orderBumpRate}
              onChange={(v) => setDebriefField('salesConversions', 'orderBumpRate', v)}
              placeholder="0"
            />
            <p className="mt-1 text-xs text-brand-navy/55">% of buyers who added the bump.</p>
          </div>
          <TextField
            label="Upsell conversion rate"
            optional
            type="number"
            suffix="%"
            value={debriefDraft.salesConversions.upsellConversion}
            onChange={(v) => setDebriefField('salesConversions', 'upsellConversion', v)}
            placeholder="0"
          />
        </div>
        <TextField
          label="Downsell conversion rate"
          optional
          type="number"
          suffix="%"
          value={debriefDraft.salesConversions.downsellConversion}
          onChange={(v) => setDebriefField('salesConversions', 'downsellConversion', v)}
          placeholder="0"
        />
      </Section>

      {/* ---- Section 7: Lessons learned ---- */}
      <Section num="7" title="Lessons learned">
        <p className="text-xs text-brand-navy/65 mb-3">
          Be honest. This is your private record — the more specific you are now, the more valuable
          this becomes later.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <TextareaField
            label={<span style={{ color: '#83CCBD' }}>What worked best</span>}
            optional
            value={debriefDraft.lessonsLearned.whatWorked}
            onChange={(v) => setDebriefField('lessonsLearned', 'whatWorked', v)}
            placeholder="Top 3 things you'd repeat exactly next launch…"
            rows={3}
          />
          <TextareaField
            label={<span style={{ color: '#F65556' }}>What didn't work</span>}
            optional
            value={debriefDraft.lessonsLearned.whatDidntWork}
            onChange={(v) => setDebriefField('lessonsLearned', 'whatDidntWork', v)}
            placeholder="Honest assessment — no sugarcoating…"
            rows={3}
          />
          <TextareaField
            label="Biggest surprise"
            optional
            value={debriefDraft.lessonsLearned.biggestSurprise}
            onChange={(v) => setDebriefField('lessonsLearned', 'biggestSurprise', v)}
            placeholder="Something you didn't expect — good or bad…"
            rows={3}
          />
          <TextareaField
            label="Customer feedback themes"
            optional
            value={debriefDraft.lessonsLearned.customerFeedback}
            onChange={(v) => setDebriefField('lessonsLearned', 'customerFeedback', v)}
            placeholder="Objections, questions, praise that repeated…"
            rows={3}
          />
          <TextareaField
            label="Tech issues / problems"
            optional
            value={debriefDraft.lessonsLearned.techIssues}
            onChange={(v) => setDebriefField('lessonsLearned', 'techIssues', v)}
            placeholder="Zoom crashes, cart errors, email deliverability…"
            rows={3}
          />
          <TextareaField
            label="Team capacity & support load"
            optional
            value={debriefDraft.lessonsLearned.teamCapacity}
            onChange={(v) => setDebriefField('lessonsLearned', 'teamCapacity', v)}
            placeholder="Were people stretched? Any bottlenecks?"
            rows={3}
          />
        </div>
        <div className="mt-3">
          <TextareaField
            label="What to test next launch"
            optional
            value={debriefDraft.lessonsLearned.whatToTest}
            onChange={(v) => setDebriefField('lessonsLearned', 'whatToTest', v)}
            placeholder="Hypotheses for the next iteration — price, funnel, messaging, traffic source…"
            rows={3}
          />
        </div>
      </Section>

      <div className="mt-2 grid grid-cols-12 gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="btn-primary col-span-12 sm:col-span-8"
          style={{ padding: '12px', fontSize: '0.85rem' }}
        >
          Save debrief
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="btn-ghost col-span-12 sm:col-span-4"
          style={{ padding: '12px', fontSize: '0.78rem' }}
          title="Empty the form (history below stays safe)"
        >
          🧹 Clear form
        </button>
      </div>

      {/* ---- History ---- */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg text-brand-navy">My debrief history</h3>
          <span
            className="inline-flex items-center justify-center font-bold"
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: '#1D203F',
              color: '#fff',
              fontSize: '0.7rem',
            }}
          >
            {debriefHistory.length}
          </span>
        </div>
        {debriefHistory.length === 0 ? (
          <div
            className="text-sm text-brand-navy/55 italic"
            style={{
              background: '#fff',
              border: '1px solid rgba(29,32,63,0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              textAlign: 'center',
            }}
          >
            No debriefs saved yet. Complete your first one above.
          </div>
        ) : (
          <ul className="space-y-2">
            {debriefHistory.map((r) => (
              <li
                key={r.id}
                className="overflow-hidden"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(131,204,189,0.4)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleLoad(r.id, r.savedAt)}
                  className="w-full text-left px-3 py-2 transition-colors hover:bg-brand-navy/[0.03]"
                  title="Click to load this snapshot back into the form above"
                >
                  <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55">
                    Saved {formatDateShort(r.savedAt)} at{' '}
                    {new Date(r.savedAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-sm font-semibold text-brand-navy mt-0.5">
                    {r.data.launchDetails.campaignName || '(no campaign name)'}
                  </div>
                  <div className="text-xs text-brand-navy/65 mt-0.5">
                    {r.data.offers.length} offer{r.data.offers.length === 1 ? '' : 's'} ·{' '}
                    {r.data.listAudience.totalRegistrants || 0} registrants ·{' '}
                    <span className="text-brand-pink font-semibold">Click to load ↑</span>
                  </div>
                </button>
                <div
                  className="px-3 py-1.5 flex items-center justify-end gap-3 text-[0.7rem]"
                  style={{ borderTop: '1px solid rgba(29,32,63,0.06)', background: 'rgba(29,32,63,0.02)' }}
                >
                  <button
                    type="button"
                    onClick={() => handleLoad(r.id, r.savedAt)}
                    className="font-semibold uppercase tracking-wider text-brand-pink hover:underline"
                  >
                    ↑ Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="font-semibold uppercase tracking-wider text-brand-navy/50 hover:text-[#F65556]"
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
