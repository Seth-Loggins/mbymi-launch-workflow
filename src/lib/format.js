const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const numberFmt = new Intl.NumberFormat('en-US');

export function formatCurrency(value) {
  if (!Number.isFinite(value)) return '$0';
  return currencyFmt.format(Math.round(value));
}

export function formatNumber(value) {
  if (!Number.isFinite(value)) return '0';
  return numberFmt.format(Math.round(value));
}

export function formatPercent(value, fractionDigits = 1) {
  if (!Number.isFinite(value)) return '0%';
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

export function formatPercentRate(rate, fractionDigits = 1) {
  if (!Number.isFinite(rate)) return '0%';
  return `${rate.toFixed(fractionDigits)}%`;
}

export function formatDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function todayAtMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function dateAtMidnight(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}
