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

  const resetLaunch = useCallback(() => {
    setLaunch(EMPTY_LAUNCH);
    setTasks(freshTasks());
    setMetrics(EMPTY_METRICS);
    setCurrentPhaseId(FIRST_PHASE_ID);
    setMetricsOpen(false);
    setLivePanelView('playbook');
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
