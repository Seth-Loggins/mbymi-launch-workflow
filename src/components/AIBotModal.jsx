import { useEffect } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';

export default function AIBotModal() {
  const { openBotForTaskId, closeBot, tasks, completeTask } = useLaunch();

  // Esc closes the modal.
  useEffect(() => {
    if (!openBotForTaskId) return;
    function onKey(e) {
      if (e.key === 'Escape') closeBot();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openBotForTaskId, closeBot]);

  if (!openBotForTaskId) return null;

  const task = tasks.find((t) => t.id === openBotForTaskId);
  if (!task) return null;
  const config = getTaskConfig(task.id);
  const bot = config.aiBot;
  if (!bot) return null;

  function handleComplete() {
    // Mark the underlying task complete; bot closes via state change.
    completeTask(task.id, task.answer);
    closeBot();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(29,32,63,0.55)', padding: 20 }}
      onMouseDown={closeBot}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="flex flex-col"
        style={{
          width: 'min(900px, 96vw)',
          height: 'min(720px, 92vh)',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 60px rgba(29,32,63,0.30)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <header
          className="flex items-center justify-between gap-4"
          style={{ padding: '14px 18px', background: '#1D203F', color: '#fff' }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="chip bg-brand-pink text-white">🤖 AI Assist</span>
              <span className="text-[0.65rem] uppercase tracking-wider text-white/60">
                {task.process}
              </span>
            </div>
            <div className="font-display text-xl truncate" title={task.title}>
              {bot.name}
            </div>
            <div className="text-xs text-white/70 truncate">For: {task.title}</div>
          </div>
          <button
            onClick={closeBot}
            className="shrink-0 text-white/70 hover:text-white"
            style={{ fontSize: '1.4rem', padding: '4px 10px' }}
            title="Close (Esc)"
          >
            ✕
          </button>
        </header>

        {/* Body — Mindpal embed slot */}
        <div className="flex-1 overflow-hidden" style={{ background: '#F4F2F2' }}>
          {bot.url ? (
            <iframe
              src={bot.url}
              title={bot.name}
              style={{ width: '100%', height: '100%', border: 0 }}
              allow="clipboard-read; clipboard-write"
            />
          ) : (
            <PlaceholderBot botName={bot.name} taskTitle={task.title} />
          )}
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-between gap-3"
          style={{
            padding: '12px 18px',
            background: '#fff',
            borderTop: '1px solid rgba(29,32,63,0.08)',
          }}
        >
          <div className="text-xs text-brand-navy/55">
            Tip: paste your final draft back into the step before marking it complete.
          </div>
          <div className="flex items-center gap-2">
            <button onClick={closeBot} className="btn-ghost">
              Close
            </button>
            <button onClick={handleComplete} className="btn-primary">
              Mark task complete →
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function PlaceholderBot({ botName, taskTitle }) {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div
        className="max-w-md text-center"
        style={{
          background: '#fff',
          border: '1px dashed rgba(29,32,63,0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 28px',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🤖</div>
        <div className="font-display text-2xl text-brand-navy mb-1">{botName}</div>
        <div className="text-sm text-brand-navy/70 mb-4">
          The Mindpal embed for <span className="font-semibold">{taskTitle}</span> will live here.
        </div>
        <div
          className="text-xs text-brand-navy/55 text-left"
          style={{
            background: 'rgba(29,32,63,0.04)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
          }}
        >
          To wire up the real bot, paste the Mindpal embed URL into{' '}
          <code className="font-mono text-brand-pink">aiBot.url</code> for this task in{' '}
          <code className="font-mono">src/data/mbymiTaskConfig.js</code>.
        </div>
      </div>
    </div>
  );
}
