import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { mbymiProcessOrder, mbymiTasks } from '../data/mbymiLaunch.js';
import { mbymiPhases, processToPhase } from '../data/mbymiPhases.js';

// Best-effort persistence of the in-progress launch to localStorage so a user
// can stop mid-way and pick up where they left off. Wrapped in try/catch
// because a cross-origin iframe (e.g. embedded in Kajabi) may block storage —
// in that case it silently degrades to in-memory only.
const STORAGE_KEY = 'mbymi-launch-execution-experience-v1';

function loadPersisted() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePersisted(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage blocked / full — degrade to in-memory */
  }
}

const LaunchContext = createContext(null);

const EMPTY_LAUNCH = {
  offerName: '',
  dates: {
    listBuildingStart: '',
    webinarDay: '',
    closeDay: '',
  },
};

const EMPTY_METRICS = {
  revenueActual: 0,
  membersEnrolledActual: 0,
  waitlistSignupsActual: 0,
  webinarShowUpsActual: 0,
};

// The full structured debrief — every section the screenshot showed.
function newDebriefDraft() {
  return {
    launchDetails: {
      campaignName: '',
      campaignStartDate: '',
      promotionType: '',
      audienceSegment: '',
    },
    offers: [newOffer()],
    listAudience: {
      totalRegistrants: '',
      listSizeAtStart: '',
      listSizeToday: '',
      paidPercent: '',
      organicPercent: '',
      partnerPercent: '',
      totalAdSpend: '',
      costPerLead: '',
    },
    registrationAttendance: {
      landingPages: [],
      liveAttendees: '',
      replayViews: '',
      avgWatchTime: '',
    },
    emailPerformance: {
      totalEmailsSent: '',
      bestSubject: '',
      bestOpenRate: '',
      worstSubject: '',
      worstOpenRate: '',
    },
    salesConversions: {
      salesPageVisitors: '',
      checkoutPageVisitors: '',
      orderBumpRate: '',
      upsellConversion: '',
      downsellConversion: '',
    },
    lessonsLearned: {
      whatWorked: '',
      whatDidntWork: '',
      biggestSurprise: '',
      customerFeedback: '',
      techIssues: '',
      teamCapacity: '',
      whatToTest: '',
    },
  };
}

function newOffer() {
  return {
    id: cryptoId(),
    offerName: '',
    paymentStructure: 'One-Time',
    offerPrice: '',
    unitsSold: '',
  };
}

function newLandingPage() {
  return { id: cryptoId(), label: '', url: '' };
}

function cryptoId() {
  // Cheap unique id (good enough for client-side keys).
  return `id-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

// Backward-compat: older saved snapshots stored full task objects. Reduce one
// to the progress-map shape we persist now ({ [id]: { done, answer } }).
function progressFromTasks(taskList) {
  const p = {};
  (taskList ?? []).forEach((t) => {
    p[t.id] = { done: !!t.done, answer: t.answer ?? null };
  });
  return p;
}

const FIRST_PHASE_ID = mbymiPhases[0].id;

export function LaunchProvider({ children }) {
  // Read any persisted launch ONCE on mount, then seed state from it so the
  // user resumes exactly where they left off.
  const [persisted] = useState(loadPersisted);

  const [launch, setLaunch] = useState(() => persisted.launch ?? EMPTY_LAUNCH);
  // Progress is the ONLY task state we persist: { [id]: { done, answer } }.
  // The full task list is DERIVED from the code (mbymiTasks) on every render,
  // so titles + structure are always current — editing a title or adding a
  // task shows up immediately, and even applies to previously saved launches
  // (which restore progress, not frozen task objects).
  const [progress, setProgress] = useState(() => persisted.progress ?? {});
  const tasks = mbymiTasks.map((t) => ({
    ...t,
    done: progress[t.id]?.done ?? false,
    answer: progress[t.id]?.answer ?? null,
  }));
  const [metrics, setMetrics] = useState(() => persisted.metrics ?? EMPTY_METRICS);
  const [currentPhaseId, setCurrentPhaseId] = useState(() => persisted.currentPhaseId ?? FIRST_PHASE_ID);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [livePanelView, setLivePanelView] = useState('playbook'); // 'playbook' | 'funnel' | 'links'
  const [openBotForTaskId, setOpenBotForTaskId] = useState(null);
  const [aiLibraryOpen, setAILibraryOpen] = useState(false);
  const [debriefDraft, setDebriefDraft] = useState(() => persisted.debriefDraft ?? newDebriefDraft());
  const [debriefHistory, setDebriefHistory] = useState(() => persisted.debriefHistory ?? []);
  const [workflowComplete, setWorkflowComplete] = useState(false);
  // gateStep: 'welcome' → 'name-launch' → 'workflow'. Resumes at 'workflow' if
  // the user had a launch in progress.
  const [gateStep, setGateStep] = useState(() => persisted.gateStep ?? 'welcome');
  const [savedWorkflows, setSavedWorkflows] = useState(() => persisted.savedWorkflows ?? []);
  const [savedWorkflowsOpen, setSavedWorkflowsOpen] = useState(false);
  // userMode is 'demo' | 'google' | null — set when the user picks an entry
  // point from the welcome modal. Currently informational only; later we'll
  // hang real Google OAuth off the 'google' branch.
  const [userMode, setUserMode] = useState(() => persisted.userMode ?? null);
  const [userName, setUserName] = useState(() => persisted.userName ?? '');
  // Timestamp of the last explicit "Save" — drives the Save button confirmation.
  const [lastSavedAt, setLastSavedAt] = useState(() => persisted.lastSavedAt ?? null);
  // Stable id for the active launch so a "Save" updates THIS launch's entry in
  // the Saved list instead of creating a duplicate every time.
  const [currentLaunchId, setCurrentLaunchId] = useState(() => persisted.currentLaunchId ?? null);

  // Auto-persist the in-progress launch whenever anything meaningful changes.
  useEffect(() => {
    savePersisted({
      launch,
      progress,
      metrics,
      currentPhaseId,
      debriefDraft,
      debriefHistory,
      savedWorkflows,
      gateStep,
      userMode,
      userName,
      lastSavedAt,
      currentLaunchId,
    });
  }, [
    launch,
    progress,
    metrics,
    currentPhaseId,
    debriefDraft,
    debriefHistory,
    savedWorkflows,
    gateStep,
    userMode,
    userName,
    lastSavedAt,
    currentLaunchId,
  ]);

  // Explicit save — stamps the time (auto-persist above flushes it to storage).
  const saveProgress = useCallback(() => {
    setLastSavedAt(new Date().toISOString());
  }, []);

  /* ---------- mutations ------------------------------------------------ */

  const setOfferName = useCallback((name) => {
    setLaunch((prev) => ({ ...prev, offerName: name }));
  }, []);

  const setDates = useCallback((patch) => {
    setLaunch((prev) => ({ ...prev, dates: { ...prev.dates, ...patch } }));
  }, []);

  const completeTask = useCallback((id, answer = null) => {
    setProgress((prev) => ({ ...prev, [id]: { done: true, answer } }));
  }, []);

  const uncompleteTask = useCallback((id) => {
    setProgress((prev) => ({
      ...prev,
      [id]: { done: false, answer: prev[id]?.answer ?? null },
    }));
  }, []);

  // Mark a compound lesson done AND fan out its sub-task answers to the
  // embedded tasks. `subTaskAnswers` is { [taskId]: value }.
  const completeLesson = useCallback((lessonId, subTaskAnswers = {}) => {
    setProgress((prev) => {
      const next = { ...prev, [lessonId]: { done: true, answer: null } };
      Object.entries(subTaskAnswers).forEach(([id, answer]) => {
        next[id] = { done: true, answer };
      });
      return next;
    });
  }, []);

  // Reverse of completeLesson — undo the parent + every embedded sub-task in
  // one pass so the user can edit the form again. Sub-task answers are kept
  // so they pre-fill when the lesson card re-renders.
  const uncompleteLesson = useCallback((lessonId, subTaskIds = []) => {
    setProgress((prev) => {
      const next = { ...prev };
      [lessonId, ...subTaskIds].forEach((id) => {
        next[id] = { done: false, answer: prev[id]?.answer ?? null };
      });
      return next;
    });
  }, []);

  const setTaskAnswer = useCallback((id, answer) => {
    setProgress((prev) => ({
      ...prev,
      [id]: { done: prev[id]?.done ?? false, answer },
    }));
  }, []);

  const updateMetrics = useCallback((patch) => {
    setMetrics((prev) => ({ ...prev, ...patch }));
  }, []);

  const goToPhase = useCallback((id) => {
    setCurrentPhaseId(id);
  }, []);

  const openMetricsDrawer = useCallback(() => setMetricsOpen(true), []);
  const closeMetricsDrawer = useCallback(() => setMetricsOpen(false), []);

  const openBot = useCallback((taskId) => setOpenBotForTaskId(taskId), []);
  const closeBot = useCallback(() => setOpenBotForTaskId(null), []);

  const openAILibrary = useCallback(() => setAILibraryOpen(true), []);
  const closeAILibrary = useCallback(() => setAILibraryOpen(false), []);

  /* ---- debrief actions ----------------------------------------------- */

  const setDebriefField = useCallback((section, field, value) => {
    setDebriefDraft((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  const setOfferField = useCallback((offerId, field, value) => {
    setDebriefDraft((prev) => ({
      ...prev,
      offers: prev.offers.map((o) => (o.id === offerId ? { ...o, [field]: value } : o)),
    }));
  }, []);

  const addOffer = useCallback(() => {
    setDebriefDraft((prev) => ({ ...prev, offers: [...prev.offers, newOffer()] }));
  }, []);

  const removeOffer = useCallback((offerId) => {
    setDebriefDraft((prev) => ({
      ...prev,
      offers: prev.offers.length <= 1 ? prev.offers : prev.offers.filter((o) => o.id !== offerId),
    }));
  }, []);

  const setLandingPageField = useCallback((pageId, field, value) => {
    setDebriefDraft((prev) => ({
      ...prev,
      registrationAttendance: {
        ...prev.registrationAttendance,
        landingPages: prev.registrationAttendance.landingPages.map((p) =>
          p.id === pageId ? { ...p, [field]: value } : p,
        ),
      },
    }));
  }, []);

  const addLandingPage = useCallback(() => {
    setDebriefDraft((prev) => ({
      ...prev,
      registrationAttendance: {
        ...prev.registrationAttendance,
        landingPages: [...prev.registrationAttendance.landingPages, newLandingPage()],
      },
    }));
  }, []);

  const removeLandingPage = useCallback((pageId) => {
    setDebriefDraft((prev) => ({
      ...prev,
      registrationAttendance: {
        ...prev.registrationAttendance,
        landingPages: prev.registrationAttendance.landingPages.filter((p) => p.id !== pageId),
      },
    }));
  }, []);

  const saveDebrief = useCallback(() => {
    const snapshot = JSON.parse(JSON.stringify(debriefDraft));
    const record = {
      id: cryptoId(),
      savedAt: new Date().toISOString(),
      data: snapshot,
    };
    setDebriefHistory((prev) => [record, ...prev]);
    // Mark the Launch Debrief task as complete (stash a "saved" marker as answer).
    setProgress((prev) => ({
      ...prev,
      'mbymi-15-1': { done: true, answer: 'debrief-saved' },
    }));
    // Flag workflow complete — triggers the celebration card.
    setWorkflowComplete(true);
    return record;
  }, [debriefDraft]);

  const dismissCelebration = useCallback(() => setWorkflowComplete(false), []);

  /* ---- debrief clear + history loading ------------------------------ */

  const clearDebriefDraft = useCallback(() => {
    setDebriefDraft(newDebriefDraft());
  }, []);

  const deleteDebriefHistoryEntry = useCallback((id) => {
    setDebriefHistory((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const loadDebriefFromHistory = useCallback(
    (id) => {
      const record = debriefHistory.find((r) => r.id === id);
      if (!record) return;
      // Deep clone to detach the draft from the history snapshot.
      const cloned = JSON.parse(JSON.stringify(record.data));
      // Refresh ids on offers + landing pages so React keys stay unique vs the
      // history record (otherwise editing the draft would also "move" entries
      // visually in the history list).
      cloned.offers = cloned.offers.map((o) => ({ ...o, id: cryptoId() }));
      cloned.registrationAttendance.landingPages =
        cloned.registrationAttendance.landingPages.map((p) => ({ ...p, id: cryptoId() }));
      setDebriefDraft(cloned);
    },
    [debriefHistory],
  );

  /* ---- intro flow ---------------------------------------------------- */

  const enterAsDemo = useCallback(() => {
    setUserMode('demo');
    setUserName('Demo user');
    setGateStep('name-launch');
  }, []);

  const enterAsGoogle = useCallback((name = '') => {
    // Stubbed for now — real OAuth wiring slots in here later.
    setUserMode('google');
    setUserName(name || 'Google user');
    setGateStep('name-launch');
  }, []);

  const finishNamingLaunch = useCallback(
    (name) => {
      if (typeof name === 'string') {
        setLaunch((prev) => ({ ...prev, offerName: name.trim() }));
      }
      // A brand-new launch gets a fresh id so its saves stay one entry.
      setCurrentLaunchId((prev) => prev ?? cryptoId());
      setGateStep('workflow');
    },
    [],
  );

  const reopenWelcome = useCallback(() => {
    setGateStep('welcome');
  }, []);

  /* ---- saved workflows ----------------------------------------------- */

  const openSavedWorkflows = useCallback(() => setSavedWorkflowsOpen(true), []);
  const closeSavedWorkflows = useCallback(() => setSavedWorkflowsOpen(false), []);

  const saveWorkflow = useCallback(() => {
    // Use the active launch's stable id as the snapshot id, so re-saving the
    // same launch UPDATES its entry rather than adding a duplicate.
    const id = currentLaunchId ?? cryptoId();
    if (!currentLaunchId) setCurrentLaunchId(id);
    const snapshot = {
      id,
      savedAt: new Date().toISOString(),
      launch: JSON.parse(JSON.stringify(launch)),
      progress: JSON.parse(JSON.stringify(progress)),
      metrics: JSON.parse(JSON.stringify(metrics)),
      debriefDraft: JSON.parse(JSON.stringify(debriefDraft)),
      debriefHistory: JSON.parse(JSON.stringify(debriefHistory)),
    };
    setSavedWorkflows((prev) => [snapshot, ...prev.filter((w) => w.id !== id)]);
    setLastSavedAt(snapshot.savedAt);
    return snapshot;
  }, [currentLaunchId, launch, progress, metrics, debriefDraft, debriefHistory]);

  const loadWorkflow = useCallback(
    (id) => {
      const snap = savedWorkflows.find((w) => w.id === id);
      if (!snap) return;
      setLaunch(JSON.parse(JSON.stringify(snap.launch)));
      // New snapshots store `progress`; older ones stored full `tasks` objects —
      // reduce those to progress so titles/structure come from current code.
      const restoredProgress = snap.progress
        ? snap.progress
        : progressFromTasks(snap.tasks);
      setProgress(JSON.parse(JSON.stringify(restoredProgress)));
      setMetrics(JSON.parse(JSON.stringify(snap.metrics)));
      setDebriefDraft(JSON.parse(JSON.stringify(snap.debriefDraft ?? newDebriefDraft())));
      setDebriefHistory(JSON.parse(JSON.stringify(snap.debriefHistory ?? [])));
      // Adopt the loaded launch's id so further saves update its entry.
      setCurrentLaunchId(snap.id);
      setCurrentPhaseId(FIRST_PHASE_ID);
      setGateStep('workflow');
      setSavedWorkflowsOpen(false);
      setWorkflowComplete(false);
    },
    [savedWorkflows],
  );

  const deleteSavedWorkflow = useCallback((id) => {
    setSavedWorkflows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const resetLaunch = useCallback(() => {
    setLaunch(EMPTY_LAUNCH);
    setProgress({});
    setMetrics(EMPTY_METRICS);
    setCurrentPhaseId(FIRST_PHASE_ID);
    setMetricsOpen(false);
    setLivePanelView('playbook');
    setOpenBotForTaskId(null);
    setAILibraryOpen(false);
    setDebriefDraft(newDebriefDraft());
    setDebriefHistory([]);
    setWorkflowComplete(false);
    setLastSavedAt(null);
    setCurrentLaunchId(null);
    // Re-run the intro flow on full reset (saved snapshots are kept).
    setGateStep('welcome');
    setUserMode(null);
    setUserName('');
  }, []);

  /* ---------- derived selectors ---------------------------------------- */

  // User-facing task list: hides tasks flagged `embedded: true` (whose values
  // are captured inside a compound lesson card). Math + playbook still read
  // the full `tasks` array directly when they need to look up by id.
  const visibleTasks = useMemo(() => tasks.filter((t) => !t.embedded), [tasks]);

  const tasksByPhase = useMemo(() => {
    const map = {};
    mbymiPhases.forEach((p) => (map[p.id] = []));
    [...visibleTasks]
      .sort((a, b) => a.order - b.order)
      .forEach((t) => {
        const phaseId = processToPhase[t.process];
        if (phaseId) map[phaseId].push(t);
      });
    return map;
  }, [visibleTasks]);

  const phaseStats = useMemo(() => {
    const out = {};
    mbymiPhases.forEach((p) => {
      const list = tasksByPhase[p.id] ?? [];
      const done = list.filter((t) => t.done).length;
      out[p.id] = {
        total: list.length,
        done,
        remaining: list.length - done,
        complete: list.length > 0 && done === list.length,
      };
    });
    return out;
  }, [tasksByPhase]);

  // A phase is unlocked if all earlier phases are complete (or it's the first).
  const isPhaseUnlocked = useCallback(
    (phaseId) => {
      const idx = mbymiPhases.findIndex((p) => p.id === phaseId);
      if (idx <= 0) return true;
      for (let i = 0; i < idx; i += 1) {
        if (!phaseStats[mbymiPhases[i].id]?.complete) return false;
      }
      return true;
    },
    [phaseStats],
  );

  const currentPhase = useMemo(
    () => mbymiPhases.find((p) => p.id === currentPhaseId) ?? mbymiPhases[0],
    [currentPhaseId],
  );

  // The active task within the current phase = first uncompleted task, lowest order.
  const currentTask = useMemo(() => {
    const list = tasksByPhase[currentPhaseId] ?? [];
    return list.find((t) => !t.done) ?? null;
  }, [tasksByPhase, currentPhaseId]);

  const completedTasksInCurrentPhase = useMemo(
    () => (tasksByPhase[currentPhaseId] ?? []).filter((t) => t.done),
    [tasksByPhase, currentPhaseId],
  );

  // Back button: reopen the most recently completed step. Within the current
  // phase that's the last done task; on the FIRST step of a phase (nothing done
  // here yet) it walks back to the nearest earlier phase that has a completed
  // step and reopens that — so Back is never missing. Sub-task answers stay put,
  // so the card re-renders pre-filled.
  const currentPhaseIdx = mbymiPhases.findIndex((p) => p.id === currentPhaseId);
  const canGoBack = useMemo(() => {
    for (let i = currentPhaseIdx; i >= 0; i -= 1) {
      if ((tasksByPhase[mbymiPhases[i].id] ?? []).some((t) => t.done)) return true;
    }
    return false;
  }, [tasksByPhase, currentPhaseIdx]);
  const goToPreviousStep = useCallback(() => {
    const idx = mbymiPhases.findIndex((p) => p.id === currentPhaseId);
    for (let i = idx; i >= 0; i -= 1) {
      const pid = mbymiPhases[i].id;
      const done = (tasksByPhase[pid] ?? []).filter((t) => t.done);
      if (done.length === 0) continue;
      const prev = done[done.length - 1]; // list is order-sorted → last = most recent
      if (pid !== currentPhaseId) setCurrentPhaseId(pid);
      uncompleteTask(prev.id);
      return;
    }
  }, [tasksByPhase, currentPhaseId, uncompleteTask]);

  // Position within the current phase (1-indexed) for "Step X of Y" labels.
  const phaseStepIndex = useMemo(() => {
    const list = tasksByPhase[currentPhaseId] ?? [];
    if (!currentTask) return list.length;
    return list.findIndex((t) => t.id === currentTask.id) + 1;
  }, [tasksByPhase, currentPhaseId, currentTask]);

  // Progress is measured against user-visible tasks (so the embedded sub-tasks
  // captured inside a lesson card don't inflate the count).
  const totalDone = useMemo(() => visibleTasks.filter((t) => t.done).length, [visibleTasks]);
  const overallProgress = visibleTasks.length === 0 ? 0 : totalDone / visibleTasks.length;

  /* ---------- public value -------------------------------------------- */

  const value = useMemo(
    () => ({
      // raw state
      launch,
      tasks,
      metrics,
      currentPhaseId,
      metricsOpen,
      livePanelView,
      openBotForTaskId,
      aiLibraryOpen,
      debriefDraft,
      debriefHistory,
      workflowComplete,
      gateStep,
      userMode,
      userName,
      savedWorkflows,
      savedWorkflowsOpen,
      lastSavedAt,

      // static-ish
      phases: mbymiPhases,
      processOrder: mbymiProcessOrder,

      // derived
      tasksByPhase,
      phaseStats,
      currentPhase,
      currentTask,
      completedTasksInCurrentPhase,
      phaseStepIndex,
      totalDone,
      totalTasks: visibleTasks.length,
      overallProgress,
      isPhaseUnlocked,
      canGoBack,
      goToPreviousStep,

      // mutations
      setOfferName,
      setDates,
      completeTask,
      uncompleteTask,
      completeLesson,
      uncompleteLesson,
      setTaskAnswer,
      updateMetrics,
      goToPhase,
      openMetricsDrawer,
      closeMetricsDrawer,
      setLivePanelView,
      openBot,
      closeBot,
      openAILibrary,
      closeAILibrary,
      setDebriefField,
      setOfferField,
      addOffer,
      removeOffer,
      setLandingPageField,
      addLandingPage,
      removeLandingPage,
      saveDebrief,
      clearDebriefDraft,
      deleteDebriefHistoryEntry,
      loadDebriefFromHistory,
      dismissCelebration,
      enterAsDemo,
      enterAsGoogle,
      finishNamingLaunch,
      reopenWelcome,
      openSavedWorkflows,
      closeSavedWorkflows,
      saveWorkflow,
      loadWorkflow,
      deleteSavedWorkflow,
      resetLaunch,
      saveProgress,
    }),
    [
      launch,
      tasks,
      metrics,
      currentPhaseId,
      metricsOpen,
      livePanelView,
      openBotForTaskId,
      aiLibraryOpen,
      debriefDraft,
      debriefHistory,
      workflowComplete,
      gateStep,
      userMode,
      userName,
      savedWorkflows,
      savedWorkflowsOpen,
      lastSavedAt,
      saveProgress,
      tasksByPhase,
      phaseStats,
      currentPhase,
      currentTask,
      completedTasksInCurrentPhase,
      phaseStepIndex,
      totalDone,
      overallProgress,
      isPhaseUnlocked,
      canGoBack,
      goToPreviousStep,
      setOfferName,
      setDates,
      completeTask,
      uncompleteTask,
      completeLesson,
      uncompleteLesson,
      setTaskAnswer,
      updateMetrics,
      goToPhase,
      openMetricsDrawer,
      closeMetricsDrawer,
      openBot,
      closeBot,
      openAILibrary,
      closeAILibrary,
      setDebriefField,
      setOfferField,
      addOffer,
      removeOffer,
      setLandingPageField,
      addLandingPage,
      removeLandingPage,
      saveDebrief,
      clearDebriefDraft,
      deleteDebriefHistoryEntry,
      loadDebriefFromHistory,
      dismissCelebration,
      enterAsDemo,
      enterAsGoogle,
      finishNamingLaunch,
      reopenWelcome,
      openSavedWorkflows,
      closeSavedWorkflows,
      saveWorkflow,
      loadWorkflow,
      deleteSavedWorkflow,
      resetLaunch,
    ],
  );

  return <LaunchContext.Provider value={value}>{children}</LaunchContext.Provider>;
}

export function useLaunch() {
  const ctx = useContext(LaunchContext);
  if (!ctx) throw new Error('useLaunch must be used inside <LaunchProvider>');
  return ctx;
}

// Helper: pull the launch-math numbers out of the task answers. The old setup
// used to store these on `launch` directly; they now live as answers to the
// Dream It tasks (price / member target / launch list target).
export function getLaunchNumbers(tasks) {
  const byId = Object.fromEntries(tasks.map((t) => [t.id, t]));
  return {
    foundingMemberPrice: Number(byId['mbymi-01-2']?.answer) || 0,
    foundingMembersTarget: Number(byId['mbymi-01-3']?.answer) || 0,
    launchListTarget: Number(byId['mbymi-01-1']?.answer) || 0,
  };
}
