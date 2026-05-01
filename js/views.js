import * as state from './state.js';
import { go } from './router.js';
import { dayPlan, PROGRAM, weekFor } from '../data/program.js';
import { EXERCISES, MOBILITY_FLOWS } from '../data/exercises.js';
import { SESSION_LABELS, SESSION_INTROS } from '../data/scripts.js';
import { tickMessages, postComeback } from './messages.js';

const $ = (sel, root=document) => root.querySelector(sel);
const el = (tag, attrs={}, kids=[]) => {
  const n = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (v === true) n.setAttribute(k, '');
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  for (const k of [].concat(kids)) {
    if (k == null || k === false) continue;
    n.append(k.nodeType ? k : document.createTextNode(k));
  }
  return n;
};

function topbar(title, sub) {
  return el('header', {class:'topbar'}, [
    el('div', {class:'topbar-row'}, [
      el('div', {class:'eyebrow'}, sub || ''),
      el('h1', {}, title),
    ]),
  ]);
}

function tabbar(active) {
  const tabs = [
    { id:'#today',    label:'Today',    icon:dot() },
    { id:'#programs', label:'Programs', icon:bars() },
    { id:'#jess',     label:'Jess',     icon:speak() },
    { id:'#progress', label:'Progress', icon:chart() },
    { id:'#settings', label:'Settings', icon:gear() },
  ];
  return el('nav', {class:'tabbar'},
    tabs.map((t) => el('a', { href:t.id, class:'tab' + (active===t.id ? ' active' : ''), 'aria-label':t.label }, [t.icon, el('span',{},t.label)]))
  );
}

// ------- Onboarding -------
export function renderOnboarding(root) {
  const s = state.get();
  const container = el('div', {class:'onboard'}, [
    el('div', {class:'hero hero-onboard'}, [
      el('div', {class:'hero-overlay'}),
      el('div', {class:'hero-text'}, [
        el('div', {class:'eyebrow'}, 'Coach Jess'),
        el('h1', {}, 'You showed up.'),
        el('p', {class:'lede'}, "I'll handle the plan. You handle the work. We'll start small."),
      ]),
    ]),
    el('div', {class:'card form'}, [
      el('label', {}, 'What should I call you?'),
      el('input', { id:'on-name', placeholder:'Danny', value: s.profile?.name || 'Danny' }),
      el('label', {}, 'Weight (lb)'),
      el('input', { id:'on-weight', type:'number', value: s.profile?.weightLb || 152 }),
      el('label', {}, 'Height (in)'),
      el('input', { id:'on-height', type:'number', value: s.profile?.heightIn || 70 }),
      el('label', {}, 'Buddy email (optional — for weekly digest)'),
      el('input', { id:'on-buddy', type:'email', placeholder:'someone@example.com', value: s.profile?.buddyEmail || '' }),
      el('button', { class:'btn primary', onclick:() => {
        state.update((st) => {
          st.profile = {
            name: $('#on-name').value || 'Danny',
            weightLb: Number($('#on-weight').value) || 152,
            heightIn: Number($('#on-height').value) || 70,
            buddyEmail: $('#on-buddy').value || null,
            startDate: state.todayISO(),
            age: 43,
          };
        });
        state.ensureTokenMonth();
        state.ensureDay(state.todayISO());
        tickMessages();
        go('#today');
      }}, 'Begin →'),
      el('p', {class:'fineprint'}, "Everything stays on this device. Buddy email only used if you tap 'Send weekly digest' yourself."),
    ]),
  ]);
  root.append(container);
}

// ------- Today -------
export function renderToday(root) {
  state.ensureTokenMonth();
  state.ensureDay(state.todayISO());
  tickMessages();
  const s = state.get();
  const di = state.dayIndex();
  const plan = dayPlan(di);
  const day = s.days[state.todayISO()];
  const sessionKey = plan.day.main;
  const sessionLabel = SESSION_LABELS[sessionKey];
  const targets = plan.targets;
  const tokensLeft = s.tokensThisMonth;

  const heroTitle = sessionKey==='rest' ? 'Rest day.' : `Day ${di+1}.`;

  const tasks = buildDailyTaskList(plan);

  const root_ = el('div', {class:'screen'}, [
    el('div', {class:'hero'}, [
      el('div', {class:'hero-overlay'}),
      el('div', {class:'hero-text'}, [
        el('div', {class:'eyebrow'}, `Week ${plan.week.week} · ${plan.week.theme}`),
        el('h1', {}, heroTitle),
        el('p', {class:'lede'}, plan.note || SESSION_INTROS[sessionKey]),
      ]),
      el('div', {class:'hero-meta'}, [
        statBadge('STREAK', state.streak() + 'd'),
        statBadge('TOKENS', tokensLeft + ' left'),
      ]),
    ]),

    el('section', {class:'card session-card'}, [
      el('div', {class:'session-row'}, [
        el('div', {}, [
          el('div', {class:'eyebrow'}, "TODAY'S MAIN"),
          el('div', {class:'session-title'}, sessionLabel),
        ]),
        sessionKey !== 'rest' ? el('button', { class:'btn primary', onclick:() => go(`#workout/${sessionKey}`) }, 'Start →') : el('button', {class:'btn ghost', disabled:true}, 'Take it easy'),
      ]),
    ]),

    el('section', {class:'tasks'}, [
      el('div', {class:'eyebrow'}, "TODAY'S CHECK-INS"),
      ...tasks.map((t) => taskRow(t, day)),
    ]),

    el('section', {class:'card brick'}, [
      el('div', {class:'eyebrow'}, 'STEPS'),
      el('div', {class:'big-num'}, day.steps.toLocaleString()),
      el('div', {class:'meta'}, `target ${targets.step_target.toLocaleString()} · ${day.briskMin} brisk min`),
      stepBar(day.steps, targets.step_target),
      el('div', {class:'row gap-sm'}, [
        el('button', {class:'btn small', onclick:() => quickWalk(10, true)}, '+10 min walk'),
        el('button', {class:'btn small', onclick:() => quickWalk(15, true)}, '+15 min'),
        el('button', {class:'btn small', onclick:() => quickWalk(30, false)}, '+30 casual'),
      ]),
    ]),

    el('section', {class:'card jess-card'}, [
      el('div', {class:'eyebrow'}, 'JESS'),
      el('div', {class:'jess-quote'}, latestJessLine()),
      el('a', {href:'#jess', class:'btn ghost'}, 'Open thread →'),
    ]),

    tabbar('#today'),
  ]);
  root.append(root_);
}

function buildDailyTaskList(plan) {
  const t = plan.targets;
  return [
    { key:'morningWalk',     label:'Morning walk',          detail:`${t.walk_min_morning} min, brisk` },
    { key:'pelvicAM',        label:'Pelvic floor + reverse Kegels', detail:'10 reps × 3 sets, lying' },
    { key:'mainSession',     label:`Main: ${SESSION_LABELS[plan.day.main]}`, detail:plan.day.main==='rest'?'auto-complete':'tap Start above' },
    { key:'mobilityFlow',    label:'Mobility (5 min)',      detail:'Tom Merrick hip flow' },
    { key:'postLunchWalk',   label:'Post-lunch walk',       detail:`${t.walk_min_postlunch} min` },
    { key:'afternoonLight',  label:'Afternoon circulation', detail:'Calf raises + reverse Kegels + hip flexor' },
    { key:'eveningWalk',     label:'Evening wind-down walk',detail:`${t.walk_min_postdinner} min, easy` },
  ];
}

function taskRow(t, day) {
  const done = day.checks[t.key];
  return el('button', {
    class:'task' + (done?' done':''),
    onclick: () => {
      state.setCheck(state.todayISO(), t.key, !done);
      // small contextual log
      if (!done && t.key === 'morningWalk') state.logWalk(state.todayISO(), 10, true);
      if (!done && t.key === 'postLunchWalk') state.logWalk(state.todayISO(), 12, true);
      if (!done && t.key === 'eveningWalk') state.logWalk(state.todayISO(), 15, false);
      if (!done && t.key === 'mobilityFlow') state.logYoga(state.todayISO(), 5);
    }
  }, [
    el('span', {class:'check'}, done ? '✓' : ''),
    el('div', {class:'task-text'}, [
      el('div', {class:'task-label'}, t.label),
      el('div', {class:'task-meta'}, t.detail),
    ]),
  ]);
}

function quickWalk(min, brisk) {
  state.logWalk(state.todayISO(), min, brisk);
}

function stepBar(val, target) {
  const pct = Math.min(100, Math.round((val/target)*100));
  return el('div', {class:'bar'}, [
    el('div', {class:'bar-fill', style:`width:${pct}%`}),
  ]);
}

function statBadge(label, val) {
  return el('div', {class:'badge'}, [el('div',{class:'badge-l'},label), el('div',{class:'badge-v'},val)]);
}

function latestJessLine() {
  const s = state.get();
  const last = [...s.messages].reverse().find((m) => m.role==='jess');
  return last?.text || "I'll write to you in the morning.";
}

// ------- Workout Player -------
export function renderWorkout(root, sessionKey) {
  const s = state.get();
  const plan = dayPlan(state.dayIndex());
  if (sessionKey === 'strengthA' || sessionKey === 'strengthB') return renderStrength(root, sessionKey, plan);
  if (sessionKey === 'yoga') return renderYoga(root, plan);
  if (sessionKey === 'z2')   return renderZ2(root, plan);
  if (sessionKey === 'longwalk') return renderLongWalk(root, plan);
  return renderToday(root);
}

function renderStrength(root, key, plan) {
  const tgt = key==='strengthA' ? plan.targets.strength : plan.targets.strengthB;
  const sets = tgt.sets, reps = tgt.reps, lifts = tgt.lifts, loads = tgt.loads;
  const today = state.todayISO();

  const liftCards = lifts.map((lift) => {
    const ex = EXERCISES[lift] || { cues:[], video:null };
    const load = loads[lift];
    const setRow = el('div', {class:'set-row'});
    for (let i=1;i<=sets;i++) {
      const btn = el('button', {class:'set-btn', onclick:() => {
        state.logSet(today, lift, reps, load);
        btn.classList.add('done');
        btn.textContent = `✓ ${reps} × ${load}`;
      }}, `Set ${i} · ${reps} × ${load}`);
      setRow.append(btn);
    }
    return el('section', {class:'card lift-card'}, [
      el('div', {class:'lift-head'}, [
        el('h2', {}, lift),
        load ? el('div', {class:'load-pill'}, `${load} lb`) : null,
      ]),
      el('ul', {class:'cues'}, ex.cues.map((c) => el('li',{},c))),
      ex.video ? el('a', {class:'video-pill', href:ex.video.url, target:'_blank', rel:'noopener'}, [
        el('span', {class:'play'}, '▶'),
        el('span', {}, ex.video.title),
      ]) : null,
      setRow,
    ]);
  });

  const finishBtn = el('button', { class:'btn primary big', onclick:() => {
    state.setCheck(today, 'mainSession', true);
    go('#today');
  }}, 'Finish session');

  root.append(el('div',{class:'screen'},[
    el('div', {class:'topbar'}, [
      el('a', {href:'#today', class:'back'}, '← Back'),
      el('div', {class:'eyebrow'}, `Week ${plan.week.week} · ${SESSION_LABELS[key]}`),
      el('h1', {}, 'Lift.'),
    ]),
    el('section', {class:'card warmup'}, [
      el('div', {class:'eyebrow'}, 'WARMUP — 4 MIN'),
      el('div', {}, '1 min march · 30 s arm circles · 30 s deep squat hold · 1 min hip flexor stretch · 1 min thoracic openers'),
    ]),
    ...liftCards,
    el('section', {class:'card lift-card'}, [
      el('div', {class:'lift-head'}, [el('h2', {}, 'Pelvic Floor — finisher')]),
      el('ul', {class:'cues'}, EXERCISES['Pelvic Floor Set'].cues.map((c) => el('li',{},c))),
      el('a', {class:'video-pill', href:EXERCISES['Pelvic Floor Set'].video.url, target:'_blank', rel:'noopener'}, [
        el('span',{class:'play'},'▶'), el('span',{}, EXERCISES['Pelvic Floor Set'].video.title)
      ]),
      el('button', {class:'set-btn', onclick: (e) => {
        state.setCheck(today, 'pelvicAM', true);
        e.target.classList.add('done'); e.target.textContent = '✓ Pelvic floor logged';
      }}, 'Tap when done'),
    ]),
    finishBtn,
  ]));
}

function renderYoga(root, plan) {
  const today = state.todayISO();
  const min = plan.targets.yoga_min;
  const flow = pickYogaFlow(min);
  let timer = null, secs = min*60, started = false;
  const timerEl = el('div', {class:'big-num timer'}, fmtMM(secs));

  function tick() { secs--; timerEl.textContent = fmtMM(secs); if (secs<=0) { clearInterval(timer); timerEl.textContent='Done'; } }
  function toggle(btn) {
    if (!started) { timer = setInterval(tick, 1000); started=true; btn.textContent='Pause'; }
    else { clearInterval(timer); started=false; btn.textContent='Resume'; }
  }

  root.append(el('div',{class:'screen'},[
    el('div', {class:'topbar'}, [
      el('a', {href:'#today', class:'back'}, '← Back'),
      el('h1', {}, 'Yoga.'),
    ]),
    el('section', {class:'card video-hero'}, [
      el('div', {class:'eyebrow'}, 'TAP TO OPEN ON YOUTUBE'),
      el('a', {href:flow.url, target:'_blank', rel:'noopener', class:'video-card'}, [
        el('div',{class:'video-title'}, flow.title),
        el('div',{class:'video-author'}, flow.author),
        el('div',{class:'play-large'},'▶'),
      ]),
    ]),
    el('section', {class:'card timer-card'}, [
      el('div', {class:'eyebrow'}, `${min}-MIN TIMER`),
      timerEl,
      el('div', {class:'row gap-sm'}, [
        (() => { const b = el('button',{class:'btn primary', onclick:()=>toggle(b)}, 'Start'); return b; })(),
      ]),
    ]),
    el('button', {class:'btn primary big', onclick:() => {
      state.logYoga(today, min);
      state.setCheck(today,'mainSession',true);
      state.setCheck(today,'mobilityFlow',true);
      go('#today');
    }}, 'Mark complete'),
  ]));
}

function pickYogaFlow(min) {
  if (min <= 12) return MOBILITY_FLOWS.long_15min;
  if (min <= 18) return MOBILITY_FLOWS.long_15min;
  if (min <= 22) return MOBILITY_FLOWS.long_20min;
  return MOBILITY_FLOWS.long_25min;
}

function renderZ2(root, plan) {
  const today = state.todayISO();
  const min = plan.targets.z2_min;
  let timer=null, secs=min*60, started=false;
  const timerEl = el('div',{class:'big-num timer'}, fmtMM(secs));
  function tick(){ secs--; timerEl.textContent=fmtMM(secs); if (secs<=0){clearInterval(timer); timerEl.textContent='Done';} }
  function toggle(btn){ if(!started){timer=setInterval(tick,1000);started=true;btn.textContent='Pause';} else {clearInterval(timer);started=false;btn.textContent='Resume';} }

  root.append(el('div',{class:'screen'},[
    el('div',{class:'topbar'},[ el('a',{href:'#today',class:'back'},'← Back'), el('h1',{},'Zone 2 bike.') ]),
    el('section',{class:'card'},[
      el('div',{class:'eyebrow'},'EFFORT'),
      el('p',{class:'lede'},"Easy. You should be able to read or take a call. RPE 3–4 of 10. Nasal breathing if you can."),
      el('div',{class:'eyebrow'}, `${min}-MIN TIMER`),
      timerEl,
      (() => { const b = el('button',{class:'btn primary', onclick:()=>toggle(b)},'Start'); return b; })(),
    ]),
    el('section',{class:'card'},[
      el('div',{class:'eyebrow'},'WHILE YOU RIDE'),
      el('ul',{class:'cues'},[
        el('li',{},'Read a chapter of something. Or watch with subtitles.'),
        el('li',{},'Cadence steady. No surges.'),
        el('li',{},'Sip water. Refill when timer hits halfway.'),
      ]),
    ]),
    el('button',{class:'btn primary big', onclick:()=>{ state.logZ2(today,min); state.setCheck(today,'mainSession',true); go('#today'); }},'Mark complete'),
  ]));
}

function renderLongWalk(root, plan) {
  const today = state.todayISO();
  const min = 35;
  let secs=min*60, started=false, timer=null;
  const timerEl = el('div',{class:'big-num timer'}, fmtMM(secs));
  function tick(){ secs--; timerEl.textContent=fmtMM(secs); if(secs<=0){clearInterval(timer); timerEl.textContent='Done';} }
  function toggle(btn){ if(!started){timer=setInterval(tick,1000);started=true;btn.textContent='Pause';} else {clearInterval(timer);started=false;btn.textContent='Resume';} }

  root.append(el('div',{class:'screen'},[
    el('div',{class:'topbar'},[ el('a',{href:'#today',class:'back'},'← Back'), el('h1',{},'Long walk.') ]),
    el('section',{class:'card'},[
      el('p',{class:'lede'},"Outside if you can. Brisk first ten, easy after. Cadence around 110 steps/min for the brisk segment."),
      timerEl,
      (() => { const b=el('button',{class:'btn primary',onclick:()=>toggle(b)},'Start'); return b; })(),
    ]),
    el('button',{class:'btn primary big', onclick:()=>{ state.logWalk(today,min,true); state.setCheck(today,'mainSession',true); state.setCheck(today,'morningWalk',true); go('#today'); }},'Mark complete'),
  ]));
}

function fmtMM(s) {
  s = Math.max(0,s);
  const m = Math.floor(s/60), r = s%60;
  return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
}

// ------- Programs -------
export function renderPrograms(root) {
  const di = state.dayIndex();
  const cur = Math.floor(di/7);
  root.append(el('div',{class:'screen'},[
    topbar('The 12 weeks.', 'PROGRAM'),
    el('section', {class:'weeks'}, PROGRAM.map((w, i) => el('div', {class:'week-card' + (i===cur?' current':'')}, [
      el('div', {class:'week-head'}, [
        el('div', {class:'week-num'}, `WEEK ${w.week}`),
        i===cur ? el('div', {class:'week-tag'}, 'NOW') : null,
      ]),
      el('div', {class:'week-theme'}, w.theme),
      el('div', {class:'week-grid'}, w.days.map((d) => el('div', {class:'week-day'}, [
        el('div', {class:'week-dow'}, d.d),
        el('div', {class:'week-main'}, SESSION_LABELS[d.main]),
      ]))),
    ]))),
    tabbar('#programs'),
  ]));
}

// ------- Jess thread -------
export function renderJess(root) {
  tickMessages();
  const s = state.get();
  const messages = s.messages.slice(-50);
  root.append(el('div',{class:'screen jess-screen'},[
    el('header',{class:'topbar jess-topbar'}, [
      el('div',{class:'avatar'}, 'J'),
      el('div',{}, [
        el('div',{class:'jess-name'},'Jess'),
        el('div',{class:'jess-sub'}, `Day ${state.dayIndex()+1} · ${state.streak()}d streak`),
      ]),
    ]),
    el('section',{class:'thread'}, messages.length === 0 ? [
      el('div',{class:'thread-empty'},"I'll write to you in the morning."),
    ] : messages.map((m) => el('div',{class:`bubble ${m.role}`}, m.text))),
    el('section',{class:'card reply-card'},[
      el('div',{class:'eyebrow'},'YOUR REPLY'),
      el('div',{class:'row gap-sm'}, [
        replyChip("On it."),
        replyChip("Done."),
        replyChip("Need to skip today."),
        replyChip("I'm back."),
      ]),
    ]),
    tabbar('#jess'),
  ]));
}

function replyChip(text) {
  return el('button', {class:'chip', onclick:() => {
    state.addMessage('you', text, 'reply');
    if (text.startsWith('Need')) {
      const ok = state.spendToken();
      if (ok) {
        const today = state.todayISO();
        state.update((s) => { s.days[today] = s.days[today] || {}; s.days[today].tokenUsed = true; });
        state.addMessage('jess', "Token spent. No streak break. Tomorrow we go.", 'token');
      } else {
        state.addMessage('jess', "Out of tokens this month. The streak will pause — comeback streaks count too.", 'token');
      }
    }
    if (text.startsWith("I'm back")) postComeback();
  }}, text);
}

// ------- Progress -------
export function renderProgress(root) {
  const s = state.get();
  const t = state.totals();
  const di = state.dayIndex();

  const last14 = [];
  for (let i=13;i>=0;i--) {
    const d = new Date(); d.setDate(d.getDate()-i);
    const iso = d.toISOString().slice(0,10);
    const day = s.days[iso];
    last14.push({ iso, day, label: ['S','M','T','W','T','F','S'][d.getDay()] });
  }

  root.append(el('div',{class:'screen'}, [
    topbar('Progress.', 'YOU OVER TIME'),

    el('section',{class:'card hero-num'},[
      el('div',{class:'eyebrow'},'STREAK'),
      el('div',{class:'big-num xl'}, state.streak()),
      el('div',{class:'meta'}, 'days of showing up'),
    ]),

    el('section',{class:'card'}, [
      el('div',{class:'eyebrow'},'LAST 14 DAYS'),
      el('div',{class:'heat'}, last14.map((c) => {
        const intensity = c.day ? Math.min(4, Math.floor((Object.values(c.day.checks||{}).filter(Boolean).length)/2)) : 0;
        return el('div',{class:`heat-cell heat-${intensity}`, title: c.iso}, c.label);
      })),
    ]),

    el('section',{class:'grid-2'},[
      bigStat('SESSIONS',  t.sessions),
      bigStat('WALKS',     t.walks),
      bigStat('YOGA MIN',  t.yogaMin),
      bigStat('Z2 MIN',    t.z2Min),
      bigStat('PELVIC SETS', t.pelvicSets),
      bigStat('TOTAL STEPS', t.totalSteps.toLocaleString()),
      bigStat('BRISK MIN', t.totalBrisk),
      bigStat('DAY', di+1),
    ]),

    el('section', {class:'card'}, [
      el('div',{class:'eyebrow'},'WEEKLY METRICS — log when ready'),
      metricInput('sitAndReachCm','Sit-and-reach (cm)'),
      metricInput('shoulderReach','Shoulder reach (1–10)'),
      metricInput('deepSquat','Deep squat hold (sec)'),
      metricInput('restingHr','Resting HR (bpm)'),
      metricInput('weight','Weight (lb)'),
    ]),

    el('section', {class:'card'}, [
      el('div',{class:'eyebrow'},'BUDDY DIGEST'),
      el('p',{class:'meta'}, s.profile?.buddyEmail ? `Will share with ${s.profile.buddyEmail}` : 'No buddy on file. Add one in Settings.'),
      el('button',{class:'btn primary', onclick:() => copyDigestLink()}, 'Copy weekly digest link'),
    ]),

    tabbar('#progress'),
  ]));
}

function bigStat(label, val) {
  return el('div',{class:'card stat'},[
    el('div',{class:'eyebrow'},label),
    el('div',{class:'big-num'}, val),
  ]);
}

function metricInput(metric, label) {
  const last = state.get().metrics[metric].slice(-1)[0];
  return el('div',{class:'metric-row'},[
    el('div',{class:'metric-label'}, [label, last ? el('span',{class:'metric-last'}, ` last: ${last.val}`) : null]),
    (() => {
      const i = el('input',{type:'number', placeholder:'value'});
      const b = el('button',{class:'btn small', onclick:() => { if (i.value) { state.metricAdd(metric, i.value); i.value=''; }}}, 'Log');
      return el('div',{class:'row gap-sm'},[i,b]);
    })(),
  ]);
}

function copyDigestLink() {
  const s = state.get();
  const last7 = {};
  const today = new Date();
  for (let i=6;i>=0;i--) {
    const d = new Date(today); d.setDate(d.getDate()-i);
    const iso = d.toISOString().slice(0,10);
    last7[iso] = s.days[iso] || null;
  }
  const payload = { name: s.profile?.name, days: last7, streak: state.streak(), totals: state.totals() };
  const enc = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const url = location.origin + location.pathname.replace(/index\.html?$/,'') + 'digest.html#' + enc;
  navigator.clipboard.writeText(url).then(() => {
    alert('Digest link copied. Share it with your buddy.');
  }).catch(() => {
    prompt('Copy this digest link:', url);
  });
}

// ------- Settings -------
export function renderSettings(root) {
  const s = state.get();
  root.append(el('div',{class:'screen'},[
    topbar('Settings.', 'YOU'),
    el('section',{class:'card form'},[
      el('label',{},'Name'),
      el('input',{id:'set-name', value: s.profile?.name || ''}),
      el('label',{},'Buddy email'),
      el('input',{id:'set-buddy', type:'email', value: s.profile?.buddyEmail || '', placeholder:'optional'}),
      el('label',{},'Morning ping'),
      el('input',{id:'set-morn', type:'time', value: s.settings.morningTime}),
      el('label',{},'Mid-morning ping'),
      el('input',{id:'set-mm', type:'time', value: s.settings.midMorningTime}),
      el('label',{},'Post-lunch ping'),
      el('input',{id:'set-pl', type:'time', value: s.settings.postLunchTime}),
      el('label',{},'Afternoon ping'),
      el('input',{id:'set-af', type:'time', value: s.settings.afternoonTime}),
      el('label',{},'Evening ping'),
      el('input',{id:'set-eve', type:'time', value: s.settings.eveningTime}),
      el('button',{class:'btn primary', onclick:() => {
        state.update((st) => {
          st.profile.name = $('#set-name').value;
          st.profile.buddyEmail = $('#set-buddy').value || null;
          st.settings.morningTime = $('#set-morn').value;
          st.settings.midMorningTime = $('#set-mm').value;
          st.settings.postLunchTime = $('#set-pl').value;
          st.settings.afternoonTime = $('#set-af').value;
          st.settings.eveningTime = $('#set-eve').value;
        });
        alert('Saved.');
      }}, 'Save'),
    ]),
    el('section',{class:'card'},[
      el('div',{class:'eyebrow'},'TOKENS'),
      el('div',{class:'big-num'}, s.tokensThisMonth + ' / 3'),
      el('div',{class:'meta'},'Skip tokens reset on the 1st each month.'),
    ]),
    el('section',{class:'card danger'},[
      el('div',{class:'eyebrow'},'DANGER'),
      el('button',{class:'btn ghost', onclick:() => { if(confirm('Reset everything?')){ state.reset(); location.hash='#onboard'; location.reload(); }}}, 'Reset all data'),
    ]),
    tabbar('#settings'),
  ]));
}

// SVG icons
function dot()   { return svg('<circle cx="12" cy="12" r="4" fill="currentColor"/>'); }
function bars()  { return svg('<rect x="4" y="14" width="3" height="6" fill="currentColor"/><rect x="10.5" y="9" width="3" height="11" fill="currentColor"/><rect x="17" y="4" width="3" height="16" fill="currentColor"/>'); }
function speak() { return svg('<path d="M4 6h16v10H8l-4 4z" stroke="currentColor" stroke-width="1.5" fill="none"/>'); }
function chart() { return svg('<polyline points="3,18 9,12 13,15 21,5" stroke="currentColor" stroke-width="1.8" fill="none"/>'); }
function gear()  { return svg('<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" stroke="currentColor" stroke-width="1.5"/>'); }
function svg(inner) {
  const wrap = document.createElement('div'); wrap.className='ico'; wrap.innerHTML = `<svg viewBox="0 0 24 24">${inner}</svg>`; return wrap;
}
