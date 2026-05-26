import { useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';

const URL_REGEX = /\bhttps?:\/\/[^\s)]+/i;

function extractUrl(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(URL_REGEX);
  return match ? match[0] : null;
}

export default function LinksView() {
  const { tasks, goToPhase, phases } = useLaunch();
  const [copiedUrl, setCopiedUrl] = useState(null);

  // All link-labelled tasks, regardless of whether they're filled yet.
  // We show empty slots so the user knows what's coming and can navigate
  // to the right phase to fill them in.
  const linkSlots = tasks
    .map((t) => {
      const cfg = getTaskConfig(t.id);
      if (!cfg.linkLabel) return null;
      const url = extractUrl(t.answer);
      return {
        id: t.id,
        label: cfg.linkLabel,
        process: t.process,
        url,
        rawAnswer: typeof t.answer === 'string' ? t.answer : '',
        done: t.done,
      };
    })
    .filter(Boolean);

  const filled = linkSlots.filter((l) => l.url);
  const empty = linkSlots.filter((l) => !l.url);

  function copy(url) {
    if (!url) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl((current) => (current === url ? null : current)), 1500);
  }

  function jumpToPhase(processName) {
    // Find the phase that contains this process group, then switch to it.
    const phase = phases.find((p) => p.groups.includes(processName));
    if (phase) goToPhase(phase.id);
  }

  return (
    <div>
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink mb-2">
        Launch links — one place for every URL
      </div>
      <p className="text-xs text-brand-navy/60 mb-4">
        Paste URLs into the relevant steps (opt-in page, sales page, checkout, etc.) and they show
        up here for easy reference.
      </p>

      {filled.length > 0 && (
        <div className="mb-4">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-2">
            Saved ({filled.length})
          </div>
          <ul className="space-y-2">
            {filled.map((l) => (
              <li
                key={l.id}
                className="px-3 py-2.5"
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(131,204,189,0.4)',
                }}
              >
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55">
                  {l.label}
                </div>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block text-sm text-brand-pink font-semibold truncate mt-0.5 hover:underline"
                  title={l.url}
                >
                  {l.url}
                </a>
                <div className="mt-2 flex items-center gap-2 text-[0.7rem]">
                  <button
                    onClick={() => copy(l.url)}
                    className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider transition-colors"
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: copiedUrl === l.url ? '#83CCBD' : '#E1228C',
                      color: copiedUrl === l.url ? '#1D203F' : '#fff',
                      border: 'none',
                    }}
                  >
                    {copiedUrl === l.url ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider"
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: 'rgba(29,32,63,0.08)',
                      color: '#1D203F',
                    }}
                  >
                    ↗ Open
                  </a>
                  <button
                    onClick={() => jumpToPhase(l.process)}
                    className="font-semibold uppercase tracking-wider text-brand-navy/55 hover:text-brand-pink ml-auto"
                    title="Edit this step"
                  >
                    ✎ Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {empty.length > 0 && (
        <div>
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-2">
            Waiting for URL ({empty.length})
          </div>
          <ul className="space-y-1.5">
            {empty.map((l) => (
              <li
                key={l.id}
                className="px-3 py-2 text-sm text-brand-navy/65"
                style={{
                  background: 'rgba(29,32,63,0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed rgba(29,32,63,0.16)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ opacity: 0.5 }}>🔗</span>
                  <span className="font-semibold">{l.label}</span>
                  <button
                    onClick={() => jumpToPhase(l.process)}
                    className="ml-auto text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink hover:underline"
                  >
                    Add →
                  </button>
                </div>
                {l.rawAnswer && (
                  <div className="mt-1 text-xs italic text-brand-navy/50 truncate">
                    Note: {l.rawAnswer}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {linkSlots.length === 0 && (
        <div className="text-sm text-brand-navy/50 italic">
          No link-capturing steps in this launch yet.
        </div>
      )}
    </div>
  );
}
