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
    blurb: 'Plan your beta launch and lock in the key dates.',
    groups: ['Foundations', 'Dream It', 'Book It'],
  },
  {
    id: 'waitlist',
    label: 'Priority Waitlist',
    short: 'PRIORITY WAITLIST',
    blurb: 'Build out the priority waitlist opt-in, thank-you page, CRM, and confirmation email.',
    groups: ['Priority Waitlist Registration'],
  },
  {
    id: 'fb-group',
    label: 'FB Group',
    short: 'FB GROUP',
    blurb: 'Optionally spin up a Facebook Group to engage your waitlist before launch.',
    groups: ['Facebook Group Creation'],
  },
  {
    id: 'waitlist-emails',
    label: 'Waitlist Emails',
    short: 'WAITLIST EMAILS',
    blurb: 'Write the simple Day 0–10 autoresponder sequence that keeps your waitlist engaged.',
    groups: ['Waitlist Emails'],
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
