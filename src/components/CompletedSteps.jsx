import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import { formatCurrency, formatDateShort, formatNumber } from '../lib/format.js';

export default function CompletedSteps() {
  const { completedTasksInCurrentPhase, tasksByPhase, currentPhase, uncompleteTask } = useLaunch();

  if (completedTasksInCurrentPhase.length === 0) return null;

  // Position within the current phase (1-indexed) for the label. The phase's
  // task list is already sorted by order, so the local step number matches
  // what the StepCard shows ("Step 5 of 9 · PLAN").
  const phaseTasks = tasksByPhase[currentPhase.id] ?? [];
  const localStepNumber = (taskId) => phaseTasks.findIndex((p) => p.id === taskId) + 1;

  return (
    <div className="space-y-2">
      {completedTasksInCurrentPhase.map((t) => {
        const config = getTaskConfig(t.id);
        const stepNum = localStepNumber(t.id);
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
                Step {stepNum} · {t.process}
              </div>
              <div
                className="font-semibold text-brand-navy mt-0.5"
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
              >
                {t.title}
              </div>
              <div
                className="text-sm text-brand-navy/70 mt-0.5"
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
              >
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
