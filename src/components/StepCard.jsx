import { useEffect, useState } from 'react';
import { useLaunch } from '../state/LaunchContext.jsx';
import { getTaskConfig } from '../data/mbymiTaskConfig.js';
import DebriefStepCard from './DebriefStepCard.jsx';

export default function StepCard() {
  const {
    currentTask,
    currentPhase,
    phaseStepIndex,
    phaseStats,
    completeTask,
    completeLesson,
    goToPhase,
    phases,
    openBot,
    openMetricsDrawer,
    tasks: allTasks,
  } = useLaunch();

  if (!currentTask) {
    const phaseIdx = phases.findIndex((p) => p.id === currentPhase.id);
    const nextPhase = phases[phaseIdx + 1];
    return (
      <div className="card" style={{ background: '#83CCBD', color: '#1D203F' }}>
        <div className="chip bg-brand-navy text-white mb-3">Phase complete</div>
        <h2 className="font-display tracking-wide" style={{ fontSize: '2rem', lineHeight: 1.1 }}>
          {currentPhase.label} is done. Nice work.
        </h2>
        <p className="mt-2 text-brand-navy/80 max-w-xl">{currentPhase.blurb}</p>
        {nextPhase ? (
          <button className="btn-dark mt-5" onClick={() => goToPhase(nextPhase.id)}>
            Start phase {phaseIdx + 2} · {nextPhase.label} →
          </button>
        ) : (
          <p className="mt-5 font-semibold">All six phases complete — launch is fully scoped.</p>
        )}
      </div>
    );
  }

  const currentTaskConfig = getTaskConfig(currentTask.id);
  if (currentTaskConfig.inputType === 'debrief') {
    return <DebriefStepCard task={currentTask} phase={currentPhase} phaseStepIndex={phaseStepIndex} phaseStats={phaseStats} />;
  }

  return (
    <ActiveStep
      task={currentTask}
      phase={currentPhase}
      phaseStepIndex={phaseStepIndex}
      phaseStats={phaseStats}
      onComplete={completeTask}
      onCompleteLesson={completeLesson}
      onOpenBot={openBot}
      onOpenMetrics={openMetricsDrawer}
      allTasks={allTasks}
    />
  );
}

function ActiveStep({
  task,
  phase,
  phaseStepIndex,
  phaseStats,
  onComplete,
  onCompleteLesson,
  onOpenBot,
  onOpenMetrics,
  allTasks,
}) {
  const config = getTaskConfig(task.id);
  const stats = phaseStats[phase.id];

  // Local draft state — only commits to context when user clicks Continue.
  // We key by task.id so switching tasks resets the draft cleanly.
  const [draft, setDraft] = useState(() => seedDraft(task, config, allTasks));
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    setDraft(seedDraft(task, config, allTasks));
    setShowExample(false);
    // We deliberately don't depend on allTasks — only re-seed on task switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  const valid = validate(draft, config);

  function handleContinue() {
    if (!valid) return;
    if (config.inputType === 'lesson' && Array.isArray(config.subTasks)) {
      // Compound lesson: fan answers out to each embedded sub-task. Numbers
      // get cast; dates stay as YYYY-MM-DD strings (or empty/null).
      const subTaskAnswers = {};
      config.subTasks.forEach((sub) => {
        const raw = draft.subTasks?.[sub.id];
        if (sub.inputType === 'number') {
          subTaskAnswers[sub.id] = Number(raw) || 0;
        } else {
          // date / url / text → store the trimmed string (or null when empty)
          const v = (raw ?? '').trim();
          subTaskAnswers[sub.id] = v || null;
        }
      });
      onCompleteLesson(task.id, subTaskAnswers);
      return;
    }
    const answer = serializeAnswer(draft, config);
    onComplete(task.id, answer);
  }

  return (
    <div className="card" style={{ background: '#1D203F', color: '#fff' }}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {config.inputType === 'lesson' ? (
          // Lessons just show the phase. The "Step X of Y" + process-group
          // chips would feel redundant on a teaching screen where there's no
          // task input.
          <span className="chip bg-brand-pink text-white">{phase.label}</span>
        ) : (
          <>
            <span className="chip bg-brand-pink text-white">
              Step {phaseStepIndex} of {stats.total} · {phase.label}
            </span>
            <span className="chip bg-white/10 text-white">{task.process}</span>
          </>
        )}
      </div>

      <h2
        className="font-display tracking-wide"
        style={{ fontSize: '1.85rem', lineHeight: 1.15, overflowWrap: 'anywhere', wordBreak: 'break-word' }}
      >
        {task.title}
      </h2>
      {config.helper && (
        <p
          className="mt-2 text-white/70 text-sm max-w-2xl"
          style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        >
          {config.helper}
        </p>
      )}
      {config.inputType !== 'lesson' && config.videoUrl && (
        <div className="mt-3">
          <TrainingVideoLink url={config.videoUrl} />
        </div>
      )}

      {config.inputType === 'lesson' ? (
        <LessonBody config={config} draft={draft} setDraft={setDraft} />
      ) : (
        <div className="mt-5 max-w-2xl">
          <StepInput config={config} draft={draft} setDraft={setDraft} task={task} />
        </div>
      )}

      {config.promptMetricsUpdate && (
        <div
          className="mt-4 max-w-2xl flex items-start gap-3 px-3 py-2.5"
          style={{
            background: 'rgba(248,154,42,0.12)',
            border: '1px solid rgba(248,154,42,0.4)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>📊</span>
          <div className="flex-1 text-sm text-white">
            <span className="font-semibold">Good moment to check your metrics.</span>{' '}
            <span className="text-white/75">
              After this step you'll have fresh numbers to log — open the metrics drawer to see how
              you're tracking vs goal.
            </span>
          </div>
          <button
            onClick={onOpenMetrics}
            className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wider"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              background: '#F89A2A',
              color: '#1D203F',
            }}
          >
            Update metrics →
          </button>
        </div>
      )}

      {config.example && (
        <div className="mt-4 max-w-2xl">
          <button
            type="button"
            onClick={() => setShowExample((v) => !v)}
            className="text-xs font-semibold uppercase tracking-wider text-brand-pink"
          >
            {showExample ? '▾ Hide example' : '▸ See an example'}
          </button>
          {showExample && (
            <div
              className="mt-2 rounded-[var(--radius-md)] px-4 py-3 text-sm whitespace-pre-line"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)' }}
            >
              {config.example}
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3 flex-wrap">
        <button
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleContinue}
          disabled={!valid}
        >
          {config.inputType === 'acknowledge' || config.inputType === 'lesson'
            ? 'Mark complete →'
            : 'Continue →'}
        </button>

        {config.aiBot && (
          <button
            type="button"
            onClick={() => onOpenBot(task.id)}
            className="inline-flex items-center gap-2 font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5"
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              background: '#F89A2A',
              color: '#1D203F',
              border: 'none',
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
              boxShadow: '0 6px 18px rgba(248,154,42,0.30)',
            }}
            title={`Open ${config.aiBot.name}`}
          >
            <span style={{ fontSize: '1rem' }}>🤖</span> AI Assist
          </button>
        )}

        <span className="text-xs text-white/50 ml-auto">
          {config.inputType === 'text' && config.minChars
            ? `${draftCharCount(draft)}/${config.minChars} chars`
            : ''}
        </span>
      </div>
    </div>
  );
}

/* ---------- Training video link --------------------------------------- */

function TrainingVideoLink({ url }) {
  // Render nothing when no URL is configured — the placeholder was distracting.
  // Real videos slot in via the `videoUrl` field in mbymiTaskConfig.js.
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-brand-pink transition-colors"
      style={{
        background: 'rgba(255,255,255,0.10)',
        padding: '6px 12px',
        borderRadius: 999,
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: '0.95rem' }}>📹</span>
      Watch the training
    </a>
  );
}

/* ---------- Lesson body (video + bonus block) ------------------------- */

function LessonBody({ config, draft, setDraft }) {
  // `body` accepts a single string OR an array of paragraphs.
  const bodyParagraphs = Array.isArray(config.body)
    ? config.body
    : config.body
      ? [config.body]
      : [];

  function setSubTaskValue(id, value) {
    setDraft({
      ...draft,
      subTasks: { ...(draft?.subTasks ?? {}), [id]: value },
    });
  }

  return (
    <div className="mt-5 max-w-2xl">
      {config.intro && (
        <p
          className="font-semibold text-white"
          style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        >
          {config.intro}
        </p>
      )}

      {config.videoUrl && (
        <div className="mt-3" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={youtubeEmbedUrl(config.videoUrl)}
            title="Training video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
              borderRadius: 'var(--radius-md)',
              background: '#000',
            }}
          />
        </div>
      )}

      {bodyParagraphs.length > 0 && (
        <div className="mt-4 space-y-3">
          {bodyParagraphs.map((p, i) => {
            // A `{ subtasks: true }` block in the body inserts the input
            // fields at that exact position — lets lessons interleave teaching
            // copy → inputs → more copy.
            if (p && typeof p === 'object' && p.subtasks === true) {
              return (
                <SubTaskInputs
                  key={`subtasks-${i}`}
                  config={config}
                  draft={draft}
                  onChange={setSubTaskValue}
                />
              );
            }
            return <LessonBodyBlock key={i} block={p} />;
          })}
        </div>
      )}

      {/* Embedded sub-tasks at the end (only when the body didn't already
          place them via a `{ subtasks: true }` marker). */}
      {Array.isArray(config.subTasks) &&
        config.subTasks.length > 0 &&
        !hasInlineSubtaskMarker(bodyParagraphs) && (
          <SubTaskInputs config={config} draft={draft} onChange={setSubTaskValue} />
        )}

      {Array.isArray(config.resources) && config.resources.length > 0 && (
        <div className="mt-4 space-y-3">
          {config.resources.map((r, i) => (
            <p
              key={i}
              className="text-white/85"
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.5,
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
              }}
            >
              {r.label}{' '}
              <a
                href={r.linkUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-bold hover:underline"
                style={{ color: '#83CCBD', textDecoration: 'underline' }}
              >
                {r.linkText ?? 'HERE'}
              </a>
              {r.trailing ?? ''}
            </p>
          ))}
        </div>
      )}

      {config.bonus && (
        <div className="mt-5">
          <div
            className="font-bold text-white"
            style={{ fontSize: '1rem', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
          >
            {config.bonus.title}
          </div>
          {config.bonus.body && (
            <p
              className="mt-1 text-sm text-white/85"
              style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
            >
              {config.bonus.body}
            </p>
          )}
          {config.bonus.linkUrl && (
            <a
              href={config.bonus.linkUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-block text-sm font-semibold hover:underline"
              style={{ color: '#83CCBD', overflowWrap: 'anywhere', wordBreak: 'break-all' }}
            >
              {config.bonus.linkUrl}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// Renders one body block inside a lesson card. Supports these shapes:
//   - string                      → plain paragraph
//   - { bold: 'X', text: '…' }    → paragraph with a bold lead-in span
//   - { parts: [...] }            → paragraph with inline hyperlinked spans
//   - { image: url|'', alt: '…' } → image (empty `image` → dashed placeholder)
//   - { video: 'youtube url' }    → inline embedded YouTube video (16:9)
//   - { bullet: '…', link?: 'url' } → bulleted list item (optional hyperlink)
function LessonBodyBlock({ block }) {
  const baseParaStyle = {
    fontSize: '0.95rem',
    lineHeight: 1.5,
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  };

  if (typeof block === 'string') {
    return (
      <p className="text-white/85" style={baseParaStyle}>
        {block}
      </p>
    );
  }
  if (block && typeof block === 'object') {
    if (Array.isArray(block.parts)) {
      // Paragraph with mixed plain-text and hyperlinked spans inline.
      return (
        <p className="text-white/85" style={baseParaStyle}>
          {block.parts.map((part, i) => {
            if (part && typeof part === 'object' && part.link) {
              return (
                <a
                  key={i}
                  href={part.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-bold hover:underline"
                  style={{ color: '#83CCBD', textDecoration: 'underline' }}
                >
                  {part.text}
                </a>
              );
            }
            return <span key={i}>{part?.text ?? ''}</span>;
          })}
        </p>
      );
    }
    if (typeof block.video === 'string') {
      // Inline embedded YouTube video (same 16:9 frame as the top-of-card
      // videoUrl, but placed wherever it sits in the body).
      return (
        <div className="my-2" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={youtubeEmbedUrl(block.video)}
            title="Embedded video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
              borderRadius: 'var(--radius-md)',
              background: '#000',
            }}
          />
        </div>
      );
    }
    if (typeof block.bullet === 'string') {
      // Bulleted list item — • marker with a hanging indent so wrapped lines
      // stay aligned under the text. An optional `link` turns the item text
      // into a hyperlink (used for the video-tutorial lists).
      return (
        <p className="text-white/85 flex gap-2" style={baseParaStyle}>
          <span aria-hidden="true" className="text-white/60">•</span>
          {block.link ? (
            <a
              href={block.link}
              target="_blank"
              rel="noreferrer noopener"
              className="font-bold hover:underline"
              style={{ color: '#83CCBD', textDecoration: 'underline' }}
            >
              {block.bullet}
            </a>
          ) : (
            <span>{block.bullet}</span>
          )}
        </p>
      );
    }
    if (typeof block.image !== 'undefined') {
      if (block.image) {
        return (
          <div className="my-2">
            <img
              src={block.image}
              alt={block.alt ?? ''}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: 'var(--radius-md)',
                background: '#fff',
              }}
            />
          </div>
        );
      }
      // Placeholder when no image URL is configured yet.
      return (
        <div
          className="my-2 text-center text-white/65"
          style={{
            border: '1px dashed rgba(255,255,255,0.40)',
            borderRadius: 'var(--radius-md)',
            padding: '28px 16px',
            background: 'rgba(255,255,255,0.04)',
            fontStyle: 'italic',
            fontSize: '0.85rem',
          }}
        >
          🗺️  {block.alt || 'Image coming soon'}
        </div>
      );
    }
    if (typeof block.bold === 'string') {
      return (
        <p className="text-white/85" style={baseParaStyle}>
          <span className="font-bold text-white">{block.bold}</span>
          {block.text ?? ''}
        </p>
      );
    }
  }
  return null;
}

// Renders the whole sub-task block — heading + labeled inputs. Used both
// at the end of a lesson (default) and inline when the body has a
// `{ subtasks: true }` marker.
function SubTaskInputs({ config, draft, onChange }) {
  if (!Array.isArray(config.subTasks) || config.subTasks.length === 0) return null;
  return (
    <div className="mt-5">
      {config.inputsHeading && (
        <div
          className="font-bold text-white mb-3"
          style={{ fontSize: '1rem', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        >
          {config.inputsHeading}
        </div>
      )}
      <div className="space-y-4">
        {config.subTasks.map((sub) => (
          <div key={sub.id}>
            <label
              className="block font-bold text-white mb-1.5"
              style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
            >
              {sub.label}
            </label>
            <SubTaskInput
              sub={sub}
              value={draft?.subTasks?.[sub.id] ?? ''}
              onChange={(v) => onChange(sub.id, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function hasInlineSubtaskMarker(bodyBlocks) {
  return (
    Array.isArray(bodyBlocks) &&
    bodyBlocks.some((b) => b && typeof b === 'object' && b.subtasks === true)
  );
}

// Single input field for a sub-task. Handles number (with $ prefix / unit
// suffix), date, and url/text types. All inputs share the dark lesson-card
// styling.
function SubTaskInput({ sub, value, onChange }) {
  const baseInputStyle = {
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
  };
  const baseInputClass =
    'w-full bg-white/10 text-white placeholder-white/40 text-base outline-none transition focus:bg-white/15';

  if (sub.inputType === 'textarea') {
    return (
      <textarea
        rows={sub.rows ?? 6}
        value={value}
        placeholder={sub.placeholder ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClass}
        style={{ ...baseInputStyle, resize: 'vertical', minHeight: 120 }}
      />
    );
  }

  if (sub.inputType === 'url' || sub.inputType === 'text') {
    return (
      <input
        type={sub.inputType === 'url' ? 'url' : 'text'}
        value={value}
        placeholder={sub.placeholder ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClass}
        style={baseInputStyle}
      />
    );
  }

  if (sub.inputType === 'date') {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClass}
        style={baseInputStyle}
      />
    );
  }

  // Default: number input with optional prefix/unit affordances.
  return (
    <div className="flex items-center gap-2">
      {sub.prefix && (
        <span
          className="font-display text-xl"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          {sub.prefix}
        </span>
      )}
      <input
        type="number"
        inputMode="numeric"
        min="0"
        value={value}
        placeholder={sub.placeholder ?? '0'}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClass}
        style={baseInputStyle}
      />
      {sub.unit && (
        <span className="text-sm uppercase tracking-wider text-white/60">{sub.unit}</span>
      )}
    </div>
  );
}

// Convert a watch-style YouTube URL to its /embed/ form, preserving start time.
function youtubeEmbedUrl(url) {
  if (typeof url !== 'string') return '';
  try {
    const u = new URL(url);
    // Already an embed URL — pass through.
    if (u.pathname.startsWith('/embed/')) return url;
    const id =
      u.searchParams.get('v') ||
      (u.hostname.includes('youtu.be') ? u.pathname.slice(1) : '');
    if (!id) return url;
    const t = u.searchParams.get('t') || u.searchParams.get('start');
    // Parse "2s" / "1m30s" / "90" into raw seconds for the embed param.
    let start = 0;
    if (t) {
      if (/^\d+$/.test(t)) start = Number(t);
      else {
        const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/);
        if (m) start = (Number(m[1]) || 0) * 3600 + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0);
      }
    }
    const query = start ? `?start=${start}&rel=0` : '?rel=0';
    return `https://www.youtube.com/embed/${id}${query}`;
  } catch {
    return url;
  }
}

/* ---------- input renderers per type ----------------------------------- */

function StepInput({ config, draft, setDraft }) {
  const baseInput = {
    className:
      'w-full bg-white/10 text-white placeholder-white/40 text-base outline-none transition focus:bg-white/15',
    style: {
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      // Long unbroken text (e.g. a pasted URL) was visually escaping the box.
      overflowWrap: 'anywhere',
      wordBreak: 'break-word',
    },
  };

  switch (config.inputType) {
    case 'text':
      return (
        <textarea
          {...baseInput}
          rows={Math.max(4, Math.min(10, Math.ceil((config.minChars ?? 60) / 18)))}
          placeholder={config.placeholder ?? 'Type your answer…'}
          value={draft.text ?? ''}
          onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          autoFocus
        />
      );

    case 'number':
      return (
        <div className="flex items-center gap-2">
          {config.prefix && (
            <span className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {config.prefix}
            </span>
          )}
          <input
            {...baseInput}
            type="number"
            inputMode="numeric"
            min="0"
            placeholder={config.placeholder ?? '0'}
            value={draft.number ?? ''}
            onChange={(e) => setDraft({ ...draft, number: e.target.value })}
            autoFocus
          />
          {config.unit && (
            <span className="text-sm uppercase tracking-wider text-white/60">{config.unit}</span>
          )}
        </div>
      );

    case 'date':
      return (
        <input
          {...baseInput}
          type="date"
          value={draft.date ?? ''}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
        />
      );

    case 'note':
      return (
        <input
          {...baseInput}
          type="text"
          placeholder={config.placeholder ?? 'Optional notes / URL'}
          value={draft.text ?? ''}
          onChange={(e) => setDraft({ ...draft, text: e.target.value })}
        />
      );

    case 'acknowledge':
    default:
      return (
        <div
          className="rounded-[var(--radius-md)] px-4 py-3 text-sm"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)' }}
        >
          External action — when you've done this in Kajabi / your tool / IRL, mark it complete to
          advance.
        </div>
      );
  }
}

/* ---------- helpers ---------------------------------------------------- */

function seedDraft(task, config, allTasks = []) {
  const answer = task.answer;
  switch (config.inputType) {
    case 'text':
    case 'note':
      return { text: typeof answer === 'string' ? answer : '' };
    case 'number':
      return { number: answer != null ? String(answer) : '' };
    case 'date':
      return { date: typeof answer === 'string' ? answer : '' };
    case 'lesson': {
      // Compound lessons read pre-existing sub-task answers off the live task
      // array so re-editing a completed lesson restores the inputs.
      if (!Array.isArray(config.subTasks)) return {};
      const subTaskValues = {};
      config.subTasks.forEach((sub) => {
        const t = allTasks.find((x) => x.id === sub.id);
        subTaskValues[sub.id] = t?.answer != null ? String(t.answer) : '';
      });
      return { subTasks: subTaskValues };
    }
    default:
      return {};
  }
}

function validate(draft, config) {
  switch (config.inputType) {
    case 'text':
      return (draft.text ?? '').trim().length >= (config.minChars ?? 1);
    case 'note':
      return true; // optional
    case 'number':
      return Number(draft.number) > 0;
    case 'date':
      return true; // optional
    case 'lesson': {
      // Compound lessons require every NUMBER sub-task to be > 0. Date sub-
      // tasks are optional (consistent with how standalone date inputs work).
      // Pure (no sub-task) lessons need no validation — just acknowledge.
      if (!Array.isArray(config.subTasks) || config.subTasks.length === 0) return true;
      return config.subTasks.every((sub) => {
        if (sub.optional) return true; // optional input — never gates completion
        if (sub.inputType === 'date') return true; // optional
        if (sub.inputType === 'number') return Number(draft.subTasks?.[sub.id]) > 0;
        // url / text / textarea → required; gates Mark complete (optional minChars).
        return (draft.subTasks?.[sub.id] ?? '').trim().length >= (sub.minChars ?? 1);
      });
    }
    case 'acknowledge':
    default:
      return true;
  }
}

function serializeAnswer(draft, config) {
  switch (config.inputType) {
    case 'text':
    case 'note':
      return (draft.text ?? '').trim() || null;
    case 'number':
      return Number(draft.number) || 0;
    case 'date':
      return draft.date || null;
    case 'lesson':
    case 'acknowledge':
    default:
      return null;
  }
}

function draftCharCount(draft) {
  return (draft.text ?? '').trim().length;
}
