import * as state from './state.js';
import { go } from './router.js';
import { dayPlan, PROGRAM } from '../data/program.js';
import { EXERCISES, MOBILITY_FLOWS } from '../data/exercises.js';
import { SESSION_LABELS, SESSION_INTROS } from '../data/scripts.js';
import { REFERENCE, CHECKIN_REF, TERMS } from '../data/reference.js';
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

// ---------- Brand mark ----------
function joltLogo(size = 22) {
  const svg = `<svg viewBox="0 0 24 36" width="${size}" height="${Math.round(size*1.5)}" aria-hidden="true">
    <polygon points="12,1 19,1 13,15 21,15 8,35 14,19 5,19" fill="currentColor"/>
  </svg>`;
  return el('span', { class: 'logo-mark', html: svg });
}

// ---------- Tabbar ----------
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

function topbar(title, sub) {
  return el('header', {class:'topbar'}, [
    el('div', {class:'topbar-row'}, [
      el('div', {class:'eyebrow'}, sub || ''),
      el('h1', {}, title),
    ]),
  ]);
}

// ---------- Onboarding ----------
export function renderOnboarding(root) {
  const s = state.get();
  root.append(el('div', {class:'onboard'}, [
    el('div', {class:'hero hero-onboard photo-hero'}, [
      el('div', {class:'hero-photo', style:'background-image:url(./img/hero-onboard.jpg)'}),
      el('div', {class:'hero-photo-overlay'}),
      el('div', {class:'hero-text'}, [
        el('div', {class:'wordmark'}, [joltLogo(20), el('span',{class:'wordmark-text'}, 'Jolt')]),
        el('h1', {}, 'You showed up.'),
        el('p', {class:'lede'}, "I'm Jess. I'll handle the plan. You handle the work. We'll start small."),
      ]),
    ]),
    el('div', {class:'card form'}, [
      el('label', {}, 'What should I call you?'),
      el('input', { id:'on-name', placeholder:'Danny', value: s.profile?.name || 'Danny' }),
      el('label', {}, 'Weight (lb)'),
      el('input', { id:'on-weight', type:'number', value: s.profile?.weightLb || 152 }),
      el('label', {}, 'Height (in)'),
      el('input', { id:'on-height', type:'number', value: s.profile?.heightIn || 70 }),
      el('label', {}, 'Buddy email (optional -- for weekly digest)'),
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
      el('p', {class:'fineprint'}, "Everything stays on this device. We'll show you what's saved on the Progress screen."),
    ]),
  ]));
}

// ---------- Today ----------
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

  root.append(el('div', {class:'screen'}, [
    el('div', {class:'hero photo-hero'}, [
      el('div', {class:'hero-photo', style:'background-image:url(./img/jess-portrait.jpg)'}),
      el('div', {class:'hero-photo-overlay'}),
      el('div', {class:'hero-text hero-text-photo'}, [
        el('div', {class:'eyebrow'}, `Week ${plan.week.week} · ${plan.week.theme}`),
        el('h1', {}, heroTitle),
        el('p', {class:'lede'}, latestJessLine() || (plan.note || SESSION_INTROS[sessionKey])),
      ]),
      el('div', {class:'hero-meta'}, [
        statBadge('STREAK', state.streak() + 'd'),
        statBadge('TOKENS', tokensLeft + ' left'),
        statBadge('DAY', (di+1) + ' / 84'),
      ]),
    ]),

    el('section', {class:'card session-card'}, [
      el('div', {class:'session-row'}, [
        el('div', {}, [
          el('div', {class:'eyebrow'}, "TODAY'S MAIN"),
          el('div', {class:'session-title'}, sessionLabel),
        ]),
        sessionKey !== 'rest'
          ? el('button', { class:'btn primary', onclick:() => go(`#workout/${sessionKey}`) }, 'Start →')
          : el('button', {class:'btn ghost', disabled:true}, 'Take it easy'),
      ]),
    ]),

    el('section', {class:'tasks'}, [
      el('div', {class:'eyebrow'}, "TODAY'S CHECK-INS"),
      el('p', {class:'tasks-help'}, 'Tap a row to expand instructions. Tap the circle to mark done. Un-checking reverses the count.'),
      ...buildDailyTaskList(plan).map((t) => taskRow(t, day)),
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
      el('div', {class:'eyebrow'}, "JESS'S LATEST"),
      el('div', {class:'jess-quote'}, latestJessLine()),
      el('a', {href:'#jess', class:'btn ghost'}, 'Open thread →'),
    ]),

    tabbar('#today'),
  ]));
}

function buildDailyTaskList(plan) {
  const t = plan.targets;
  return [
    { key:'morningWalk',    label:'Morning walk',                  detail:`${t.walk_min_morning} min, brisk`, refId:'morning-walk',          contribution:{ steps: Math.round(t.walk_min_morning*105), briskMin: t.walk_min_morning } },
    { key:'pelvicAM',       label:'Pelvic floor + reverse Kegels', detail:'10 reps × 3 sets, lying',           refId:'pelvic-floor',           contribution:{} },
    { key:'mainSession',    label:`Main: ${SESSION_LABELS[plan.day.main]}`, detail: plan.day.main==='rest' ? 'rest' : 'tap Start above', refId: mainRefFor(plan.day.main), contribution:{} },
    { key:'mobilityFlow',   label:'Mobility (5 min)',              detail:'short hip + hamstring flow',         refId:'mobility-flow',          contribution:{ yogaMin: 5 } },
    { key:'postLunchWalk',  label:'Post-lunch walk',               detail:`${t.walk_min_postlunch} min`,        refId:'post-lunch-walk',        contribution:{ steps: Math.round(t.walk_min_postlunch*105), briskMin: t.walk_min_postlunch } },
    { key:'afternoonLight', label:'Afternoon circulation',         detail:'5-min movement snack',                refId:'afternoon-circulation',  contribution:{} },
    { key:'eveningWalk',    label:'Evening wind-down walk',        detail:`${t.walk_min_postdinner} min, easy`, refId:'evening-walk',           contribution:{ steps: Math.round(t.walk_min_postdinner*105), briskMin: 0 } },
  ];
}

function mainRefFor(sessionKey) {
  return ({
    strengthA: 'goblet-squat', strengthB: 'db-rdl', yoga: 'yoga', z2: 'z2-bike', longwalk: 'long-walk', rest: null,
  })[sessionKey] || null;
}

function taskRow(t, day) {
  const done = !!day.checks[t.key];
  const ref = t.refId ? REFERENCE[t.refId] : null;

  const checkBtn = el('button', {
    class:'check-btn',
    'aria-label': done ? 'Mark not done' : 'Mark done',
    onclick: (e) => {
      e.stopPropagation();
      state.setCheck(state.todayISO(), t.key, !done, t.contribution || {});
    },
  }, done ? '✓' : '');

  const head = el('div', {class:'task-head', onclick: (ev) => {
    // Toggle expand
    const card = ev.currentTarget.closest('.task-card');
    card.classList.toggle('open');
  }}, [
    checkBtn,
    el('div', {class:'task-text'}, [
      el('div', {class:'task-label'}, t.label),
      el('div', {class:'task-meta'}, t.detail),
    ]),
    el('span', {class:'caret'}, '⌄'),
  ]);

  const body = ref ? el('div', {class:'task-body'}, [
    el('p', {class:'ref-summary'}, ref.summary),
    el('div', {class:'eyebrow'}, 'HOW'),
    el('ol', {class:'ref-steps'}, ref.steps.map((s) => el('li', {}, s))),
    embedYouTube(ref.video.id, ref.video.title),
    el('div', {class:'task-actions'}, [
      el('button', {class:'btn primary small', onclick: () => {
        if (!day.checks[t.key]) state.setCheck(state.todayISO(), t.key, true, t.contribution || {});
        else state.setCheck(state.todayISO(), t.key, false, t.contribution || {});
      }}, done ? 'Mark not done' : 'Mark done'),
    ]),
  ]) : el('div', {class:'task-body'}, [el('p', {}, 'Open the main workout above for instructions.')]);

  return el('div', {class:'task-card' + (done ? ' done' : '')}, [head, body]);
}

function quickWalk(min, brisk) {
  const today = state.todayISO();
  state.ensureDay(today);
  state.update((s) => {
    s.days[today].steps += Math.round(min * 105);
    if (brisk) s.days[today].briskMin += min;
  });
}

function stepBar(val, target) {
  const pct = Math.min(100, Math.round((val/target)*100));
  return el('div', {class:'bar'}, [el('div', {class:'bar-fill', style:`width:${pct}%`})]);
}

function statBadge(label, val) {
  return el('div', {class:'badge'}, [el('div',{class:'badge-l'},label), el('div',{class:'badge-v'},val)]);
}

function latestJessLine() {
  const s = state.get();
  const last = [...s.messages].reverse().find((m) => m.role==='jess' && m.kind !== 'milestone');
  return last?.text || "I'll write to you in the morning.";
}

// ---------- Embedded YouTube ----------
function embedYouTube(id, title) {
  const wrap = el('div', {class:'yt-wrap'}, [
    el('div', {class:'yt-frame'}, [
      el('iframe', {
        src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
        title: title || 'video',
        frameborder: '0',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        referrerpolicy: 'strict-origin-when-cross-origin',
        allowfullscreen: true,
        loading: 'lazy',
      })
    ]),
    el('div', {class:'yt-caption'}, title),
  ]);
  return wrap;
}

// ---------- Workout Player ----------
export function renderWorkout(root, sessionKey) {
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
    const refId = liftToRef(lift);
    const ref = REFERENCE[refId];
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
      el('p', {class:'ref-summary'}, ref?.summary || ''),
      el('ol', {class:'ref-steps'}, (ref?.steps || []).map((s) => el('li',{},s))),
      ref?.video ? embedYouTube(ref.video.id, ref.video.title) : null,
      setRow,
    ]);
  });

  root.append(el('div',{class:'screen'},[
    el('div', {class:'topbar'}, [
      el('a', {href:'#today', class:'back'}, '← Back'),
      el('div', {class:'eyebrow'}, `Week ${plan.week.week} · ${SESSION_LABELS[key]}`),
      el('h1', {}, 'Lift.'),
    ]),

    el('section', {class:'hero photo-hero hero-compact'}, [
      el('div', {class:'hero-photo', style:'background-image:url(./img/scene-strength.jpg)'}),
      el('div', {class:'hero-photo-overlay'}),
      el('div', {class:'hero-text'}, [
        el('p', {class:'lede'}, "Form before load. Two seconds down on every rep. Earn the next set."),
      ]),
    ]),

    el('section', {class:'card warmup'}, [
      el('div', {class:'eyebrow'}, 'WARMUP -- 4 MIN'),
      el('div', {}, '1 min march · 30 s arm circles · 30 s deep squat hold · 1 min hip flexor stretch · 1 min thoracic openers'),
    ]),
    ...liftCards,
    el('section', {class:'card lift-card'}, [
      el('div', {class:'lift-head'}, [el('h2', {}, 'Pelvic Floor -- finisher')]),
      el('p', {class:'ref-summary'}, REFERENCE['pelvic-floor'].summary),
      el('ol', {class:'ref-steps'}, REFERENCE['pelvic-floor'].steps.map((s) => el('li',{},s))),
      embedYouTube(REFERENCE['pelvic-floor'].video.id, REFERENCE['pelvic-floor'].video.title),
      el('button', {class:'set-btn', onclick: (e) => {
        state.setCheck(today, 'pelvicAM', true);
        e.target.classList.add('done'); e.target.textContent = '✓ Pelvic floor logged';
      }}, 'Tap when done'),
    ]),
    el('button', { class:'btn primary big', onclick:() => {
      state.setCheck(today, 'mainSession', true);
      go('#today');
    }}, 'Finish session'),
  ]));
}

function liftToRef(lift) {
  return ({
    'Goblet Squat':'goblet-squat',
    'DB Bench':'db-bench',
    'DB Row':'db-row',
    'DB Romanian Deadlift':'db-rdl',
    'DB Overhead Press':'db-ohp',
    'Pelvic Floor Set':'pelvic-floor',
  })[lift] || null;
}

function renderYoga(root, plan) {
  const today = state.todayISO();
  const min = plan.targets.yoga_min;
  const flow = pickYogaFlow(min);
  const id = ytIdFromUrl(flow.url);
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
      el('div', {class:'eyebrow'}, 'FOLLOW ALONG'),
      embedYouTube(id, flow.title),
      el('div', {class:'meta'}, flow.author),
    ]),
    el('section', {class:'card timer-card'}, [
      el('div', {class:'eyebrow'}, `${min}-MIN TIMER`),
      timerEl,
      (() => { const b = el('button',{class:'btn primary', onclick:()=>toggle(b)}, 'Start'); return b; })(),
    ]),
    el('button', {class:'btn primary big', onclick:() => {
      state.logYoga(today, min);
      state.setCheck(today,'mainSession',true);
      state.setCheck(today,'mobilityFlow',true);
      go('#today');
    }}, 'Mark complete'),
  ]));
}

function ytIdFromUrl(url) {
  try {
    const u = new URL(url);
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
  } catch (e) {}
  return 'v7AYKMP6rOE';
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
  const ref = REFERENCE['z2-bike'];

  root.append(el('div',{class:'screen'},[
    el('div',{class:'topbar'},[ el('a',{href:'#today',class:'back'},'← Back'), el('h1',{},'Zone 2 bike.') ]),
    el('section',{class:'card'},[
      el('div',{class:'eyebrow'},'EFFORT'),
      el('p',{class:'ref-summary'}, ref.summary),
      el('ol',{class:'ref-steps'}, ref.steps.map((s) => el('li',{},s))),
      embedYouTube(ref.video.id, ref.video.title),
      el('div',{class:'eyebrow'}, `${min}-MIN TIMER`),
      timerEl,
      (() => { const b = el('button',{class:'btn primary', onclick:()=>toggle(b)},'Start'); return b; })(),
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
  const ref = REFERENCE['long-walk'];

  root.append(el('div',{class:'screen'},[
    el('div',{class:'topbar'},[ el('a',{href:'#today',class:'back'},'← Back'), el('h1',{},'Long walk.') ]),
    el('section', {class:'hero photo-hero hero-compact'}, [
      el('div', {class:'hero-photo', style:'background-image:url(./img/scene-walk.jpg)'}),
      el('div', {class:'hero-photo-overlay'}),
      el('div', {class:'hero-text'}, [el('p', {class:'lede'}, ref.summary)]),
    ]),
    el('section',{class:'card'},[
      el('ol',{class:'ref-steps'}, ref.steps.map((s) => el('li',{},s))),
      timerEl,
      (() => { const b=el('button',{class:'btn primary',onclick:()=>toggle(b)},'Start'); return b; })(),
    ]),
    el('button',{class:'btn primary big', onclick:()=>{ state.logWalk(today,min,true); state.setCheck(today,'mainSession',true); state.setCheck(today,'morningWalk',true); go('#today'); }},'Mark complete'),
  ]));
}

function fmtMM(s) { s = Math.max(0,s); const m = Math.floor(s/60), r = s%60; return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; }

// ---------- Programs (rotated to start on user start day) ----------
export function renderPrograms(root) {
  const di = state.dayIndex();
  const cur = Math.floor(di/7);
  const startDate = state.get().profile?.startDate;
  const startDow = startDate ? new Date(startDate + 'T00:00:00').getDay() : 1; // 0=Sun, 1=Mon, ..., 6=Sat
  const dowLetters = ['S','M','T','W','T','F','S'];

  root.append(el('div',{class:'screen'},[
    topbar('The 12 weeks.', 'PROGRAM'),
    el('p', {class:'sub-help'}, "Each week starts on your start day. Today's the brass-edged card."),
    el('section', {class:'weeks'}, PROGRAM.map((w, i) => el('div', {class:'week-card' + (i===cur?' current':'')}, [
      el('div', {class:'week-head'}, [
        el('div', {class:'week-num'}, `WEEK ${w.week}`),
        i===cur ? el('div', {class:'week-tag'}, 'NOW') : null,
      ]),
      el('div', {class:'week-theme'}, w.theme),
      el('div', {class:'week-grid'}, w.days.map((d, idx) => {
        const dowIndex = (startDow + idx) % 7;
        const date = startDate ? addDays(startDate, i*7 + idx) : null;
        const isToday = (i*7 + idx) === di;
        return el('div', {class:'week-day' + (isToday ? ' today' : '')}, [
          el('div', {class:'week-dow'}, dowLetters[dowIndex]),
          date ? el('div', {class:'week-date'}, date.getDate()) : null,
          el('div', {class:'week-main'}, SESSION_LABELS[d.main]),
        ]);
      })),
    ]))),
    tabbar('#programs'),
  ]));
}

function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d;
}

// ---------- Jess thread ----------
export function renderJess(root) {
  tickMessages();
  const s = state.get();
  const messages = s.messages.slice(-50);
  root.append(el('div',{class:'screen jess-screen'},[
    el('header',{class:'topbar jess-topbar'}, [
      el('div', {class:'avatar avatar-photo', style:'background-image:url(./img/jess-portrait.jpg)'}),
      el('div',{}, [
        el('div',{class:'jess-name'},'Jess'),
        el('div',{class:'jess-sub'}, `Day ${state.dayIndex()+1} · ${state.streak()}d streak`),
      ]),
    ]),
    el('section',{class:'thread'}, messages.length === 0 ? [
      el('div',{class:'thread-empty'},"I'll write to you in the morning."),
    ] : messages.map((m) => bubbleEl(m))),
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

function bubbleEl(m) {
  const div = el('div', {class:`bubble ${m.role}`});
  if (m.role === 'jess') {
    // Linkify any reference terms
    const linked = linkifyTerms(m.text);
    div.append(linked);
  } else {
    div.textContent = m.text;
  }
  return div;
}

function linkifyTerms(text) {
  const frag = document.createDocumentFragment();
  let cursor = 0;
  const sorted = [...TERMS].sort((a, b) => b[0].length - a[0].length);
  const pattern = sorted.map(([t]) => escapeRegex(t)).join('|');
  if (!pattern) { frag.append(text); return frag; }
  const re = new RegExp(`(${pattern})`, 'gi');
  let m;
  while ((m = re.exec(text)) !== null) {
    const idx = m.index;
    if (idx > cursor) frag.append(text.slice(cursor, idx));
    const matched = m[0];
    const lc = matched.toLowerCase();
    const refId = sorted.find(([t]) => t.toLowerCase() === lc)?.[1];
    const span = el('span', { class:'ref-link', onclick: () => openRefModal(refId) }, matched);
    frag.append(span);
    cursor = idx + matched.length;
  }
  if (cursor < text.length) frag.append(text.slice(cursor));
  return frag;
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// ---------- Reference modal ----------
function openRefModal(refId) {
  const ref = REFERENCE[refId];
  if (!ref) return;
  const overlay = el('div', {class:'modal-overlay', onclick: (e) => {
    if (e.target === overlay) closeModal(overlay);
  }}, [
    el('div', {class:'modal'}, [
      el('div', {class:'modal-head'}, [
        el('div', {}, [
          el('div', {class:'eyebrow'}, 'REFERENCE'),
          el('h2', {}, ref.name),
        ]),
        el('button', {class:'btn small ghost', onclick: () => closeModal(overlay)}, 'Close'),
      ]),
      el('p', {class:'ref-summary'}, ref.summary),
      el('div', {class:'eyebrow'}, 'HOW'),
      el('ol', {class:'ref-steps'}, ref.steps.map((s) => el('li', {}, s))),
      embedYouTube(ref.video.id, ref.video.title),
    ]),
  ]);
  document.body.append(overlay);
  setTimeout(() => overlay.classList.add('on'), 10);
}

function closeModal(overlay) {
  overlay.classList.remove('on');
  setTimeout(() => overlay.remove(), 200);
}

function replyChip(text) {
  return el('button', {class:'chip', onclick:() => {
    state.addMessage('you', text, 'reply');
    if (text.startsWith('Need')) {
      const ok = state.spendToken();
      if (ok) {
        const today = state.todayISO();
        state.update((s) => { if (s.days[today]) s.days[today].tokenUsed = true; });
        state.addMessage('jess', "Token spent. No streak break. Tomorrow we go.", 'token');
      } else {
        state.addMessage('jess', "Out of tokens this month. The streak will pause -- comeback streaks count too.", 'token');
      }
    }
    if (text.startsWith("I'm back")) postComeback();
  }}, text);
}

// ---------- Progress ----------
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

  const lastSaved = new Date(state.lastSavedAt());

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
      el('div',{class:'eyebrow'},'WEEKLY METRICS -- log when ready'),
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

    el('section', {class:'card'}, [
      el('div',{class:'eyebrow'},'STORAGE'),
      el('div',{class:'meta'}, `${Object.keys(s.days).length} days logged · last saved ${lastSaved.toLocaleString()} · stored on this device`),
      el('div',{class:'row gap-sm', style:'margin-top:10px;'}, [
        el('button', {class:'btn small', onclick: () => downloadJSON()}, 'Export JSON'),
      ]),
    ]),

    tabbar('#progress'),
  ]));
}

function bigStat(label, val) {
  return el('div',{class:'card stat'},[el('div',{class:'eyebrow'},label), el('div',{class:'big-num'}, val)]);
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
  navigator.clipboard.writeText(url).then(() => alert('Digest link copied. Share it with your buddy.'))
    .catch(() => prompt('Copy this digest link:', url));
}

function downloadJSON() {
  const blob = new Blob([state.exportJSON()], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: `jolt-${state.todayISO()}.json` });
  document.body.append(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 500);
}

// ---------- Settings ----------
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

// ---------- icons ----------
function dot()   { return svgwrap('<circle cx="12" cy="12" r="4" fill="currentColor"/>'); }
function bars()  { return svgwrap('<rect x="4" y="14" width="3" height="6" fill="currentColor"/><rect x="10.5" y="9" width="3" height="11" fill="currentColor"/><rect x="17" y="4" width="3" height="16" fill="currentColor"/>'); }
function speak() { return svgwrap('<path d="M4 6h16v10H8l-4 4z" stroke="currentColor" stroke-width="1.5" fill="none"/>'); }
function chart() { return svgwrap('<polyline points="3,18 9,12 13,15 21,5" stroke="currentColor" stroke-width="1.8" fill="none"/>'); }
function gear()  { return svgwrap('<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" stroke="currentColor" stroke-width="1.5"/>'); }
function svgwrap(inner) {
  const wrap = document.createElement('div'); wrap.className='ico'; wrap.innerHTML = `<svg viewBox="0 0 24 24">${inner}</svg>`; return wrap;
}
