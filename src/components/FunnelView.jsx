import { useLaunch } from '../state/LaunchContext.jsx';

// Each tile lights up when the relevant task is complete. The funnel reads
// top-to-bottom as the user's prospect journey from opt-in through purchase.

function taskById(tasks, id) {
  return tasks.find((t) => t.id === id) ?? null;
}

function tileFromTask(tasks, id, { label, icon, hint }) {
  const t = taskById(tasks, id);
  const done = !!t?.done;
  const detail =
    typeof t?.answer === 'string' && t.answer
      ? t.answer.length > 80
        ? `${t.answer.slice(0, 80)}…`
        : t.answer
      : null;
  return { id, label, icon, hint, done, detail };
}

export default function FunnelView() {
  const { tasks } = useLaunch();

  const tiles = [
    tileFromTask(tasks, 'mbymi-05-1', {
      label: 'Priority Waitlist Opt-in',
      icon: '🪧',
      hint: 'Where leads sign up for the launch',
    }),
    tileFromTask(tasks, 'mbymi-05-2', {
      label: 'Thank You / Redirect Page',
      icon: '✅',
      hint: 'Post-signup confirmation',
    }),
    tileFromTask(tasks, 'mbymi-05-4', {
      label: 'Confirmation Email',
      icon: '📧',
      hint: 'Immediate "you’re in" email',
    }),
    {
      id: 'nurture',
      label: 'Nurture Sequence',
      icon: '💌',
      hint: 'Day 0 / 2 / 4 / 6–10 emails',
      done: ['mbymi-07-1', 'mbymi-07-2', 'mbymi-07-3', 'mbymi-07-4'].every((id) => taskById(tasks, id)?.done),
      detail: (() => {
        const filled = ['mbymi-07-1', 'mbymi-07-2', 'mbymi-07-3', 'mbymi-07-4'].filter(
          (id) => taskById(tasks, id)?.done,
        ).length;
        return filled > 0 ? `${filled}/4 emails drafted` : null;
      })(),
    },
    tileFromTask(tasks, 'mbymi-12-1', {
      label: 'Webinar',
      icon: '🎥',
      hint: 'Pitch the beta offer live',
    }),
    tileFromTask(tasks, 'mbymi-10-4', {
      label: 'Sales Page',
      icon: '📄',
      hint: 'The main convincing page',
    }),
    tileFromTask(tasks, 'mbymi-10-1', {
      label: 'Checkout',
      icon: '💳',
      hint: 'Stripe / Kajabi checkout',
    }),
    tileFromTask(tasks, 'mbymi-10-2', {
      label: 'Post-Purchase Thank You',
      icon: '🎉',
      hint: 'First touch as a member',
    }),
  ];

  return (
    <div>
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink mb-2">
        Funnel — your prospect's journey
      </div>
      <p className="text-xs text-brand-navy/60 mb-4">
        Each step lights up as you complete the relevant task. Locked tiles show what's coming.
      </p>

      <div className="space-y-2">
        {tiles.map((tile, i) => (
          <div key={tile.id}>
            <div
              className="px-3 py-2.5"
              style={{
                background: tile.done ? '#fff' : 'rgba(29,32,63,0.03)',
                borderRadius: 'var(--radius-md)',
                border: tile.done
                  ? '1px solid rgba(131,204,189,0.6)'
                  : '1px dashed rgba(29,32,63,0.18)',
                opacity: tile.done ? 1 : 0.55,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: '1.1rem',
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: tile.done ? '#83CCBD' : 'rgba(29,32,63,0.06)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {tile.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-brand-navy">{tile.label}</div>
                {tile.detail ? (
                  <div className="text-xs text-brand-navy/70 mt-0.5">{tile.detail}</div>
                ) : (
                  <div className="text-xs text-brand-navy/45 mt-0.5">{tile.hint}</div>
                )}
              </div>
              {tile.done && (
                <span
                  className="shrink-0 inline-flex items-center justify-center"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: '#83CCBD',
                    color: '#1D203F',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                  }}
                >
                  ✓
                </span>
              )}
            </div>
            {i < tiles.length - 1 && (
              <div
                style={{
                  width: 2,
                  height: 14,
                  background: 'rgba(29,32,63,0.15)',
                  margin: '0 auto',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
