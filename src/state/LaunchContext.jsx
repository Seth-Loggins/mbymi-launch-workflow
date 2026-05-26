import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { mbymiProcessOrder, mbymiTasks } from '../data/mbymiLaunch.js';
import { mbymiPhases, processToPhase } from '../data/mbymiPhases.js';

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

function freshTasks() {
  return mbymiTasks.map((t) => ({ ...t, done: false, answer: null }));
}

const FIRST_PHASE_ID = mbymiPhases[0].id;

export function LaunchProvider({ children }) {
  const [launch, setLaunch] = useState(EMPTY_LAUNCH);
  const [tasks, setTasks] = useState(freshTasks);
  const [metrics, setMetrics] = useState(EMPTY_METRICS);
  const [currentPhaseId, setCurrentPhaseId] = useState(FIRST_PHASE_ID);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [livePanelView, setLivePanelView] = useState('playbook'); // 'playbook' | 'funnel' | 'links'
  const [openBotForTaskId, setOpenBotForTaskId] = useState(null);
  const [aiLibraryOpen, setAILibraryOpen] = useState(false);
  const [debriefDraft, setDebriefDraft] = useState(newDebriefDraft);
  const [debriefHistory, setDebriefHistory] = useState([]);
  const [workflowComplete, setWorkflowComplete] = useState(false);
  // gateStep: 'welcome' → 'name-launch' → 'workflow'. Lets us run a 2-step
  // intro flow without persisting auth state (no backend yet).
  const [gateStep, setGateStep] = useState('welcome');
  // userMode is 'demo' | 'google' | null — set when the user picks an entry
  // point from the welcome modal. Currently informational only; later we'll
  // hang real Google OAuth off the 'google' branch.
  const [userMode, setUserMode] = useState(null);
  const [userName, setUserName] = useState('');

  /* ---------- mutations ------------------------------------------------ */

  const setOfferName = useCallback((name) => {
    setLaunch((prev) => ({ ...prev, offerName: name }));
  }, []);

  const setDates = useCallback((patch) => {
    setLaunch((prev) => ({ ...prev, dates: { ...prev.dates, ...patch } }));
  }, []);

  const completeTask = useCallback((id, answer = null) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true, answer } : t)));
  }, []);

  const uncompleteTask = useCallback((id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: false } : t)));
  }, []);

  const setTaskAnswer = useCallback((id, answer) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, answer } : t)));
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
    setTasks((prev) =>
      prev.map((t) =>
        t.id === 'mbymi-15-1' ? { ...t, done: true, answer: 'debrief-saved' } : t,
      ),
    );
    // Flag workflow complete — triggers the celebration card.
    setWorkflowComplete(true);
    return record;
  }, [debriefDraft]);

  const dismissCelebration = useCallback(() => setWorkflowComplete(false), []);

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
      setGateStep('workflow');
    },
    [],
  );

  const reopenWelcome = useCallback(() => {
    setGateStep('welcome');
  }, []);

  const resetLaunch = useCallback(() => {
    setLaunch(EMPTY_LAUNCH);
    setTasks(freshTasks());
    setMetrics(EMPTY_METRICS);
    setCurrentPhaseId(FIRST_PHASE_ID);
    setMetricsOpen(false);
    setLivePanelView('playbook');
    setOpenBotForTaskId(null);
    setAILibraryOpen(false);
    setDebriefDraft(newDebriefDraft());
    setDebriefHistory([]);
    setWorkflowComplete(false);
    // Re-run the intro flow on full reset.
    setGateStep('welcome');
    setUserMode(null);
    setUserName('');
  }, []);

  /* ---------- derived selectors ---------------------------------------- */

  const tasksByPhase = useMemo(() => {
    const map = {};
    mbymiPhases.forEach((p) => (map[p.id] = []));
    [...tasks]
      .sort((a, b) => a.order - b.order)
      .forEach((t) => {
        const phaseId = processToPhase[t.process];
        if (phaseId) map[phaseId].push(t);
      });
    return map;
  }, [tasks]);

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

  // Position within the current phase (1-indexed) for "Step X of Y" labels.
  const phaseStepIndex = useMemo(() => {
    const list = tasksByPhase[currentPhaseId] ?? [];
    if (!currentTask) return list.length;
    return list.findIndex((t) => t.id === currentTask.id) + 1;
  }, [tasksByPhase, currentPhaseId, currentTask]);

  const totalDone = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);
  const overallProgress = tasks.length === 0 ? 0 : totalDone / tasks.length;

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
      totalTasks: tasks.length,
      overallProgress,
      isPhaseUnlocked,

      // mutations
      setOfferName,
      setDates,
      completeTask,
      uncompleteTask,
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
      dismissCelebration,
      enterAsDemo,
      enterAsGoogle,
      finishNamingLaunch,
      reopenWelcome,
      resetLaunch,
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
      tasksByPhase,
      phaseStats,
      currentPhase,
      currentTask,
      completedTasksInCurrentPhase,
      phaseStepIndex,
      totalDone,
      overallProgress,
      isPhaseUnlocked,
      setOfferName,
      setDates,
      completeTask,
      uncompleteTask,
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
      dismissCelebration,
      enterAsDemo,
      enterAsGoogle,
      finishNamingLaunch,
      reopenWelcome,
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
