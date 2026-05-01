// Exercise reference library. Every term Jess uses lives here.
// Each entry: { name, summary, steps[], video{title,url,id}, illustration? }
// video.id is the YouTube ID for inline embed.

export const REFERENCE = {
  'morning-walk': {
    name: 'Morning walk',
    summary: 'Brisk walk first thing -- fasted if you can. 10 minutes is enough on day 1.',
    steps: [
      'Out the door within 10 min of waking -- sunlight on your face matters as much as the steps.',
      'Cadence: brisk = you can talk in short sentences but not sing. Around 100–110 steps/min.',
      'No phone if you can manage it. Just walk.',
      'Water when you get back.',
    ],
    video: { title: 'Why morning walks work -- Andrew Huberman', id: 'JTCF5VbjUKU' },
  },
  'pelvic-floor': {
    name: 'Pelvic floor + reverse Kegels',
    summary: 'Equal time on contraction and relaxation. Done lying, seated, then standing as you progress.',
    steps: [
      'Identify: same muscles you would use to stop the flow of urine. Don\'t practice by stopping urine -- that causes problems. Just identify.',
      'Lying on your back, knees bent. Inhale fully. As you exhale, gently contract pelvic floor for 3–5 seconds.',
      'KEY: fully relax for 3–5 seconds before the next rep. The relaxation matters as much as the squeeze.',
      'Don\'t hold breath. Don\'t squeeze glutes. Don\'t bear down.',
      '10 reps × 3 sets/day to start.',
      'Then add REVERSE Kegels: gently bear down (like you\'re blowing up a balloon below your belly button). 5 reps. This is the relaxation skill.',
    ],
    video: { title: 'Pelvic Floor for Men -- Dr. Bri', id: 'GfFHWIVwzWk' },
  },
  'mobility-flow': {
    name: 'Mobility flow (5 min)',
    summary: 'A short hip + hamstring + thoracic flow -- usually Tom Merrick or GMB Fitness.',
    steps: [
      'On the floor, mat optional.',
      'Press play and follow along -- the video is 5 minutes.',
      'Don\'t force any position. Tightness is the data, not the enemy.',
    ],
    video: { title: '5-Min Hip + Hamstring Reset -- Tom Merrick', id: 'hO5xhsDKFC8' },
  },
  'post-lunch-walk': {
    name: 'Post-lunch walk',
    summary: '10–12 min within 30 min of finishing lunch. Highest-leverage habit for blood sugar + circulation.',
    steps: [
      'Within 30 minutes of your last bite. Sooner = better.',
      'Brisk pace. Outside if possible.',
      'Even 5 minutes counts on bad days. Don\'t skip -- just shrink.',
    ],
    video: { title: '10-min walk after meals -- research summary', id: 'eTdJrMgVbSo' },
  },
  'afternoon-circulation': {
    name: 'Afternoon circulation reset',
    summary: 'A 5-min movement snack at the 4 PM slump: calf pump + hip opener + reverse Kegels.',
    steps: [
      '20 standing calf raises -- slow up, slow down. Keeps the soleus pump active for venous return.',
      '60 seconds soleus pushups (see soleus-pushup card below).',
      'Couch stretch each side: kneel with one foot up on a couch behind you, hips forward, hold 30s/side.',
      '5 reverse Kegels -- bear down gently.',
      '5 box breaths to reset.',
    ],
    video: { title: '5-min circulation reset', id: 'enYITYwvPAQ' },
  },
  'evening-walk': {
    name: 'Evening wind-down walk',
    summary: 'Easy 15-min walk after dinner. Aim for casual, not brisk.',
    steps: [
      'Within 60 min of dinner.',
      'Easy pace -- conversation pace.',
      'No phone. Look at the sky.',
    ],
    video: { title: 'After-dinner walk benefits', id: 'eTdJrMgVbSo' },
  },

  // Strength lifts
  'goblet-squat': {
    name: 'Goblet Squat',
    summary: 'Hold one DB at chest. Squat between your heels. Your foundational lower-body lift.',
    steps: [
      'Hold one DB vertically against your chest, both hands cupping the top end ("the goblet").',
      'Feet just outside shoulder-width, toes slightly out.',
      'Sit straight down -- knees track over toes, chest up.',
      'Go as deep as you can keep your back flat. Aim for thighs parallel or below over time.',
      'Stand by driving through the floor with whole foot. Squeeze glutes at top.',
    ],
    video: { title: 'Goblet Squat tutorial -- Athlean-X', id: 'MeIiIdhvXT4' },
  },
  'db-bench': {
    name: 'DB Bench Press',
    summary: 'Two DBs. Lie on the bench. Press up, lower with control.',
    steps: [
      'DBs at your sides, sit on the bench, kick them up to your chest as you lie back.',
      'Feet flat on the floor. Slight arch in lower back.',
      'Wrists stacked over elbows, DBs at mid-chest level.',
      'Press up -- full lockout, DBs end above your shoulders, not your face.',
      'Lower under control: 2-second descent.',
    ],
    video: { title: 'DB Bench Press -- Jeff Nippard', id: 'VmB1G1K7v94' },
  },
  'db-row': {
    name: 'DB Row',
    summary: 'One knee + one hand on the bench. Row the DB to your ribs.',
    steps: [
      'Place left knee + left hand on the bench. Right foot on the floor.',
      'Right hand holds DB, hanging straight down. Flat back, head neutral.',
      'Pull DB to your lower ribs -- elbow drives toward the ceiling.',
      'Squeeze shoulder blade at the top. Lower with control.',
      'Switch sides.',
    ],
    video: { title: 'DB Row -- Jeff Nippard', id: 'DMo3HJoawrU' },
  },
  'db-rdl': {
    name: 'DB Romanian Deadlift',
    summary: 'Hinge at hips. DBs slide down your legs. Hamstrings load.',
    steps: [
      'Stand tall, DBs at thighs, soft knees.',
      'Push hips back like closing a car door with your butt.',
      'DBs travel down your legs (touch them lightly).',
      'Stop when you feel hamstrings -- usually mid-shin. Don\'t round your back.',
      'Drive hips forward to stand. Squeeze glutes.',
    ],
    video: { title: 'DB RDL -- Squat University', id: '7Hkc5p7XNzU' },
  },
  'db-ohp': {
    name: 'DB Overhead Press',
    summary: 'Press DBs from shoulders to overhead. Standing or seated.',
    steps: [
      'DBs at shoulder height, palms facing forward.',
      'Brace core. Don\'t arch lower back.',
      'Press up to lockout -- DBs end above your head, slightly in front.',
      'Lower under control to start.',
    ],
    video: { title: 'DB Overhead Press -- Jeff Nippard', id: 'qEwKCR5JCog' },
  },

  // Movement-snack glossary -- every term Jess uses
  'soleus-pushup': {
    name: 'Soleus pushup',
    summary: 'Seated calf raise that activates the soleus -- clinically shown to spike metabolism while sitting.',
    steps: [
      'Sit in a chair, feet flat on the floor, knees bent at ~90°.',
      'Keeping the ball of your foot down, lift your heel as high as it will go.',
      'Lower with control. That\'s one rep.',
      'Pace: about 1 rep per second. Aim for 60 seconds at a time.',
      'You should feel the muscle just behind your shin/calf working.',
    ],
    video: { title: 'Soleus Pushup -- Marc Hamilton, U Houston', id: 'bMRR7gATiMQ' },
  },
  'calf-raise': {
    name: 'Standing calf raise',
    summary: 'Up on the balls of your feet, slow down. Calf pump for venous return.',
    steps: [
      'Stand with feet hip-width apart, near a wall or counter for balance.',
      'Lift heels -- go up onto the balls of your feet. Squeeze calves at the top.',
      'Lower slowly. 2 seconds down beats 10 fast reps.',
      '15–20 reps.',
    ],
    video: { title: 'Standing Calf Raise -- basics', id: '-M4-G8p8fmc' },
  },
  'reverse-kegel': {
    name: 'Reverse Kegel',
    summary: 'The opposite of a Kegel. Gentle bearing-down. The pelvic-floor RELAXATION skill.',
    steps: [
      'Lying or seated. Take a deep belly breath.',
      'On the exhale, gently bear down -- like you\'re blowing up a balloon below your belly button.',
      'No straining. Light pressure only.',
      'Hold 3–5 seconds. Release. 5 reps.',
      'This trains the OPPOSITE skill of a Kegel -- equally important, especially for desk-bound men.',
    ],
    video: { title: 'Reverse Kegel -- Physiotutors', id: 'F-Q0YEi8u2c' },
  },
  'hip-flexor-stretch': {
    name: 'Couch stretch (hip flexor)',
    summary: 'Single best stretch for desk-worker hip tightness.',
    steps: [
      'Kneel about 6 inches from a couch or wall, facing away.',
      'Place rear foot up on the couch, shin against the cushion.',
      'Front foot flat on the floor.',
      'Squeeze the rear glute. Push hips FORWARD. Tall chest.',
      'Hold 30–60 seconds per side. Should feel front of rear-leg hip stretching.',
    ],
    video: { title: 'Couch Stretch -- Kelly Starrett', id: 'b7ZtMonbFt4' },
  },
  'box-breath': {
    name: 'Box breathing',
    summary: '4-second inhale, 4-second hold, 4-second exhale, 4-second hold. Resets nervous system.',
    steps: [
      'Sit upright, eyes soft.',
      'Inhale through your nose for 4 seconds.',
      'Hold full for 4 seconds.',
      'Exhale through your nose for 4 seconds.',
      'Hold empty for 4 seconds.',
      'Repeat 4 rounds.',
    ],
    video: { title: 'Box Breathing -- Navy SEAL technique', id: 'tEmt1Znux58' },
  },
  'thoracic-opener': {
    name: 'Thoracic opener',
    summary: 'Open up the upper back -- counter to all the desk hunching.',
    steps: [
      'On hands and knees.',
      'Place right hand behind your head.',
      'Rotate right elbow up toward the ceiling -- eyes follow.',
      'Then thread the same elbow back UNDER your left arm.',
      '5 reps each side. Slow.',
    ],
    video: { title: 'Thread the Needle / T-spine opener', id: 'lhIFs82jNRs' },
  },
  'arm-circles': {
    name: 'Arm circles',
    summary: 'Shoulder warmup. 30 seconds each direction.',
    steps: [
      'Stand tall, arms out to sides at shoulder height.',
      '10 small circles forward, 10 medium, 10 large.',
      'Then reverse direction.',
      'Total: 30 seconds.',
    ],
    video: { title: 'Arm Circles tutorial', id: '140RTNMciH8' },
  },
  'march-in-place': {
    name: 'March in place',
    summary: 'Warmup cardio. Simple. Lift knees high.',
    steps: [
      'Stand tall.',
      'Lift left knee toward your chest. Lower. Lift right.',
      'Pump arms.',
      '60 seconds.',
    ],
    video: { title: 'March in place warmup', id: '_aS59iV4Tjs' },
  },
  'deep-squat-hold': {
    name: 'Deep squat hold',
    summary: 'Sit at the bottom of a squat. The bottom is the position -- train it.',
    steps: [
      'Feet a bit wider than shoulders, toes slightly out.',
      'Sink down -- heels stay flat, chest up, elbows can rest on inner knees.',
      'Hold the bottom. 30–60 seconds first time.',
      'Breathe normally. If heels lift, put a small book under them.',
    ],
    video: { title: 'Deep Squat Hold -- Squat University', id: 'RR1ABUuWY8E' },
  },
  'long-walk': {
    name: 'Long walk',
    summary: 'Outdoor 30–45 minute walk. Brisk first 10, easy the rest.',
    steps: [
      'Outside if weather allows.',
      'Brisk for the first 10 minutes (cadence ~110 spm).',
      'Easy/conversational the rest.',
      'No phone if you can manage it.',
    ],
    video: { title: 'Walking benefits -- Lancet 2023 summary', id: 'JTCF5VbjUKU' },
  },
  'z2-bike': {
    name: 'Zone 2 stationary bike',
    summary: 'Easy effort. RPE 3–4. You should be able to read or hold a phone call.',
    steps: [
      'Spin at a steady cadence.',
      'Effort: nasal breathing should still work. RPE 3–4 of 10.',
      'You should be able to read a chapter or hold a call.',
      'Cadence steady -- no surges, no sprints.',
      'Sip water at halfway.',
    ],
    video: { title: 'What Is Zone 2 -- Peter Attia', id: 'mfUXCx9VMYw' },
  },
  'yoga': {
    name: 'Yoga session',
    summary: 'Mat-based, 15–25 min, follow along to the linked video.',
    steps: [
      'Get a mat. Bare feet or socks off.',
      'Press play on the embedded video and follow along.',
      'Don\'t skip ahead. Don\'t force any pose.',
      'Breathe through your nose if you can.',
    ],
    video: { title: 'Yoga for Beginners -- Yoga With Adriene', id: 'v7AYKMP6rOE' },
  },
};

// Map check-in keys to reference entries (for the Today expandable rows)
export const CHECKIN_REF = {
  morningWalk:    'morning-walk',
  pelvicAM:       'pelvic-floor',
  mobilityFlow:   'mobility-flow',
  postLunchWalk:  'post-lunch-walk',
  afternoonLight: 'afternoon-circulation',
  eveningWalk:    'evening-walk',
};

// Words Jess uses in messages that should be linkable to a reference card.
export const TERMS = [
  ['soleus pushups', 'soleus-pushup'],
  ['soleus pushup',  'soleus-pushup'],
  ['calf raises',    'calf-raise'],
  ['calf raise',     'calf-raise'],
  ['reverse Kegels', 'reverse-kegel'],
  ['reverse Kegel',  'reverse-kegel'],
  ['Reverse Kegel',  'reverse-kegel'],
  ['hip flexor',     'hip-flexor-stretch'],
  ['couch stretch',  'hip-flexor-stretch'],
  ['box breath',     'box-breath'],
  ['box breaths',    'box-breath'],
  ['box breathing',  'box-breath'],
  ['goblet squat',   'goblet-squat'],
  ['Goblet Squat',   'goblet-squat'],
  ['Goblet squat',   'goblet-squat'],
  ['DB Bench',       'db-bench'],
  ['DB Row',         'db-row'],
  ['RDL',            'db-rdl'],
  ['Romanian Deadlift', 'db-rdl'],
  ['Overhead Press', 'db-ohp'],
  ['OHP',            'db-ohp'],
  ['deep squat hold','deep-squat-hold'],
  ['thoracic',       'thoracic-opener'],
  ['arm circles',    'arm-circles'],
  ['Zone 2',         'z2-bike'],
  ['Z2',             'z2-bike'],
];
