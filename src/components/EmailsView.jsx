import { useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import { extractUrl, LinkRow } from './LinksView.jsx';

/**
 * Single-page list of every email slot in the launch (tasks tagged with
 * `emailLabel`). Each email now stores a Google Doc link, so this mirrors the
 * Links tab — saved links up top with Open/Copy, empty ones below — instead of
 * the old one-at-a-time pager. Kept as its own "Emails" tab so the user can
 * find these docs quickly without hunting through the general Links list.
 */
export default function EmailsView() {
  const { tasks, goToPhase, phases } = useLaunch();
  const [copiedUrl, setCopiedUrl] = useState(null);

  const emailSlots = [...tasks]
    .sort((a, b) => a.order - b.order)
    .map((t) => {
      const cfg = getTaskConfig(t.id);
      if (!cfg.emailLabel) return null;
      const url = extractUrl(t.answer);
      return {
        id: t.id,
        label: cfg.emailLabel,
        process: t.process,
        url,
        rawAnswer: typeof t.answer === 'string' ? t.answer : '',
        done: t.done,
      };
    })
    .filter(Boolean);

  const filled = emailSlots.filter((e) => e.url);
  const empty = emailSlots.filter((e) => !e.url);

  function flagCopied(url) {
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl((current) => (current === url ? null : current)), 1500);
  }

  function jumpToPhase(processName) {
    const phase = phases.find((p) => p.groups.includes(processName));
    if (phase) goToPhase(phase.id);
  }

  return (
    <div>
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink mb-2">
        Your emails — every Google Doc in one place
      </div>
      <p className="text-xs text-brand-navy/60 mb-4">
        Add a Google Doc link on each email step and it shows up here, so your emails are always
        easy to find. Click a link to open it, or hit Copy.
      </p>

      {filled.length > 0 && (
        <div className="mb-4">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-2">
            Saved ({filled.length})
          </div>
          <ul className="space-y-2">
            {filled.map((e) => (
              <LinkRow
                key={e.id}
                link={e}
                copied={copiedUrl === e.url}
                onCopied={() => flagCopied(e.url)}
                onEdit={() => jumpToPhase(e.process)}
              />
            ))}
          </ul>
        </div>
      )}

      {empty.length > 0 && (
        <div>
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-2">
            Waiting for link ({empty.length})
          </div>
          <ul className="space-y-1.5">
            {empty.map((e) => (
              <li
                key={e.id}
                className="px-3 py-2 text-sm text-brand-navy/65"
                style={{
                  background: 'rgba(29,32,63,0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed rgba(29,32,63,0.16)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ opacity: 0.5 }}>✉️</span>
                  <span className="font-semibold">{e.label}</span>
                  <button
                    onClick={() => jumpToPhase(e.process)}
                    className="ml-auto text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink hover:underline"
                  >
                    Add →
                  </button>
                </div>
                {e.rawAnswer && !e.url && (
                  <div className="mt-1 text-xs italic text-brand-navy/50 truncate">
                    Note: {e.rawAnswer}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {emailSlots.length === 0 && (
        <div className="text-sm text-brand-navy/50 italic">No email steps in this launch yet.</div>
      )}
    </div>
  );
}
