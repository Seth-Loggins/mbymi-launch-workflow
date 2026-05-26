import { useRef, useState } from 'react';
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
        Launch links — one place for every URL
      </div>
      <p className="text-xs text-brand-navy/60 mb-4">
        Paste URLs into the relevant steps (opt-in page, sales page, checkout, etc.) and they show
        up here for easy reference. Click the input to select, or hit Copy.
      </p>

      {filled.length > 0 && (
        <div className="mb-4">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55 mb-2">
            Saved ({filled.length})
          </div>
          <ul className="space-y-2">
            {filled.map((l) => (
              <LinkRow
                key={l.id}
                link={l}
                copied={copiedUrl === l.url}
                onCopied={() => flagCopied(l.url)}
                onEdit={() => jumpToPhase(l.process)}
              />
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

/**
 * One link row. The URL lives in a readonly <input> so it's natively selectable
 * (click-to-select-all), and the Copy button uses input.select() + execCommand
 * which is the most reliable cross-iframe path. Three fallbacks total:
 *   1. navigator.clipboard.writeText (modern, requires Permissions Policy)
 *   2. input.select() + document.execCommand('copy') (works in any iframe)
 *   3. window.prompt() with URL pre-selected (last resort)
 * If everything fails we just leave the input selected for ⌘C.
 */
function LinkRow({ link, copied, onCopied, onEdit }) {
  const inputRef = useRef(null);

  function selectAll() {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
    try {
      el.setSelectionRange(0, el.value.length);
    } catch {
      // ignore — some readonly inputs don't support setSelectionRange in older browsers
    }
  }

  async function handleCopy() {
    if (!link.url) return;

    // Path 1 — modern Clipboard API
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(link.url);
        onCopied();
        return;
      } catch {
        /* fall through */
      }
    }

    // Path 2 — readonly input + execCommand (most reliable in iframes)
    selectAll();
    try {
      const ok = document.execCommand('copy');
      if (ok) {
        onCopied();
        return;
      }
    } catch {
      /* fall through */
    }

    // Path 3 — prompt with URL pre-selected
    try {
      window.prompt('Copy link (⌘C / Ctrl+C):', link.url);
      return;
    } catch {
      /* swallow */
    }

    // Last-resort: leave the input selected so the user can ⌘C.
    selectAll();
  }

  return (
    <li
      className="px-3 py-2.5"
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(131,204,189,0.4)',
      }}
    >
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55">
        {link.label}
      </div>

      <div className="mt-1 flex items-center gap-2">
        <input
          ref={inputRef}
          readOnly
          value={link.url}
          onClick={selectAll}
          onFocus={selectAll}
          className="flex-1 min-w-0 text-sm font-medium text-brand-navy"
          style={{
            background: 'rgba(29,32,63,0.04)',
            border: '1px solid rgba(29,32,63,0.10)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            outline: 'none',
            cursor: 'text',
          }}
          title="Click to select"
        />
      </div>

      <div className="mt-2 flex items-center gap-2 text-[0.7rem]">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider transition-colors"
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            background: copied ? '#83CCBD' : '#E1228C',
            color: copied ? '#1D203F' : '#fff',
            border: 'none',
          }}
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider"
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            background: 'rgba(29,32,63,0.08)',
            color: '#1D203F',
            textDecoration: 'none',
          }}
        >
          ↗ Open
        </a>
        <button
          type="button"
          onClick={onEdit}
          className="font-semibold uppercase tracking-wider text-brand-navy/55 hover:text-brand-pink ml-auto"
          title="Edit this step"
        >
          ✎ Edit
        </button>
      </div>
    </li>
  );
}
