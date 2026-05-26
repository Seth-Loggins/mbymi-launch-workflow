import { dateAtMidnight, todayAtMidnight } from './format.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Process groups that must be done by Close Day. Used by the "key steps aren't done"
// danger alert. Names match the labels in mbymiLaunch.js.
const CLOSE_DAY_CRITICAL_GROUPS = ['Flash Sale', 'Webinar', 'Payment + Delivery'];

// Task ids the workbook captures the launch-math numbers into.
const TASK_ID_LAUNCH_LIST = 'mbymi-01-1';
const TASK_ID_PRICE = 'mbymi-01-2';
const TASK_ID_MEMBERS = 'mbymi-01-3';

// Resolves the numeric launch parameters from task answers. Previously these
// lived on the launch object directly; now they're answers to Dream It tasks,
// so math fns build a "view" object that looks the same to downstream code.
export function makeLaunchView(launch, tasks) {
  const byId = Object.fromEntries(tasks.map((t) => [t.id, t]));
  return {
    ...launch,
    foundingMemberPrice: Number(byId[TASK_ID_PRICE]?.answer) || 0,
    foundingMembersTarget: Number(byId[TASK_ID_MEMBERS]?.answer) || 0,
    launchListTarget: Number(byId[TASK_ID_LAUNCH_LIST]?.answer) || 0,
  };
}

export function computeDerived(launch, metrics, tasks) {
  const view = makeLaunchView(launch, tasks);
  const tasksDone = tasks.filter((t) => t.done).length;
  const overallProgress = tasks.length ? tasksDone / tasks.length : 0;

  const revenueGoal = (view.foundingMemberPrice ?? 0) * (view.foundingMembersTarget ?? 0);
  const conversionGoal =
    view.launchListTarget > 0
      ? (view.foundingMembersTarget ?? 0) / view.launchListTarget
      : 0;

  const waitlist = metrics.waitlistSignupsActual ?? 0;
  const conversionActual = waitlist > 0 ? (metrics.membersEnrolledActual ?? 0) / waitlist : 0;
  const earningsPerLead = waitlist > 0 ? (metrics.revenueActual ?? 0) / waitlist : 0;
  const showUpRate = waitlist > 0 ? (metrics.webinarShowUpsActual ?? 0) / waitlist : 0;

  const closeDate = dateAtMidnight(launch.dates?.closeDay);
  const today = todayAtMidnight();
  const daysUntilCloseDay = closeDate
    ? Math.ceil((closeDate.getTime() - today.getTime()) / MS_PER_DAY)
    : null;

  // Current process group = process of the first task with done === false (lowest order).
  const nextTask = [...tasks].sort((a, b) => a.order - b.order).find((t) => !t.done);
  const currentProcess = nextTask ? nextTask.process : null;

  return {
    tasksDone,
    overallProgress,
    revenueGoal,
    conversionGoal,
    conversionActual,
    earningsPerLead,
    showUpRate,
    daysUntilCloseDay,
    nextTask,
    currentProcess,
  };
}

export function computeRecovery(launch, metrics, ratePercent, tasks) {
  const view = makeLaunchView(launch, tasks);
  const waitlist = metrics.waitlistSignupsActual ?? 0;
  const price = view.foundingMemberPrice ?? 0;
  const revenueGoal = price * (view.foundingMembersTarget ?? 0);

  const projectedMembers = Math.round((waitlist * ratePercent) / 100);
  const projectedRevenue = projectedMembers * price;

  const conversionToHitGoal =
    waitlist > 0 && price > 0 ? (revenueGoal / price / waitlist) * 100 : 0;

  const hitsGoal = projectedRevenue >= revenueGoal;
  const surplus = projectedRevenue - revenueGoal;

  return {
    projectedMembers,
    projectedRevenue,
    conversionToHitGoal,
    hitsGoal,
    surplus,
    revenueGoal,
  };
}

// Group counts: { [process]: { total, done, remaining } }
export function groupCounts(tasks, processOrder) {
  const map = {};
  processOrder.forEach((p) => {
    map[p] = { total: 0, done: 0, remaining: 0 };
  });
  tasks.forEach((t) => {
    if (!map[t.process]) map[t.process] = { total: 0, done: 0, remaining: 0 };
    map[t.process].total += 1;
    if (t.done) map[t.process].done += 1;
    else map[t.process].remaining += 1;
  });
  return map;
}

export function processesComplete(tasks, processOrder) {
  const counts = groupCounts(tasks, processOrder);
  return processOrder.filter((p) => counts[p].total > 0 && counts[p].remaining === 0).length;
}

// Returns [{ severity: 'danger'|'warning'|'success', message }]
export function computeAlerts({ launch, metrics, tasks, derived, processOrder }) {
  const alerts = [];
  const view = makeLaunchView(launch, tasks);

  // Danger — conversion below goal (only if members have been enrolled).
  if (
    metrics.membersEnrolledActual > 0 &&
    derived.conversionActual < derived.conversionGoal &&
    derived.conversionGoal > 0
  ) {
    alerts.push({
      severity: 'danger',
      title: 'Conversion is below goal',
      message: `Conversion ${(derived.conversionActual * 100).toFixed(1)}% vs ${(
        derived.conversionGoal * 100
      ).toFixed(1)}% goal.`,
    });
  }

  // Warning — uncompleted tasks in the current process group.
  if (derived.currentProcess) {
    const counts = groupCounts(tasks, processOrder);
    const remaining = counts[derived.currentProcess]?.remaining ?? 0;
    if (remaining > 0) {
      alerts.push({
        severity: 'warning',
        title: 'Active process group still has work',
        message: `${remaining} step${remaining === 1 ? '' : 's'} remain in ${derived.currentProcess}.`,
      });
    }
  }

  // Success — any actual meets or beats its target/goal.
  const successes = [];
  if (
    derived.revenueGoal > 0 &&
    metrics.revenueActual >= derived.revenueGoal
  ) {
    const pct = ((metrics.revenueActual / derived.revenueGoal - 1) * 100).toFixed(0);
    successes.push(`Revenue goal beaten by ${pct}%.`);
  }
  if (
    view.foundingMembersTarget > 0 &&
    metrics.membersEnrolledActual >= view.foundingMembersTarget
  ) {
    const pct = ((metrics.membersEnrolledActual / view.foundingMembersTarget - 1) * 100).toFixed(
      0,
    );
    successes.push(`Founding-member target beaten by ${pct}%.`);
  }
  if (
    view.launchListTarget > 0 &&
    metrics.waitlistSignupsActual >= view.launchListTarget
  ) {
    const pct = ((metrics.waitlistSignupsActual / view.launchListTarget - 1) * 100).toFixed(0);
    successes.push(`Waitlist goal beaten by ${pct}%.`);
  }
  if (
    derived.conversionGoal > 0 &&
    derived.conversionActual >= derived.conversionGoal &&
    metrics.membersEnrolledActual > 0
  ) {
    successes.push(
      `Conversion at ${(derived.conversionActual * 100).toFixed(1)}% — at or above ${(
        derived.conversionGoal * 100
      ).toFixed(1)}% goal.`,
    );
  }
  if (successes.length > 0) {
    alerts.push({
      severity: 'success',
      title: 'On track',
      message: successes.join(' '),
    });
  }

  // Danger — close day in 3 days and key steps aren't done.
  if (
    derived.daysUntilCloseDay !== null &&
    derived.daysUntilCloseDay <= 3 &&
    derived.daysUntilCloseDay >= 0
  ) {
    const counts = groupCounts(tasks, processOrder);
    const criticalRemaining = CLOSE_DAY_CRITICAL_GROUPS.reduce(
      (sum, g) => sum + (counts[g]?.remaining ?? 0),
      0,
    );
    if (criticalRemaining > 0) {
      alerts.push({
        severity: 'danger',
        title: 'Close day is imminent',
        message: `Close day in ${derived.daysUntilCloseDay} day${
          derived.daysUntilCloseDay === 1 ? '' : 's'
        } and key steps aren't done (${criticalRemaining} remaining across Flash Sale, Webinar, Payment + Delivery).`,
      });
    }
  }

  return alerts;
}

export const KEY_CLOSE_DAY_GROUPS = CLOSE_DAY_CRITICAL_GROUPS;
