import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import { dateAtMidnight, formatDateShort, todayAtMidnight } from '../lib/format.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function statusOf(iso) {
  const d = dateAtMidnight(iso);
  if (!d) return null;
  const today = todayAtMidnight();
  const diff = Math.round((d.getTime() - today.getTime()) / MS_PER_DAY);
  if (diff === 0) return { label: 'Today', color: '#E1228C' };
  if (diff < 0) return { label: `${Math.abs(diff)}d ago`, color: '#83CCBD' };
  return { label: `in ${diff}d`, color: '#F89A2A' };
}

export default function DatesView() {
  const { tasks, phases, goToPhase } = useLaunch();

  // Build the list of date-typed tasks regardless of whether they have a date.
  const dateSlots = tasks
    .map((t) => {
      const cfg = getTaskConfig(t.id);
      if (cfg.inputType !== 'date') return null;
      return {
        id: t.id,
        label: cfg.dateLabel ?? t.title,
        process: t.process,
        iso: typeof t.answer === 'string' ? t.answer : null,
        done: t.done,
      };
    })
    .filter(Boolean);

  const filled = dateSlots.filter((d) => d.iso);
  const empty = dateSlots.filter((d) => !d.iso);

  // Sort filled dates chronologically ascending so the next-up date is at the top.
  filled.sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0));

  function jumpToPhase(processName) {
    const phase = phases.find((p) => p.groups.includes(processName));
    if (phase) goToPhase(phase.id);
  }

  return (
    <div>
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink mb-2">
        Reserved dates — your launch calendar
      </div>
      <p className="text-xs text-brand-navy/60 mb-4">
        Every date you reserve shows up here, sorted chronologically. Use it as
        your at-a-glance launch calendar.
      </p>

      {filled.length > 0 && (
        <div className="mb-4">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-2">
            Reserved ({filled.length})
          </div>
          <ul className="space-y-2">
            {filled.map((d) => {
              const s = statusOf(d.iso);
              return (
                <li
                  key={d.id}
                  className="px-3 py-2.5 flex items-start gap-3"
                  style={{
                    background: '#fff',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(131,204,189,0.4)',
                  }}
                >
                  <span
                    className="shrink-0 inline-flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(225,34,140,0.10)',
                      color: '#E1228C',
                      fontSize: '1.1rem',
                    }}
                  >
                    📅
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55">
                      {d.process}
                    </div>
                    <div className="font-semibold text-brand-navy truncate">{d.label}</div>
                    <div className="text-sm text-brand-navy/70 flex items-center gap-2">
                      <span>{formatDateShort(d.iso)}</span>
                      {s && (
                        <span
                          className="text-[0.65rem] font-semibold uppercase tracking-wider"
                          style={{
                            color: s.color,
                            background: `${s.color}1A`,
                            padding: '2px 6px',
                            borderRadius: 999,
                          }}
                        >
                          {s.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => jumpToPhase(d.process)}
                    title="Edit this date"
                    className="shrink-0 text-brand-navy/40 hover:text-brand-pink transition-colors"
                    style={{ fontSize: '1rem' }}
                  >
                    ✎
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {empty.length > 0 && (
        <div>
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-2">
            Not reserved yet ({empty.length})
          </div>
          <ul className="space-y-1.5">
            {empty.map((d) => (
              <li
                key={d.id}
                className="px-3 py-2 flex items-center gap-2 text-sm text-brand-navy/65"
                style={{
                  background: 'rgba(29,32,63,0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed rgba(29,32,63,0.16)',
                }}
              >
                <span style={{ opacity: 0.5 }}>📅</span>
                <span className="font-semibold flex-1 truncate">{d.label}</span>
                <button
                  onClick={() => jumpToPhase(d.process)}
                  className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink hover:underline"
                >
                  Add →
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {dateSlots.length === 0 && (
        <div className="text-sm text-brand-navy/50 italic">No date-reservation steps yet.</div>
      )}
    </div>
  );
}
