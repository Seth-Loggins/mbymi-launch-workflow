// MBYMI (Monetize Before You Make It) — launch process task data
// ---------------------------------------------------------------
// Task names are James's EXACT wording from the Notion board — do not rewrite them.
// Process groups are in James's framework order. Tasks within a group are in the
// top-to-bottom order shown in the Notion board.
//
// VERIFY BEFORE RELYING ON THIS FILE:
// A few Process group labels were truncated in the source screenshot. Best-guess
// expansions are marked below with "// verify". Check these against Notion and the
// within-group task order, then correct this one file. Nothing else needs to change.

const processGroups = [
  {
    process: "Dream It",
    tasks: [
      "The # People Needed in Your Launch List",
      "The Founding Member Price Point",
      "The # of Founding Members You'll Accept",
    ],
  },
  {
    process: "Map It",
    tasks: [
      "Phase 1: Momentum to Offer",
      "Phase 2: Announcing your Beta Program",
    ],
  },
  {
    process: "Book It",
    tasks: [
      "Content-Posting Schedule (to build Priority List)",
      "Deadline to register (optional)",
      "All Follow-Up Announcements on Beta Offer",
      "Initial Announcement of Beta Offer",
    ],
  },
  {
    process: "Chunk It",
    tasks: [
      "Launch Debrief",
      "Close Day",
      "4-Day Follow-Up",
      "Rock Your Webinars! (Optional)",
      "Flash Sale",
      "Payment + Delivery Process",
      "Create Your Product Outline",
      'Promote "PRIORITY WAITLIST"',
      "PRIORITY Waitlist Follow-Up Emails",
      "Facebook Group Creation (optional)",
      'Create "Early-Interest" PRIORITY LIST Opt-in Page',
    ],
  },
  {
    process: "Priority Waitlist Registration", // verify exact label
    tasks: [
      "Create Priority Waitlist Opt-In Page",
      "Create Thank You / Redirect Page",
      "Connect CRM to Priority Waitlist Form",
      "Create Priority Waitlist Confirmation Email",
    ],
  },
  {
    process: "Facebook Group Creation", // verify exact label
    tasks: [
      "Set Up Facebook Group",
      "Engage Audience & Run FB Lives in Group",
    ],
  },
  {
    process: "Waitlist",
    tasks: [
      "Write Day 0 Thank You Email",
      "Write Day 2 Origin Story Email",
      "Write Day 4 Industry Stats/Trends Email",
      "Write Day 6-10 Case Study Email(s)",
    ],
  },
  {
    process: "Promote Priority Waitlist", // verify exact label
    tasks: [
      "Choose Promotion Channels (Podcast/Social/Email)",
      "Create Promotion Content Using Copy Formula",
      "Schedule & Post Promotion Content",
    ],
  },
  {
    process: "Create Your Product", // verify exact label
    tasks: [
      "Define Offer Promise, Deliverables & Price",
      "Build Full Course Outline / Agenda",
      "Create Welcome Video/Tutorial for Members",
    ],
  },
  {
    process: "Payment + Delivery", // verify exact label
    tasks: [
      "Create Checkout Page",
      "Create Post-Purchase Thank You Confirmation Page",
      "Build Members-Only Course Portal (Kajabi)",
      "Creating Your Sales Page",
      "Connect to Payment Process",
    ],
  },
  {
    process: "Flash Sale",
    tasks: [
      "Write Flash Sale Announcement Email",
      "Send Flash Sale Emails to Waitlist",
    ],
  },
  {
    process: "Webinar",
    tasks: [
      "Create & Promote Webinar",
      "Deliver Webinar & Pitch Beta Offer",
    ],
  },
  {
    process: "4-Day Follow-Up",
    tasks: [
      "Connect Payment Processor (Stripe/PayPal)",
      "Write 4-7 Day Follow-Up Email Sequence",
      "Send Follow-Up Sequence",
    ],
  },
  {
    process: "Close Day",
    tasks: [
      "Send Cart Close Day Email",
    ],
  },
  {
    process: "Launch Debrief",
    tasks: [
      "Complete Launch Debrief Analysis",
    ],
  },
];

// The ordered list of process group labels (used by the progress header / section order).
export const mbymiProcessOrder = processGroups.map((g) => g.process);

// The flat task list the app uses. `order` is the master sequence (1..50) and defines
// "next best task" = first task with done === false, lowest order.
export const mbymiTasks = processGroups
  .flatMap((group, gi) =>
    group.tasks.map((title, ti) => ({
      id: `mbymi-${String(gi + 1).padStart(2, "0")}-${ti + 1}`,
      title,                 // James's verbatim task name
      process: group.process,
      done: false,
      bot: null,             // a bot is mapped to each task later, when bots are built
    }))
  )
  .map((task, index) => ({ ...task, order: index + 1 }));

// 50 tasks total across 15 process groups.
