// MBYMI (Monetize Before You Make It) — launch process task data
// ---------------------------------------------------------------
// Task names are James's EXACT wording from the Notion board — do not rewrite them.
//
// 2026-05-30 restructure: Chunk It process group is gone. Reserve-time tasks
// (04-1, 04-2, 04-3, 04-4, 04-5, 04-6, 04-8, 04-10, 04-11) were deleted.
// The two non-reserve Chunk It tasks were folded into their natural homes:
//   - mbymi-04-7 (Create Your Product Outline)  → Create Your Product group
//   - mbymi-04-9 (PRIORITY Waitlist Follow-Up Emails) → Waitlist group
//
// IDs are explicit per-task so the array order and process-group membership
// can change without breaking any code keyed by id.

const processGroups = [
  // ===== PLAN PHASE ========================================================
  {
    process: "Foundations",
    // Teaching lessons that bookend the framework. Lessons can also carry
    // embedded sub-task inputs (see mbymi-00-3 — the Dream It numbers live
    // inside the Planning Phase 01 lesson card).
    tasks: [
      {
        id: "mbymi-00-1",
        title:
          "STEP 00: Understand What 'Monetize Before You Make It' ™ Is & How Does it Work:",
      },
      {
        id: "mbymi-00-2",
        title: "STEP 0.5: Follow The 5-Step Planning Process:",
      },
      {
        id: "mbymi-00-3",
        title: "Planning Phase 01: Dream It!",
      },
      {
        id: "mbymi-00-4",
        title: "Planning Phase 02: Map It",
      },
      {
        id: "mbymi-00-5",
        title: "Planning Phase 03: Book It",
      },
      {
        id: "mbymi-00-6",
        title: "Planning Phase 04: Chunk It",
      },
      {
        id: "mbymi-00-7",
        title: "Planning Phase 05: Do It",
      },
    ],
  },
  {
    process: "Dream It",
    // These 3 tasks are now CAPTURED inside the Planning Phase 01 lesson card
    // (mbymi-00-3). They stay in this data file so math.js + PlaybookView can
    // continue to look them up by id, but `embedded: true` hides them from the
    // user-facing step list — they're set done + answered when the parent
    // lesson is completed.
    tasks: [
      { id: "mbymi-01-3", title: "The # of Founding Members You'll Accept", embedded: true },
      { id: "mbymi-01-2", title: "The Founding Member Price Point", embedded: true },
      { id: "mbymi-01-1", title: "The # People Needed in Your Launch List", embedded: true },
    ],
  },
  // Map It group dissolved — its 2 tasks (mbymi-02-1 + mbymi-02-2) were
  // superseded by the Planning Phase 02: Map It lesson (mbymi-00-4) which
  // walks the user through the same map concept declaratively rather than
  // asking them to draft Momentum/Announce plans from scratch.
  {
    process: "Book It",
    // All 4 Book It dates are now captured inside the Planning Phase 03 lesson
    // card (mbymi-00-5). They stay in this data file so math/playbook can
    // continue to look them up by id, but `embedded: true` hides them from
    // the user-facing step list.
    tasks: [
      { id: "mbymi-03-4", title: "Initial Announcement of Beta Offer", embedded: true },
      { id: "mbymi-03-3", title: "All Follow-Up Announcements on Beta Offer", embedded: true },
      { id: "mbymi-03-2", title: "Deadline to register (optional)", embedded: true },
      { id: "mbymi-03-1", title: "Content-Posting Schedule (to build Priority List)", embedded: true },
    ],
  },

  // ===== WAITLIST PHASE ====================================================
  {
    process: "Priority Waitlist Registration",
    tasks: [
      { id: "mbymi-05-0", title: "STEP 01. Create Your PRIORITY LIST:" },
      { id: "mbymi-05-1", title: "1.1 Create the Priority Waitlist Page" },
      // URL captured inside the 1.1 lesson card → feeds the Links panel.
      { id: "mbymi-05-1-link", title: "Priority Waitlist Page URL", embedded: true },
      { id: "mbymi-05-2", title: "1.2 Redirect Thank You Page" },
      // URL captured inside the 1.2 lesson card → feeds the Links panel.
      { id: "mbymi-05-2-link", title: "Thank You Page URL", embedded: true },
      { id: "mbymi-05-3", title: "1.3 Connect Your CRM to Priority Waitlist Form" },
      { id: "mbymi-05-4", title: "1.4 Create a Priority Waitlist Confirmation Email" },
      // Email draft captured inside the 1.4 lesson card → feeds the Emails panel.
      { id: "mbymi-05-4-email", title: "Priority Waitlist Confirmation Email", embedded: true },
    ],
  },
  {
    process: "Facebook Group Creation",
    tasks: [
      { id: "mbymi-06-1", title: "2. Facebook Group Creation (Optional):" },
      // Optional FB group URL captured inside card 2 → feeds the Links panel.
      { id: "mbymi-06-1-link", title: "Facebook Group URL", embedded: true },
      { id: "mbymi-06-2", title: "2.1 FB Group Process" },
    ],
  },
  {
    process: "Waitlist Emails",
    tasks: [
      { id: "mbymi-07-0", title: "3. The Waitlist Emails:" },
      { id: "mbymi-07-1", title: "3.1 Day 0 Email - Thank You (see example above in 1.4)" },
      // Email drafts captured inside each lesson card → feed the Emails panel.
      { id: "mbymi-07-1-email", title: "Day 0 Thank You Email", embedded: true },
      { id: "mbymi-07-2", title: "3.2 Day 2 Email - the Origin Story" },
      { id: "mbymi-07-2-email", title: "Day 2 Origin Story Email", embedded: true },
      { id: "mbymi-07-3", title: "3.3 Day 4 Email - Industry Stats/Trends" },
      { id: "mbymi-07-3-email", title: "Day 4 Industry Stats/Trends Email", embedded: true },
      { id: "mbymi-07-4", title: "3.4 Day 6 -10 Emails - Share Case Studies" },
      { id: "mbymi-07-4-email", title: "Day 6-10 Case Study Email(s)", embedded: true },
    ],
  },

  // ===== PROMO PHASE =======================================================
  {
    process: "Promote Priority Waitlist",
    tasks: [
      { id: "mbymi-08-0", title: "4. Promote \"Early Interest\" List:" },
      { id: "mbymi-08-1", title: "4.1 Promotion Options:" },
      // Channels draft captured inside card 4.1.
      { id: "mbymi-08-1-input", title: "Promotion Channels", embedded: true },
      { id: "mbymi-08-2", title: "4.2 Promotion Formula" },
      // Promotion-content draft captured inside card 4.2.
      { id: "mbymi-08-2-input", title: "Promotion Content", embedded: true },
      { id: "mbymi-08-3", title: "Schedule & Post Promotion Content" },
    ],
  },

  // ===== OFFER PHASE =======================================================
  {
    process: "Create Your Product",
    tasks: [
      { id: "mbymi-09-1", title: "Define Offer Promise, Deliverables & Price" },
      { id: "mbymi-09-2", title: "Build Full Course Outline / Agenda" },
      { id: "mbymi-09-3", title: "Create Welcome Video/Tutorial for Members" },
    ],
  },

  // ===== PAYMENT + DELIVERY PHASE ==========================================
  {
    process: "Payment + Delivery",
    tasks: [
      { id: "mbymi-10-1", title: "Create Checkout Page" },
      { id: "mbymi-10-5", title: "Connect to Payment Process" },
      { id: "mbymi-10-2", title: "Create Post-Purchase Thank You Confirmation Page" },
      { id: "mbymi-10-3", title: "Build Members-Only Course Portal (Kajabi)" },
      { id: "mbymi-10-4", title: "Creating Your Sales Page" },
    ],
  },

  // ===== FLASH SALE PHASE ==================================================
  {
    process: "Flash Sale",
    tasks: [
      { id: "mbymi-11-1", title: "Write Flash Sale Announcement Email" },
      { id: "mbymi-11-2", title: "Send Flash Sale Emails to Waitlist" },
    ],
  },

  // ===== WEBINAR PHASE =====================================================
  {
    process: "Webinar",
    tasks: [
      { id: "mbymi-12-1", title: "Create & Promote Webinar" },
      { id: "mbymi-12-2", title: "Deliver Webinar & Pitch Beta Offer" },
    ],
  },

  // ===== FOLLOW UP PHASE ===================================================
  {
    process: "4-Day Follow-Up",
    tasks: [
      { id: "mbymi-13-2", title: "Write 4-7 Day Follow-Up Email Sequence" },
      { id: "mbymi-13-3", title: "Send Follow-Up Sequence" },
    ],
  },

  // ===== CLOSE CART PHASE ==================================================
  {
    process: "Close Day",
    tasks: [{ id: "mbymi-14-1", title: "Send Cart Close Day Email" }],
  },

  // ===== DEBRIEF PHASE =====================================================
  {
    process: "Launch Debrief",
    tasks: [{ id: "mbymi-15-1", title: "Complete Launch Debrief Analysis" }],
  },
];

// The ordered list of process group labels (used by the progress header / section order).
export const mbymiProcessOrder = processGroups.map((g) => g.process);

// The flat task list the app uses. `order` is the master sequence and defines
// "next best task" = first task with done === false, lowest order.
export const mbymiTasks = processGroups
  .flatMap((group) =>
    group.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      process: group.process,
      done: false,
      bot: null,
      // `embedded: true` means the task's value is collected inside another
      // task's card (a compound lesson) and it should NOT render as its own
      // standalone step. Math/playbook still find it by id.
      embedded: !!task.embedded,
    })),
  )
  .map((task, index) => ({ ...task, order: index + 1 }));

// 39 tasks total across 14 process groups, organised into 10 macro-phases
// (3 of the tasks are `embedded: true` — they live inside the Planning Phase
// 01 lesson card so the user-visible count is 33 standalone steps + 4 lessons
// = 37 total visible, with the 3 Dream It numbers captured inside lesson #3).
