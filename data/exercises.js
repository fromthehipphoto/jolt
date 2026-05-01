// Exercise library used by the workout player. Each item has cues + a video link.
// Videos are real, established YouTube channels per the research briefs.

export const EXERCISES = {
  'Goblet Squat': {
    cues: [
      'Hold one DB at chest, elbows tucked.',
      'Feet just outside shoulders, toes slightly out.',
      'Sit straight down between your heels -- knees track over toes.',
      'Stand. Squeeze. Repeat.',
    ],
    video: { title:'Goblet Squat -- Athlean-X', url:'https://www.youtube.com/watch?v=MeIiIdhvXT4' },
  },
  'DB Bench': {
    cues: ['Lie back, feet flat. Wrists stacked over elbows.','Lower to mid-chest. Two-second descent.','Press up -- squeeze chest at the top.'],
    video: { title:'DB Bench Press -- Jeff Nippard', url:'https://www.youtube.com/watch?v=VmB1G1K7v94' },
  },
  'DB Row': {
    cues: ['Hinge at hips, flat back, one knee + hand on bench.','DB hangs from straight arm.','Row to ribs, elbow to ceiling. Squeeze.','Lower slow.'],
    video: { title:'DB Row -- Jeff Nippard', url:'https://www.youtube.com/watch?v=DMo3HJoawrU' },
  },
  'DB Romanian Deadlift': {
    cues: ['Stand, DBs at thighs.','Hinge at hips -- DBs slide down legs, knees soft.','Stop when you feel hamstrings load (around mid-shin).','Drive hips forward to stand.'],
    video: { title:'DB RDL -- Squat University', url:'https://www.youtube.com/watch?v=7Hkc5p7XNzU' },
  },
  'DB Overhead Press': {
    cues: ['Stand or seated. DBs at shoulders, palms forward.','Brace core -- press up without flaring ribs.','Lock out, lower with control.'],
    video: { title:'DB Overhead Press -- Jeff Nippard', url:'https://www.youtube.com/watch?v=qEwKCR5JCog' },
  },
  'Pelvic Floor Set': {
    cues: [
      'Lying or seated. Identify the muscles -- same ones that stop urine flow.',
      'Contract for 3–5 seconds. Don\'t hold your breath. Don\'t squeeze your glutes.',
      'Fully release for 3–5 seconds -- the relax phase matters as much as the contract.',
      '10 reps. Then 5 REVERSE Kegels -- gently bear down, like blowing up a balloon below your belly button.',
    ],
    video: { title:'Pelvic Floor for Men -- Dr. Bri', url:'https://www.youtube.com/watch?v=GfFHWIVwzWk' },
    note: 'This is identification + practice. If something feels wrong, see a pelvic floor PT.',
  },
};

export const MOBILITY_FLOWS = {
  short_5min: { title:'Hip + Hamstring Reset (5 min)', url:'https://www.youtube.com/watch?v=hO5xhsDKFC8', author:'Tom Merrick' },
  long_15min: { title:'Yoga for Beginners -- Day 1', url:'https://www.youtube.com/watch?v=v7AYKMP6rOE', author:'Yoga With Adriene' },
  long_20min: { title:'Yoga for Stiff Men', url:'https://www.youtube.com/watch?v=v7AYKMP6rOE', author:'Yoga With Adriene' },
  long_25min: { title:'Yin Yoga for Hips', url:'https://www.youtube.com/watch?v=DKbE9iQXgB8', author:'Yoga With Bird' },
  midday_circ: { title:'5-Min Circulation Reset', url:'https://www.youtube.com/watch?v=enYITYwvPAQ', author:'GMB Fitness' },
};
