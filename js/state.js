// localStorage-backed state. Single source of truth.
// Schema is intentionally simple: state.profile, state.days{[ISO]:DayLog}, state.messages, state.metrics.

const KEY = 'jess.v1';

const DEFAULT = {
  profile: null, // { name, startDate(ISO), heightCm, weightLb, age, schedule:'morning+light', buddyEmail:null }
  days: {},      // { 'YYYY-MM-DD': DayLog }
  messages: [],  // [{ ts, role:'jess'|'you', text, kind }]
  metrics: {     // weekly self-checks
    sitAndReachCm: [],   // [{ts, val}]
    shoulderReach: [],
    deepSquat: [],
    restingHr: [],
    weight: [],
  },
  settings: {
    morningTime: '06:30',
    midMorningTime: '11:00',
    postLunchTime: '13:30',
    afternoonTime: '16:00',
    eveningTime: '20:30',
    notifications: false, // will request permission
  },
  tokensThisMonth: 3,
  tokenMonth: null, // YYYY-MM
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULT), ...parsed };
  } catch (e) {
    return structuredClone(DEFAULT);
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function get() { return state; }
export function reset() { state = structuredClone(DEFAULT); save(); }

export function update(fn) {
  fn(state);
  save();
  document.dispatchEvent(new CustomEvent('state:change'));
}

export function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

export function dayIndex() {
  if (!state.profile?.startDate) return 0;
  const start = new Date(state.profile.startDate + 'T00:00:00');
  const now = new Date(todayISO() + 'T00:00:00');
  return Math.max(0, Math.floor((now - start) / 86400000));
}

export function ensureDay(iso) {
  if (!state.days[iso]) {
    update((s) => {
      s.days[iso] = {
        iso,
        checks: {           // boolean per atomic check
          morningWalk: false,
          pelvicAM: false,
          mainSession: false,
          mobilityFlow: false,
          postLunchWalk: false,
          afternoonLight: false,
          eveningWalk: false,
        },
        steps: 0,
        briskMin: 0,
        strength: { sets: [] },
        z2Min: 0,
        yogaMin: 0,
        notes: '',
        tokenUsed: false,
        contributions: {}, // checkKey -> {steps, briskMin, yogaMin, z2Min} added when checked
      };
    });
  }
  // Backfill for previously-saved days that lacked contributions
  if (!state.days[iso].contributions) state.days[iso].contributions = {};
  return state.days[iso];
}

// Set a check ON or OFF, with reversible side-effects.
// `contribution` is an optional {steps, briskMin, yogaMin, z2Min} delta to apply on check
// and reverse on uncheck.
export function setCheck(iso, key, val, contribution = null) {
  ensureDay(iso);
  update((s) => {
    const day = s.days[iso];
    const wasOn = !!day.checks[key];
    day.checks[key] = !!val;
    if (val && !wasOn && contribution) {
      // Apply
      day.steps    += contribution.steps    || 0;
      day.briskMin += contribution.briskMin || 0;
      day.yogaMin  += contribution.yogaMin  || 0;
      day.z2Min    += contribution.z2Min    || 0;
      day.contributions[key] = { ...contribution };
    } else if (!val && wasOn && day.contributions[key]) {
      // Reverse
      const c = day.contributions[key];
      day.steps    = Math.max(0, day.steps    - (c.steps    || 0));
      day.briskMin = Math.max(0, day.briskMin - (c.briskMin || 0));
      day.yogaMin  = Math.max(0, day.yogaMin  - (c.yogaMin  || 0));
      day.z2Min    = Math.max(0, day.z2Min    - (c.z2Min    || 0));
      delete day.contributions[key];
    }
  });
}

export function lastSavedAt() {
  try {
    // Use most recent message ts or day's modification -- approximate
    const s = state;
    const lastMsg = s.messages.length ? s.messages[s.messages.length-1].ts : 0;
    return lastMsg || Date.now();
  } catch (e) { return Date.now(); }
}

export function exportJSON() {
  return JSON.stringify(state, null, 2);
}

export function logSet(iso, lift, reps, load) {
  ensureDay(iso);
  update((s) => { s.days[iso].strength.sets.push({ lift, reps, load, ts: Date.now() }); });
}

export function logWalk(iso, minutes, brisk) {
  ensureDay(iso);
  update((s) => {
    s.days[iso].steps += Math.round(minutes * 105); // approx 105 steps/min brisk
    s.days[iso].briskMin += brisk ? minutes : 0;
  });
}

export function logZ2(iso, minutes) {
  ensureDay(iso);
  update((s) => { s.days[iso].z2Min += minutes; });
}

export function logYoga(iso, minutes) {
  ensureDay(iso);
  update((s) => { s.days[iso].yogaMin += minutes; });
}

export function addMessage(role, text, kind='') {
  update((s) => { s.messages.push({ ts: Date.now(), role, text, kind }); });
}

export function metricAdd(metric, val) {
  update((s) => { s.metrics[metric].push({ ts: Date.now(), val: Number(val) }); });
}

export function ensureTokenMonth() {
  const now = new Date();
  const ym = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');
  if (state.tokenMonth !== ym) {
    update((s) => { s.tokenMonth = ym; s.tokensThisMonth = 3; });
  }
}

export function spendToken() {
  if (state.tokensThisMonth > 0) {
    update((s) => { s.tokensThisMonth -= 1; });
    return true;
  }
  return false;
}

// Derived helpers
export function isDayComplete(iso) {
  const d = state.days[iso];
  if (!d) return false;
  // Minimum bar = pelvic floor + ≥1 walk
  return d.checks.pelvicAM && (d.checks.morningWalk || d.checks.postLunchWalk || d.checks.eveningWalk);
}

export function streak() {
  // Walk back from today, counting consecutive complete days. Skip-tokened days count as complete.
  let count = 0;
  for (let i=0;; i++) {
    const d = new Date(); d.setDate(d.getDate()-i);
    const iso = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    const day = state.days[iso];
    if (!day && i === 0) { count++; continue; } // today not yet logged -- be generous
    if (!day) break;
    const sun = d.getDay() === 0;
    if (sun || isDayComplete(iso) || day.tokenUsed) { count++; continue; }
    break;
  }
  return Math.max(0, count - 1); // subtract the "today generosity"
}

export function totals() {
  const days = Object.values(state.days);
  return {
    sessions: days.filter((d) => d.checks.mainSession).length,
    walks: days.reduce((a,d) => a + (d.checks.morningWalk?1:0) + (d.checks.postLunchWalk?1:0) + (d.checks.eveningWalk?1:0), 0),
    yogaMin: days.reduce((a,d) => a + (d.yogaMin||0), 0),
    z2Min: days.reduce((a,d) => a + (d.z2Min||0), 0),
    pelvicSets: days.filter((d) => d.checks.pelvicAM).length,
    totalSteps: days.reduce((a,d) => a + (d.steps||0), 0),
    totalBrisk: days.reduce((a,d) => a + (d.briskMin||0), 0),
    daysActive: days.filter((d) => isDayComplete(d.iso)).length,
  };
}
