// Jess's voice. Time-of-day-keyed message pools + reactive variants.
// Voice rule: short. Direct. Confident-low-warmth-high-respect. No emoji except occasional —
// Always signs off "— J." in long-form notes; chat thread doesn't sign every line.

const MORNING = [
  "Day {{day}}. {{session}} today. {{note}}",
  "Good morning. We've done this {{prevDays}} times now. {{session}} on the board. Begin when you're ready.",
  "Up. Water first. Then {{session}}. I'll be here.",
  "{{day}} of {{total}}. {{session}}. Form before load.",
];

const MIDMORNING_SNACK = [
  "Stand up. Ten calf raises. Thirty seconds. Now.",
  "Soleus pushups — sixty seconds. From the chair if you have to.",
  "You've been sitting forty minutes. Walk to the kitchen and back. Drink water on the way.",
  "Reverse Kegel × 5. Diaphragm breath × 5. Resume.",
];

const POSTLUNCH = [
  "Twelve minutes outside. Phone optional.",
  "Walk. Brisk if you can. Brisk = you can talk but not sing.",
  "Post-meal walk. Even five minutes counts. Don't overthink it.",
  "Out the door. Ten minutes minimum. Glucose drops. You feel sharper after.",
];

const AFTERNOON_LIGHT = [
  "Five-minute hip flexor reset. Couch stretch each side. Reverse Kegels in there too.",
  "Stand. Soleus pushups × 60s. Calf raises × 15. That's the whole thing.",
  "Quick breathing reset — box breath, four rounds. Then stretch hips.",
  "Light circulation block. Five minutes. You don't need to sweat.",
];

const EVENING_RECAP_HIT = [
  "{{checks}}/{{total}} today. Good. Tomorrow's {{nextSession}}.",
  "You showed up. That's the work. Tomorrow: {{nextSession}}.",
  "Done. Sleep counts as training. Tomorrow {{nextSession}} — I'll send the link at 6:30.",
  "Three for three. Streak is at {{streak}}. {{nextSession}} tomorrow.",
];

const EVENING_RECAP_MISS = [
  "You missed the lift. Skip token used — {{tokensLeft}} left this month. Tomorrow's {{nextSession}}. Reset.",
  "Off day. It happens. {{tokensLeft}} tokens left. Tomorrow we go again — {{nextSession}}.",
  "Today wasn't it. The streak holds — token spent. Tomorrow: {{nextSession}}.",
];

const WEEKLY = [
  "Week {{week}}. You hit {{hits}} of {{total}} sessions. Walking averaged {{avgSteps}}/day, {{briskMin}} brisk min. Next week we bump {{bump}}. You're earning it.",
  "Week {{week}} complete. {{hits}}/{{total}}. Loads stay where they are — clean reps come first. Onward.",
];

const COMEBACK = [
  "You're back. Don't apologize. Day {{day}} starts now — {{session}}. Same plan, no penalty.",
  "Welcome back. We resume where we paused. {{session}}.",
];

const CELEBRATIONS = [
  "First strength session done. The hard one's over.",
  "Seven days straight. The habit is grooved. Don't get cute now.",
  "Two weeks. The body knows the rhythm. Loads go up next week.",
  "Halfway. You're somebody who works out now. That's not a streak — that's identity.",
];

function pick(pool, seed) {
  const i = Math.abs(seed) % pool.length;
  return pool[i];
}

function fill(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

export function morningMsg(vars, seed) { return fill(pick(MORNING, seed), vars); }
export function midMorningMsg(seed)    { return pick(MIDMORNING_SNACK, seed); }
export function postLunchMsg(seed)     { return pick(POSTLUNCH, seed); }
export function afternoonMsg(seed)     { return pick(AFTERNOON_LIGHT, seed); }
export function eveningHitMsg(vars, seed)  { return fill(pick(EVENING_RECAP_HIT, seed), vars); }
export function eveningMissMsg(vars, seed) { return fill(pick(EVENING_RECAP_MISS, seed), vars); }
export function weeklyMsg(vars, seed)  { return fill(pick(WEEKLY, seed), vars); }
export function comebackMsg(vars, seed){ return fill(pick(COMEBACK, seed), vars); }
export function celebrate(milestone)   { return CELEBRATIONS[milestone] ?? null; }

// Daily notes that map session type to a short Jess intro
export const SESSION_INTROS = {
  strengthA: "Strength A — squat, bench, row.",
  strengthB: "Strength B — RDL, press, row.",
  yoga:      "Yoga day. Mat, water, twenty minutes.",
  z2:        "Z2 bike. Easy. You should be able to read or take a call.",
  longwalk:  "Long walk. Outside if weather allows. No phone if you can manage it.",
  rest:      "Rest. Real rest. Walks count. Don't lift.",
};

export const SESSION_LABELS = {
  strengthA: 'Strength A',
  strengthB: 'Strength B',
  yoga:      'Yoga',
  z2:        'Zone 2 bike',
  longwalk:  'Long walk',
  rest:      'Rest',
  mobility:  'Mobility',
};
