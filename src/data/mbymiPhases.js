// Maps the 15 MBYMI process groups into 6 macro-phases for the top chip nav.
// Process group labels match the strings in mbymiLaunch.js exactly.

export const mbymiPhases = [
  {
    id: 'plan',
    label: 'Plan',
    short: 'PLAN',
    blurb: 'Decide the offer, the audience, and the framework.',
    groups: ['Dream It', 'Map It', 'Book It'],
  },
  {
    id: 'build',
    label: 'Build',
    short: 'BUILD',
    blurb: 'Stand up the waitlist mechanics, group, and product outline.',
    groups: [
      'Chunk It',
      'Priority Waitlist Registration',
      'Facebook Group Creation',
      'Create Your Product',
    ],
  },
  {
    id: 'nurture',
    label: 'Nurture',
    short: 'NURTURE',
    blurb: 'Write the waitlist sequence and promote the priority list.',
    groups: ['Waitlist', 'Promote Priority Waitlist'],
  },
  {
    id: 'sell',
    label: 'Launch Week',
    short: 'LAUNCH WEEK',
    blurb: 'Stand up the checkout + sales page, run the flash sale, deliver the webinar.',
    groups: ['Payment + Delivery', 'Flash Sale', 'Webinar'],
  },
  {
    id: 'close',
    label: 'Close',
    short: 'CLOSE',
    blurb: 'Run the 4-day follow-up and close the cart.',
    groups: ['4-Day Follow-Up', 'Close Day'],
  },
  {
    id: 'debrief',
    label: 'Debrief',
    short: 'DEBRIEF',
    blurb: 'Pull the lessons out of the launch for next time.',
    groups: ['Launch Debrief'],
  },
];

// Reverse lookup: process group label → phase id.
export const processToPhase = mbymiPhases.reduce((acc, phase) => {
  phase.groups.forEach((g) => {
    acc[g] = phase.id;
  });
  return acc;
}, {});

export function getPhase(id) {
  return mbymiPhases.find((p) => p.id === id) ?? null;
}
