import { useEffect } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import CenteredOverlay from './CenteredOverlay.jsx';

/**
 * Bot modal. Positioned at the TOP of the iframe (not the geometric center)
 * because the iframe is auto-grown to fit content — its "center" is often
 * deep inside Kajabi's scroll position and would render offscreen.
 *
 * On open we also post a message to the Kajabi parent asking it to scroll
 * the iframe to the top of the viewport, so the user lands right on the
 * modal.
 */
export default function AIBotModal() {
  const { openBotForTaskId, closeBot, tasks } = useLaunch();

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

  return (
    <CenteredOverlay onClose={closeBot} width="min(900px, calc(100% - 32px))" zIndex={50}>
      <div
        style={{
          height: 'min(700px, 82vh)',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 60px rgba(29,32,63,0.30)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
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

        {/* Body */}
        <div className="flex-1 min-h-0" style={{ background: '#F4F2F2' }}>
          {bot.url ? (
            <iframe
              src={bot.url}
              title={bot.name}
              style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
              allow="clipboard-read; clipboard-write"
            />
          ) : (
            <PlaceholderBot botName={bot.name} taskTitle={task.title} />
          )}
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-between gap-3 flex-wrap"
          style={{
            padding: '12px 18px',
            background: '#fff',
            borderTop: '1px solid rgba(29,32,63,0.08)',
          }}
        >
          <div className="text-xs text-brand-navy/70 font-semibold">
            ✍️ Don't forget to copy &amp; paste the bot's answer back into your step.
          </div>
          <button onClick={closeBot} className="btn-primary">
            Close
          </button>
        </footer>
      </div>
    </CenteredOverlay>
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
