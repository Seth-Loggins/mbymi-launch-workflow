import { useEffect, useMemo } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import { scrollIframeIntoView } from '../lib/iframeBridge.js';

/**
 * Centralised AI bot directory. Pulls every aiBot config from every task,
 * groups by bot name (so e.g. "Email Bot" appears once with all the steps
 * that use it), and lets the user open any bot at any time without having
 * to navigate to the matching step first.
 */
export default function AILibraryDrawer() {
  const { aiLibraryOpen, closeAILibrary, tasks, openBot, goToPhase, phases } = useLaunch();

  useEffect(() => {
    if (!aiLibraryOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') closeAILibrary();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aiLibraryOpen, closeAILibrary]);

  useEffect(() => {
    if (aiLibraryOpen) scrollIframeIntoView();
  }, [aiLibraryOpen]);

  const bots = useMemo(() => {
    const byName = new Map();
    tasks.forEach((t) => {
      const cfg = getTaskConfig(t.id);
      if (!cfg.aiBot) return;
      const key = cfg.aiBot.name;
      if (!byName.has(key)) {
        byName.set(key, {
          name: cfg.aiBot.name,
          url: cfg.aiBot.url || '',
          tasks: [],
        });
      }
      byName.get(key).tasks.push({
        id: t.id,
        title: t.title,
        process: t.process,
        done: t.done,
      });
    });
    return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks]);

  if (!aiLibraryOpen) return null;

  function openBotByName(bot) {
    // Use the first task that references this bot as the "host" context for
    // the modal. If the user marks complete from the modal, it'll complete
    // that specific task — clear enough since they navigated here from the
    // library and the modal header shows the task title.
    const targetTask = bot.tasks[0];
    if (!targetTask) return;
    closeAILibrary();
    openBot(targetTask.id);
  }

  function jumpToStep(t) {
    const phase = phases.find((p) => p.groups.includes(t.process));
    if (phase) goToPhase(phase.id);
    closeAILibrary();
  }

  return (
    <>
      <div
        onMouseDown={closeAILibrary}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(29,32,63,0.45)',
          zIndex: 40,
        }}
      />
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="overflow-y-auto"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100vh',
          width: 'min(640px, 96vw)',
          background: '#F4F2F2',
          boxShadow: '-12px 0 32px rgba(29,32,63,0.20)',
          padding: '20px 24px 32px',
          zIndex: 41,
        }}
      >
        <header className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink">
              AI Hub
            </div>
            <h2 className="font-display text-2xl text-brand-navy">All your launch bots</h2>
          </div>
          <button
            type="button"
            onClick={closeAILibrary}
            className="text-brand-navy/50 hover:text-brand-navy"
            style={{ padding: '6px 10px', fontSize: '1.1rem' }}
            title="Close (Esc)"
          >
            ✕
          </button>
        </header>

        <p className="text-sm text-brand-navy/70 mb-5">
          Every Mindpal bot wired into the workflow, in one place. Click a bot to open it — you can
          come back to the matching step afterwards. {bots.length} bot{bots.length === 1 ? '' : 's'}{' '}
          available.
        </p>

        {bots.length === 0 && (
          <div className="text-sm text-brand-navy/55 italic">
            No bots configured yet.
          </div>
        )}

        <ul className="space-y-3">
          {bots.map((bot) => (
            <li
              key={bot.name}
              className="p-4"
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(29,32,63,0.10)',
                boxShadow: '0 1px 2px rgba(29,32,63,0.04)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: '1.1rem' }}>🤖</span>
                    <h3 className="font-display text-lg text-brand-navy">{bot.name}</h3>
                    {!bot.url && (
                      <span className="chip bg-brand-navy/10 text-brand-navy">URL pending</span>
                    )}
                  </div>
                  <div className="text-xs text-brand-navy/55">
                    Used by {bot.tasks.length} step{bot.tasks.length === 1 ? '' : 's'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openBotByName(bot)}
                  className="shrink-0 inline-flex items-center gap-2 font-bold uppercase tracking-wider"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: '#F89A2A',
                    color: '#1D203F',
                    border: 'none',
                    fontSize: '0.72rem',
                    letterSpacing: '0.06em',
                    boxShadow: '0 4px 12px rgba(248,154,42,0.30)',
                  }}
                >
                  🤖 Open bot
                </button>
              </div>

              <ul className="mt-3 space-y-1">
                {bot.tasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <span
                      className="shrink-0 inline-flex items-center justify-center font-bold"
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        background: t.done ? '#83CCBD' : 'rgba(29,32,63,0.08)',
                        color: '#1D203F',
                        fontSize: '0.65rem',
                      }}
                    >
                      {t.done ? '✓' : '·'}
                    </span>
                    <span
                      className="flex-1 truncate text-brand-navy/85"
                      style={t.done ? { textDecoration: 'line-through', opacity: 0.6 } : undefined}
                    >
                      {t.title}
                    </span>
                    <span className="shrink-0 text-[0.65rem] uppercase tracking-wider text-brand-navy/45">
                      {t.process}
                    </span>
                    <button
                      type="button"
                      onClick={() => jumpToStep(t)}
                      className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-pink hover:underline"
                      title="Go to this step"
                    >
                      Go →
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
