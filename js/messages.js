// Generates Jess's contextual messages for the chat thread.
// Called on app open + after each check-in. Idempotent -- won't double-post the same kind for a given day-slot.

import * as state from './state.js';
import { dayPlan } from '../data/program.js';
import {
  morningMsg, midMorningMsg, postLunchMsg, afternoonMsg,
  eveningHitMsg, eveningMissMsg, weeklyMsg, comebackMsg, celebrate,
  SESSION_LABELS, SESSION_INTROS,
} from '../data/scripts.js';

function nowMins() { const d = new Date(); return d.getHours()*60 + d.getMinutes(); }
function tToMins(t) { const [h,m] = t.split(':').map(Number); return h*60 + m; }

function alreadyPostedToday(kind) {
  const s = state.get();
  const today = state.todayISO();
  return s.messages.some((m) => m.role==='jess' && m.kind===kind && new Date(m.ts).toISOString().slice(0,10) === today);
}

export function tickMessages() {
  const s = state.get();
  if (!s.profile) return;
  const t = nowMins();
  const set = s.settings;
  const di = state.dayIndex();
  const plan = dayPlan(di);
  const sessionKey = plan.day.main;
  const session = SESSION_LABELS[sessionKey];
  const note = plan.note || '';
  const seed = di * 13 + t; // varies day to day

  // Morning
  if (t >= tToMins(set.morningTime) && !alreadyPostedToday('morning')) {
    const text = morningMsg(
      { day: di+1, total: 84, session, note, prevDays: di },
      seed
    );
    state.addMessage('jess', text + '\n\n-- ' + SESSION_INTROS[sessionKey], 'morning');
    const milestone = checkMilestone(di);
    if (milestone) state.addMessage('jess', milestone, 'milestone');
  }
  // Mid-morning
  if (t >= tToMins(set.midMorningTime) && !alreadyPostedToday('midmorning')) {
    state.addMessage('jess', midMorningMsg(seed), 'midmorning');
  }
  // Post-lunch
  if (t >= tToMins(set.postLunchTime) && !alreadyPostedToday('postlunch')) {
    state.addMessage('jess', postLunchMsg(seed), 'postlunch');
  }
  // Afternoon
  if (t >= tToMins(set.afternoonTime) && !alreadyPostedToday('afternoon')) {
    state.addMessage('jess', afternoonMsg(seed), 'afternoon');
  }
  // Evening recap
  if (t >= tToMins(set.eveningTime) && !alreadyPostedToday('evening')) {
    const today = state.todayISO();
    const day = s.days[today];
    const checks = day ? Object.values(day.checks).filter(Boolean).length : 0;
    const total = 7;
    const next = SESSION_LABELS[dayPlan(di+1).day.main];
    const txt = state.isDayComplete(today)
      ? eveningHitMsg({ checks, total, nextSession: next, streak: state.streak() }, seed)
      : eveningMissMsg({ tokensLeft: s.tokensThisMonth, nextSession: next }, seed);
    state.addMessage('jess', txt, 'evening');
    // weekly review on Sunday evening
    if (new Date().getDay() === 0) postWeekly();
  }
}

function checkMilestone(di) {
  // di is 0-indexed days since start
  const days = di + 1;
  if (days === 1) return celebrate(0);
  if (days === 7) return celebrate(1);
  if (days === 14) return celebrate(2);
  if (days === 42) return celebrate(3);
  return null;
}

function postWeekly() {
  const s = state.get();
  const today = new Date();
  let hits = 0, total = 0, steps = 0, brisk = 0;
  for (let i=0;i<7;i++) {
    const d = new Date(today); d.setDate(d.getDate()-i);
    const iso = d.toISOString().slice(0,10);
    const day = s.days[iso];
    if (!day) { total++; continue; }
    total++;
    if (state.isDayComplete(iso)) hits++;
    steps += day.steps || 0;
    brisk += day.briskMin || 0;
  }
  const week = Math.floor(state.dayIndex()/7) + 1;
  state.addMessage('jess', weeklyMsg({ week, hits, total, avgSteps: Math.round(steps/7), briskMin: brisk, bump: 'mobility' }, week*7), 'weekly');
}

export function postComeback() {
  const s = state.get();
  const di = state.dayIndex();
  const plan = dayPlan(di);
  state.addMessage('jess', comebackMsg({ day: di+1, session: SESSION_LABELS[plan.day.main] }, di), 'comeback');
}
