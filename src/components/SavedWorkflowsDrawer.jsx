import { useEffect } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { scrollIframeIntoView } from '../lib/iframeBridge.js';
import { formatDateShort } from '../lib/format.js';
import { mbymiTasks } from '../data/mbymiLaunch.js';

// Visible-step ids from the current workbook (embedded sub-tasks excluded).
const VISIBLE_TASK_IDS = mbymiTasks.filter((t) => !t.embedded).map((t) => t.id);

// Completed visible-step count for a snapshot. Works for new snapshots (which
// store a `progress` map) and older ones (which stored a full `tasks` array).
function snapshotDoneCount(snap) {
  if (snap.progress) {
    return VISIBLE_TASK_IDS.filter((id) => snap.progress[id]?.done).length;
  }
  if (Array.isArray(snap.tasks)) {
    return snap.tasks.filter((t) => !t.embedded && t.done).length;
  }
  return 0;
}

/**
 * Drawer listing saved workflow snapshots. Save the current workflow, reload a
 * past one, or delete. Mirrors the debrief-history pattern but for the whole
 * launch state.
 */
export default function SavedWorkflowsDrawer() {
  const {
    savedWorkflowsOpen,
    closeSavedWorkflows,
    savedWorkflows,
    saveWorkflow,
    loadWorkflow,
    deleteSavedWorkflow,
  } = useLaunch();

  useEffect(() => {
    if (!savedWorkflowsOpen) return;
    scrollIframeIntoView();
    function onKey(e) {
      if (e.key === 'Escape') closeSavedWorkflows();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [savedWorkflowsOpen, closeSavedWorkflows]);

  if (!savedWorkflowsOpen) return null;

  function handleSave() {
    saveWorkflow();
  }

  function handleLoad(id, savedAt) {
    if (
      window.confirm(
        `Load the workflow from ${new Date(savedAt).toLocaleString()}? Your current in-progress workflow will be replaced (save it first if you want to keep it).`,
      )
    ) {
      loadWorkflow(id);
    }
  }

  function handleDelete(id) {
    if (window.confirm('Delete this saved workflow? This cannot be undone.')) {
      deleteSavedWorkflow(id);
    }
  }

  return (
    <>
      <div
        onMouseDown={closeSavedWorkflows}
        style={{ position: 'absolute', inset: 0, background: 'rgba(29,32,63,0.45)', zIndex: 40 }}
      />
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="overflow-y-auto"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100vh',
          width: 'min(520px, 96vw)',
          background: '#F4F2F2',
          boxShadow: '-12px 0 32px rgba(29,32,63,0.20)',
          padding: '20px 24px 32px',
          zIndex: 41,
        }}
      >
        <header className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink">
              Saved launches
            </div>
            <h2 className="font-display text-2xl text-brand-navy">Save & resume</h2>
          </div>
          <button
            type="button"
            onClick={closeSavedWorkflows}
            className="text-brand-navy/50 hover:text-brand-navy"
            style={{ padding: '6px 10px', fontSize: '1.1rem' }}
            title="Close (Esc)"
          >
            ✕
          </button>
        </header>

        <p className="text-sm text-brand-navy/70 mb-4">
          Save a snapshot of your whole launch — answers, dates, links, metrics and debrief — and
          come back to it any time. Your progress is also auto-saved on this device, so you can
          stop mid-way and resume later.
        </p>

        <button
          type="button"
          onClick={handleSave}
          className="btn-primary w-full mb-5"
          style={{ padding: '12px', fontSize: '0.85rem' }}
        >
          💾 Save current launch
        </button>

        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg text-brand-navy">History</h3>
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
            {savedWorkflows.length}
          </span>
        </div>

        {savedWorkflows.length === 0 ? (
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
            No saved launches yet. Hit “Save current launch” above.
          </div>
        ) : (
          <ul className="space-y-2">
            {savedWorkflows.map((w) => (
              <li
                key={w.id}
                className="overflow-hidden"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(131,204,189,0.4)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleLoad(w.id, w.savedAt)}
                  className="w-full text-left px-3 py-2 transition-colors hover:bg-brand-navy/[0.03]"
                  title="Click to load this workflow"
                >
                  <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/55">
                    Saved {formatDateShort(w.savedAt)} at{' '}
                    {new Date(w.savedAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-sm font-semibold text-brand-navy mt-0.5">
                    {w.launch.offerName?.trim() || '(untitled launch)'}
                  </div>
                  <div className="text-xs text-brand-navy/65 mt-0.5">
                    {snapshotDoneCount(w)} / {VISIBLE_TASK_IDS.length} steps ·{' '}
                    <span className="text-brand-pink font-semibold">Click to load ↑</span>
                  </div>
                </button>
                <div
                  className="px-3 py-1.5 flex items-center justify-end gap-3 text-[0.7rem]"
                  style={{ borderTop: '1px solid rgba(29,32,63,0.06)', background: 'rgba(29,32,63,0.02)' }}
                >
                  <button
                    type="button"
                    onClick={() => handleLoad(w.id, w.savedAt)}
                    className="font-semibold uppercase tracking-wider text-brand-pink hover:underline"
                  >
                    ↑ Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(w.id)}
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
    </>
  );
}
