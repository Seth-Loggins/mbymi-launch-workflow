import { useEffect, useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';

export default function MetricsEditor({ onClose }) {
  const { metrics, updateMetrics } = useLaunch();
  const [draft, setDraft] = useState({
    revenueActual: String(metrics.revenueActual ?? 0),
    membersEnrolledActual: String(metrics.membersEnrolledActual ?? 0),
    waitlistSignupsActual: String(metrics.waitlistSignupsActual ?? 0),
    webinarShowUpsActual: String(metrics.webinarShowUpsActual ?? 0),
  });

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function setField(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    updateMetrics({
      revenueActual: Number(draft.revenueActual) || 0,
      membersEnrolledActual: Number(draft.membersEnrolledActual) || 0,
      waitlistSignupsActual: Number(draft.waitlistSignupsActual) || 0,
      webinarShowUpsActual: Number(draft.webinarShowUpsActual) || 0,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(29, 32, 63, 0.5)' }}
      onMouseDown={onClose}
    >
      <form
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={handleSave}
        className="card w-full max-w-md shadow-elevated"
        style={{ borderRadius: 'var(--radius-lg)' }}
      >
        <header className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl text-brand-navy">Update metrics</h3>
          <button type="button" className="text-brand-navy/50 hover:text-brand-navy" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="space-y-4">
          <Field label="Revenue actual ($)">
            <input
              className="field-input"
              type="number"
              min="0"
              value={draft.revenueActual}
              onChange={(e) => setField('revenueActual', e.target.value)}
              autoFocus
            />
          </Field>
          <Field label="Founding members enrolled">
            <input
              className="field-input"
              type="number"
              min="0"
              value={draft.membersEnrolledActual}
              onChange={(e) => setField('membersEnrolledActual', e.target.value)}
            />
          </Field>
          <Field label="Waitlist signups (total)">
            <input
              className="field-input"
              type="number"
              min="0"
              value={draft.waitlistSignupsActual}
              onChange={(e) => setField('waitlistSignupsActual', e.target.value)}
            />
          </Field>
          <Field label="Webinar show-ups (optional)">
            <input
              className="field-input"
              type="number"
              min="0"
              value={draft.webinarShowUpsActual}
              onChange={(e) => setField('webinarShowUpsActual', e.target.value)}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save metrics
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="field-label mb-1.5">{label}</div>
      {children}
    </label>
  );
}
