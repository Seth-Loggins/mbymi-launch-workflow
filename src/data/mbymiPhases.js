// Maps process groups into macro-phases for the top chip nav.
// Process group labels match the strings in mbymiLaunch.js exactly.
//
// As of the 2026-05-30 restructure: 10 phases, one process group per phase
// (except Plan and Waitlist which each bundle a few related groups).

export const mbymiPhases = [
  {
    id: 'plan',
    label: 'Plan',
    short: 'PLAN',
    blurb: 'Decide the offer, the audience, and the framework.',
    groups: ['Dream It', 'Map It', 'Book It'],
  },
  {
    id: 'waitlist',
    label: 'Waitlist',
    short: 'WAITLIST',
    blurb: 'Stand up the priority waitlist, FB group, and Day 0–10 nurture emails.',
    groups: ['Priority Waitlist Registration', 'Facebook Group Creation', 'Waitlist'],
  },
  {
    id: 'promo',
    label: 'Promo',
    short: 'PROMO',
    blurb: 'Pick channels, write the promo copy, get it scheduled.',
    groups: ['Promote Priority Waitlist'],
  },
  {
    id: 'offer',
    label: 'Offer',
    short: 'OFFER',
    blurb: 'Define the founding-member offer and outline the deliverable.',
    groups: ['Create Your Product'],
  },
  {
    id: 'pay',
    label: 'Payment + Delivery',
    short: 'PAY + DELIVERY',
    blurb: 'Build the checkout, payment, thank-you, members portal, and sales page.',
    groups: ['Payment + Delivery'],
  },
  {
    id: 'flash',
    label: 'Flash Sale',
    short: 'FLASH SALE',
    blurb: 'Write and send the 48–72 hour flash sale push.',
    groups: ['Flash Sale'],
  },
  {
    id: 'webinar',
    label: 'Webinar',
    short: 'WEBINAR',
    blurb: 'Plan, promote, and deliver the webinar pitch.',
    groups: ['Webinar'],
  },
  {
    id: 'follow-up',
    label: 'Follow Up',
    short: 'FOLLOW UP',
    blurb: 'Run the 4–7 day post-webinar follow-up email sequence.',
    groups: ['4-Day Follow-Up'],
  },
  {
    id: 'close',
    label: 'Close Cart',
    short: 'CLOSE CART',
    blurb: 'Send the cart-close email and shut the doors.',
    groups: ['Close Day'],
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
