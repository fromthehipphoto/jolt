// 12-week ramp from research: gentle start, deloads at week 4, 8, 12.
// Each week defines daily session types. Day index 0=Mon ... 6=Sun.
// Sessions: 'strengthA' | 'strengthB' | 'yoga' | 'z2' | 'mobility' | 'longwalk' | 'rest'
// Each week also encodes target volumes for the workout player.

export const PROGRAM = [
  // Week 1 — establish habit. Tiny doses.
  {
    week: 1, theme: 'Show up.',
    note: "We are not training yet. We are showing up. Every session is short. Form > load > volume.",
    days: [
      { d:'Mon', main:'strengthA' }, { d:'Tue', main:'yoga' },
      { d:'Wed', main:'z2' },        { d:'Thu', main:'strengthB' },
      { d:'Fri', main:'yoga' },      { d:'Sat', main:'longwalk' },
      { d:'Sun', main:'rest' },
    ],
    targets: {
      strength: { sets: 2, reps: 8, lifts: ['Goblet Squat', 'DB Bench', 'DB Row'], loads: { 'Goblet Squat': 20, 'DB Bench': 15, 'DB Row': 15 } },
      strengthB: { sets: 2, reps: 8, lifts: ['DB Romanian Deadlift', 'DB Overhead Press', 'DB Row'], loads: { 'DB Romanian Deadlift': 20, 'DB Overhead Press': 12, 'DB Row': 15 } },
      z2_min: 15, yoga_min: 10, walk_min_morning: 10, walk_min_postlunch: 10, walk_min_postdinner: 10,
      step_target: 6000, brisk_min_target: 12,
    },
  },
  // Week 2
  { week:2, theme:'Anchor it.', note:"Same shape, slightly more time. Notice the soreness. Don't chase it.",
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:3,reps:8,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':25,'DB Bench':20,'DB Row':20}},
      strengthB:{sets:3,reps:8,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':25,'DB Overhead Press':15,'DB Row':20}},
      z2_min:18, yoga_min:12, walk_min_morning:10, walk_min_postlunch:12, walk_min_postdinner:12, step_target:6500, brisk_min_target:15 } },
  // Week 3
  { week:3, theme:'Add pressure.', note:"Loads creep up. Sets creep up. You're allowed to feel strong now.",
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:3,reps:8,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':30,'DB Bench':22.5,'DB Row':22.5}},
      strengthB:{sets:3,reps:8,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':30,'DB Overhead Press':17.5,'DB Row':22.5}},
      z2_min:22, yoga_min:15, walk_min_morning:12, walk_min_postlunch:12, walk_min_postdinner:15, step_target:7000, brisk_min_target:18 } },
  // Week 4 — deload
  { week:4, theme:'Deload.', note:"Cut volume by 30%. This is the work. It's how the body keeps up.",
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:2,reps:8,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':25,'DB Bench':20,'DB Row':20}},
      strengthB:{sets:2,reps:8,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':25,'DB Overhead Press':15,'DB Row':20}},
      z2_min:18, yoga_min:15, walk_min_morning:10, walk_min_postlunch:10, walk_min_postdinner:10, step_target:6500, brisk_min_target:15 } },
  // Week 5
  { week:5, theme:'Find your stride.',
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:3,reps:5,lifts:['Goblet Squat','DB Bench','DB Row','Pelvic Floor Set'],loads:{'Goblet Squat':35,'DB Bench':25,'DB Row':25}},
      strengthB:{sets:3,reps:5,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':35,'DB Overhead Press':20,'DB Row':25}},
      z2_min:25, yoga_min:18, walk_min_morning:12, walk_min_postlunch:12, walk_min_postdinner:15, step_target:7500, brisk_min_target:20 } },
  // Week 6
  { week:6, theme:'Yin enters.', note:"Adding longer-hold yoga. Your hips will protest. That's the point.",
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:3,reps:5,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':40,'DB Bench':27.5,'DB Row':27.5}},
      strengthB:{sets:3,reps:5,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':40,'DB Overhead Press':22.5,'DB Row':27.5}},
      z2_min:28, yoga_min:20, walk_min_morning:12, walk_min_postlunch:12, walk_min_postdinner:15, step_target:7500, brisk_min_target:22 } },
  // Week 7
  { week:7, theme:'StrongLifts feel.', note:"5×5 territory now. Familiar to you. Loads are still conservative — earn the next jump.",
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:5,reps:5,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':40,'DB Bench':30,'DB Row':27.5}},
      strengthB:{sets:5,reps:5,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':45,'DB Overhead Press':22.5,'DB Row':27.5}},
      z2_min:30, yoga_min:22, walk_min_morning:15, walk_min_postlunch:12, walk_min_postdinner:15, step_target:8000, brisk_min_target:25 } },
  // Week 8 — deload
  { week:8, theme:'Deload.', note:"Cut. Sleep. Walk. Trust the process.",
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:3,reps:5,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':35,'DB Bench':25,'DB Row':22.5}},
      strengthB:{sets:3,reps:5,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':40,'DB Overhead Press':20,'DB Row':25}},
      z2_min:25, yoga_min:22, walk_min_morning:12, walk_min_postlunch:12, walk_min_postdinner:15, step_target:7500, brisk_min_target:20 } },
  // Week 9
  { week:9, theme:'Push.',
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:5,reps:5,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':45,'DB Bench':32.5,'DB Row':30}},
      strengthB:{sets:5,reps:5,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':50,'DB Overhead Press':25,'DB Row':30}},
      z2_min:32, yoga_min:25, walk_min_morning:15, walk_min_postlunch:12, walk_min_postdinner:18, step_target:8000, brisk_min_target:28 } },
  // Week 10
  { week:10, theme:'Stack.',
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:5,reps:5,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':50,'DB Bench':35,'DB Row':32.5}},
      strengthB:{sets:5,reps:5,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':55,'DB Overhead Press':27.5,'DB Row':32.5}},
      z2_min:35, yoga_min:25, walk_min_morning:15, walk_min_postlunch:15, walk_min_postdinner:18, step_target:8500, brisk_min_target:30 } },
  // Week 11
  { week:11, theme:'Find the ceiling.', note:"This is where you find out where you are. Push the heaviest set you can do clean.",
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:5,reps:5,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':55,'DB Bench':37.5,'DB Row':35}},
      strengthB:{sets:5,reps:5,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':60,'DB Overhead Press':30,'DB Row':35}},
      z2_min:35, yoga_min:25, walk_min_morning:15, walk_min_postlunch:15, walk_min_postdinner:20, step_target:8500, brisk_min_target:30 } },
  // Week 12 — assess + deload
  { week:12, theme:'Assess.', note:"Light work. Repeat the week-1 baselines. We compare.",
    days:[ {d:'Mon',main:'strengthA'},{d:'Tue',main:'yoga'},{d:'Wed',main:'z2'},{d:'Thu',main:'strengthB'},{d:'Fri',main:'yoga'},{d:'Sat',main:'longwalk'},{d:'Sun',main:'rest'} ],
    targets:{ strength:{sets:3,reps:5,lifts:['Goblet Squat','DB Bench','DB Row'],loads:{'Goblet Squat':45,'DB Bench':32.5,'DB Row':30}},
      strengthB:{sets:3,reps:5,lifts:['DB Romanian Deadlift','DB Overhead Press','DB Row'],loads:{'DB Romanian Deadlift':50,'DB Overhead Press':25,'DB Row':30}},
      z2_min:30, yoga_min:25, walk_min_morning:15, walk_min_postlunch:15, walk_min_postdinner:18, step_target:8000, brisk_min_target:28 } },
];

export function weekFor(dayIndex) {
  // dayIndex = days since startDate
  const w = Math.min(11, Math.floor(dayIndex / 7));
  return PROGRAM[w];
}

export function dayPlan(dayIndex) {
  const w = weekFor(dayIndex);
  const dow = dayIndex % 7;
  const day = w.days[dow];
  return { week: w, dayIndex, dow, day, targets: w.targets, theme: w.theme, note: w.note };
}
