import { useEffect, useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import { copyViaParent } from '../lib/iframeBridge.js';

/**
 * Collects every email the user has written across the workflow (tasks tagged
 * with `emailLabel`) and shows them one at a time with prev/next navigation.
 * Emails can be long, so the body scrolls and the pager sits at the bottom.
 */
export default function EmailsView() {
  const { tasks, goToPhase, phases } = useLaunch();
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Build the ordered list of email slots (filled + empty), sorted by task order.
  const emailSlots = [...tasks]
    .sort((a, b) => a.order - b.order)
    .map((t) => {
      const cfg = getTaskConfig(t.id);
      if (!cfg.emailLabel) return null;
      return {
        id: t.id,
        label: cfg.emailLabel,
        process: t.process,
        body: typeof t.answer === 'string' ? t.answer : '',
        done: t.done,
      };
    })
    .filter(Boolean);

  // Keep index in range as data changes.
  const filledCount = emailSlots.filter((e) => e.body).length;
  const safeIndex = Math.min(index, Math.max(0, emailSlots.length - 1));
  useEffect(() => {
    if (index !== safeIndex) setIndex(safeIndex);
    setCopied(false);
  }, [safeIndex, index]);

  if (emailSlots.length === 0) {
    return (
      <div className="text-sm text-brand-navy/55 italic">No email steps in this launch yet.</div>
    );
  }

  const current = emailSlots[safeIndex];

  function jumpToPhase(processName) {
    const phase = phases.find((p) => p.groups.includes(processName));
    if (phase) goToPhase(phase.id);
  }

  async function handleCopy() {
    if (!current.body) return;
    let ok = false;
    try {
      ok = await copyViaParent(current.body);
    } catch {
      ok = false;
    }
    if (!ok && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(current.body);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } else {
      window.prompt('Copy email (⌘C / Ctrl+C):', current.body);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink">
          Your emails
        </div>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55">
          {filledCount} written · {emailSlots.length} total
        </span>
      </div>

      {/* Current email card */}
      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(29,32,63,0.10)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        <div
          className="px-3 py-2 flex items-center justify-between gap-2"
          style={{ background: 'rgba(29,32,63,0.04)', borderBottom: '1px solid rgba(29,32,63,0.08)' }}
        >
          <div className="min-w-0">
            <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-brand-navy/50">
              {current.process} · {safeIndex + 1} of {emailSlots.length}
            </div>
            <div className="font-semibold text-brand-navy text-sm truncate">{current.label}</div>
          </div>
          {current.body ? (
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-[0.65rem]"
              style={{
                padding: '5px 10px',
                borderRadius: 999,
                background: copied ? '#83CCBD' : '#E1228C',
                color: copied ? '#1D203F' : '#fff',
                border: 'none',
              }}
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => jumpToPhase(current.process)}
              className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink hover:underline"
            >
              Write →
            </button>
          )}
        </div>

        <div style={{ maxHeight: 280, overflowY: 'auto', overflowX: 'hidden', padding: '12px 14px' }}>
          {current.body ? (
            <div
              className="text-sm text-brand-navy/85 whitespace-pre-line"
              style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
            >
              {current.body}
            </div>
          ) : (
            <div className="text-sm italic text-brand-navy/40">
              Not written yet — head to the {current.process} step to draft it.
            </div>
          )}
        </div>
      </div>

      {/* Pager */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={safeIndex === 0}
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider disabled:opacity-30"
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(29,32,63,0.06)',
            color: '#1D203F',
            border: 'none',
            cursor: safeIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ← Prev
        </button>
        <div className="flex items-center gap-1">
          {emailSlots.map((e, i) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setIndex(i)}
              title={e.label}
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background:
                  i === safeIndex ? '#E1228C' : e.body ? 'rgba(131,204,189,0.8)' : 'rgba(29,32,63,0.15)',
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(emailSlots.length - 1, i + 1))}
          disabled={safeIndex === emailSlots.length - 1}
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider disabled:opacity-30"
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(29,32,63,0.06)',
            color: '#1D203F',
            border: 'none',
            cursor: safeIndex === emailSlots.length - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
