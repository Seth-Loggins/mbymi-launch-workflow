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
    doneTitle: 'Your launch plan is done! Nice work!',
    doneBlurb:
      "You've just planned your launch and locked in your key dates. Now it's time to get to work.",
    groups: ['Foundations', 'Dream It', 'Book It'],
  },
  {
    id: 'waitlist',
    label: 'Priority Waitlist',
    short: 'PRIORITY WAITLIST',
    blurb: 'Build out the priority waitlist opt-in, thank-you page, CRM, and confirmation email.',
    doneTitle: 'Priority Waitlist is done! Nice work!',
    doneBlurb:
      "You've built out the priority waitlist opt-in, thank-you page, CRM, and confirmation email.",
    groups: ['Priority Waitlist Registration'],
  },
  {
    id: 'fb-group',
    label: 'FB Group',
    short: 'FB GROUP',
    blurb: 'Optionally spin up a Facebook Group to engage your waitlist before launch.',
    doneTitle: 'FB Group is done! Nice work!',
    doneBlurb:
      "Whether you created a group or skipped it, you're good to keep moving. It's an optional tool for engaging your waitlist before launch.",
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
    doneBlurb:
      "You're going to want to post as frequently as you can with the goal of filling that priority waitlist. For some people this happens in a few days, other people it takes a few weeks. While you're posting content and promoting your waitlist, there is other work to be doing. Click the button below to keep going.",
    nextLabel: 'Offer Creation',
    groups: ['Promote Priority Waitlist'],
  },
  {
    id: 'offer',
    label: 'Offer',
    short: 'OFFER',
    blurb: 'Define the founding-member offer and outline the deliverable.',
    doneTitle: 'Your Beta Offer is Done! Nice Work!',
    doneBlurb:
      'This is all you need to get your Beta Launched and out in the world. Now we have to get to work building out the payment delivery process.',
    groups: ['Create Your Product'],
  },
  {
    id: 'pay',
    label: 'Payment + Delivery',
    short: 'PAY + DELIVERY',
    blurb: 'Build the checkout, payment, thank-you, members portal, and sales page.',
    doneBlurb: 'You built the checkout, payment, thank-you, members portal, and sales page',
    groups: ['Payment + Delivery'],
  },
  {
    id: 'flash',
    label: 'Flash Sale',
    short: 'FLASH SALE',
    blurb: 'Write and send the 48–72 hour flash sale push.',
    doneTitle: 'Flash Sale Emails Are Done! Nice work!',
    doneBlurb:
      "Now your only job is to send them to your Beta and fill it. If you still haven't filled your Beta after the flash sale, click the button below to start Phase 3 with the Optional Webinar.",
    groups: ['Flash Sale'],
  },
  {
    id: 'webinar',
    label: 'Webinar',
    short: 'WEBINAR',
    blurb: 'Plan, promote, and deliver the webinar pitch.',
    doneTitle: 'Webinar is done! Nice work!',
    doneBlurb: 'You planned, promoted, and delivered the webinar pitch.',
    groups: ['Webinar'],
  },
  {
    id: 'follow-up',
    label: 'Follow Up',
    short: 'FOLLOW UP',
    blurb: 'Run the 4–7 day post-webinar follow-up email sequence.',
    doneBlurb:
      "If you've sent out your form, 4-7 day post-webinar follow-up sequence, you've successfully completed this step. If you want to deploy one final email that communicates a deadline and shuts this down for good, click the button below.",
    nextLabel: 'Cart Close Day Email',
    groups: ['4-Day Follow-Up'],
  },
  {
    id: 'close',
    label: 'Close Cart',
    short: 'CLOSE CART',
    blurb: 'Send the cart-close email and shut the doors.',
    doneBlurb:
      'If you followed every single step in this process, you have fully executed the entire Monetize Before You Make It process. Congratulations. The only thing left to do is to start your debrief.',
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
