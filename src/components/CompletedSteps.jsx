import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import { formatCurrency, formatDateShort, formatNumber } from '../lib/format.js';

export default function CompletedSteps() {
  const { completedTasksInCurrentPhase, uncompleteTask } = useLaunch();

  if (completedTasksInCurrentPhase.length === 0) return null;

  return (
    <div className="space-y-2">
      {completedTasksInCurrentPhase.map((t) => {
        const config = getTaskConfig(t.id);
        return (
          <div
            key={t.id}
            className="flex items-start gap-3 px-4 py-3"
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(131,204,189,0.4)',
              boxShadow: '0 1px 2px rgba(29,32,63,0.04)',
            }}
          >
            <span
              className="shrink-0 inline-flex items-center justify-center font-bold"
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: '#83CCBD',
                color: '#1D203F',
                fontSize: '0.75rem',
                marginTop: 2,
              }}
            >
              ✓
            </span>

            <div className="flex-1 min-w-0">
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-navy/60">
                Step · {t.process}
              </div>
              <div className="font-semibold text-brand-navy mt-0.5 truncate">{t.title}</div>
              <div className="text-sm text-brand-navy/70 mt-0.5">
                {formatAnswerSummary(t, config)}
              </div>
            </div>

            <button
              onClick={() => uncompleteTask(t.id)}
              title="Edit this step"
              className="shrink-0 text-brand-navy/40 hover:text-brand-pink transition-colors"
              style={{ fontSize: '1rem' }}
            >
              ✎
            </button>
          </div>
        );
      })}
    </div>
  );
}

function formatAnswerSummary(task, config) {
  const ans = task.answer;
  switch (config.inputType) {
    case 'text':
    case 'note':
      if (!ans) return '— no notes —';
      return ans.length > 110 ? `${ans.slice(0, 110)}…` : ans;
    case 'number':
      if (!ans) return '—';
      if (config.prefix === '$') return formatCurrency(ans);
      return `${formatNumber(ans)}${config.unit ? ` ${config.unit}` : ''}`;
    case 'date':
      return ans ? formatDateShort(ans) : '— no date set —';
    case 'acknowledge':
    default:
      return 'Marked complete';
  }
}
