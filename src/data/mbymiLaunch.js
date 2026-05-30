// MBYMI (Monetize Before You Make It) — launch process task data
// ---------------------------------------------------------------
// Task names are James's EXACT wording from the Notion board — do not rewrite them.
// Process groups are in James's framework order. The TASK ORDER within each
// group is now aligned to the official MBYMI Scribe:
//   https://scribehow.com/page-embed/Monetize_Before_You_Make_It_tm__IlWMuS3PSTO4UGVm8K7x9w
//
// IDs are explicit per-task (not derived from array position) so that the
// array order can be changed without breaking any code keyed by id — every
// downstream config (mbymiTaskConfig.js, math.js, PlaybookView, FunnelView,
// AILibraryDrawer, etc.) references these ids directly.

const processGroups = [
  {
    process: "Dream It",
    // Scribe order: Founders → Price → Launch List
    tasks: [
      { id: "mbymi-01-3", title: "The # of Founding Members You'll Accept" },
      { id: "mbymi-01-2", title: "The Founding Member Price Point" },
      { id: "mbymi-01-1", title: "The # People Needed in Your Launch List" },
    ],
  },
  {
    process: "Map It",
    // Scribe order matches existing order: Momentum → Announce
    tasks: [
      { id: "mbymi-02-1", title: "Phase 1: Momentum to Offer" },
      { id: "mbymi-02-2", title: "Phase 2: Announcing your Beta Program" },
    ],
  },
  {
    process: "Book It",
    // Scribe order: Initial Announcement → Follow-Up Announcements → Deadline → Content Schedule
    tasks: [
      { id: "mbymi-03-4", title: "Initial Announcement of Beta Offer" },
      { id: "mbymi-03-3", title: "All Follow-Up Announcements on Beta Offer" },
      { id: "mbymi-03-2", title: "Deadline to register (optional)" },
      { id: "mbymi-03-1", title: "Content-Posting Schedule (to build Priority List)" },
    ],
  },
  {
    process: "Chunk It",
    // Scribe order: chronological forward through the launch timeline.
    // (Was reverse-chronological previously.)
    tasks: [
      { id: "mbymi-04-11", title: 'Create "Early-Interest" PRIORITY LIST Opt-in Page' },
      { id: "mbymi-04-10", title: "Facebook Group Creation (optional)" },
      { id: "mbymi-04-9", title: "PRIORITY Waitlist Follow-Up Emails" },
      { id: "mbymi-04-8", title: 'Promote "PRIORITY WAITLIST"' },
      { id: "mbymi-04-7", title: "Create Your Product Outline" },
      { id: "mbymi-04-6", title: "Payment + Delivery Process" },
      { id: "mbymi-04-5", title: "Flash Sale" },
      { id: "mbymi-04-4", title: "Rock Your Webinars! (Optional)" },
      { id: "mbymi-04-3", title: "4-Day Follow-Up" },
      { id: "mbymi-04-2", title: "Close Day" },
      { id: "mbymi-04-1", title: "Launch Debrief" },
    ],
  },
  {
    process: "Priority Waitlist Registration", // verify exact label
    // Scribe 1.1 → 1.4, already in matching order.
    tasks: [
      { id: "mbymi-05-1", title: "Create Priority Waitlist Opt-In Page" },
      { id: "mbymi-05-2", title: "Create Thank You / Redirect Page" },
      { id: "mbymi-05-3", title: "Connect CRM to Priority Waitlist Form" },
      { id: "mbymi-05-4", title: "Create Priority Waitlist Confirmation Email" },
    ],
  },
  {
    process: "Facebook Group Creation", // verify exact label
    tasks: [
      { id: "mbymi-06-1", title: "Set Up Facebook Group" },
    ],
  },
  {
    process: "Waitlist",
    // Scribe 3.1 → 3.4, already in matching order.
    tasks: [
      { id: "mbymi-07-1", title: "Write Day 0 Thank You Email" },
      { id: "mbymi-07-2", title: "Write Day 2 Origin Story Email" },
      { id: "mbymi-07-3", title: "Write Day 4 Industry Stats/Trends Email" },
      { id: "mbymi-07-4", title: "Write Day 6-10 Case Study Email(s)" },
    ],
  },
  {
    process: "Promote Priority Waitlist", // verify exact label
    tasks: [
      { id: "mbymi-08-1", title: "Choose Promotion Channels (Podcast/Social/Email)" },
      { id: "mbymi-08-2", title: "Create Promotion Content Using Copy Formula" },
      { id: "mbymi-08-3", title: "Schedule & Post Promotion Content" },
    ],
  },
  {
    process: "Create Your Product", // verify exact label
    tasks: [
      { id: "mbymi-09-1", title: "Define Offer Promise, Deliverables & Price" },
      { id: "mbymi-09-2", title: "Build Full Course Outline / Agenda" },
      { id: "mbymi-09-3", title: "Create Welcome Video/Tutorial for Members" },
    ],
  },
  {
    process: "Payment + Delivery", // verify exact label
    // Scribe order: Checkout → Connect Payment → Thank-You → Portal → Sales Page
    tasks: [
      { id: "mbymi-10-1", title: "Create Checkout Page" },
      { id: "mbymi-10-5", title: "Connect to Payment Process" },
      { id: "mbymi-10-2", title: "Create Post-Purchase Thank You Confirmation Page" },
      { id: "mbymi-10-3", title: "Build Members-Only Course Portal (Kajabi)" },
      { id: "mbymi-10-4", title: "Creating Your Sales Page" },
    ],
  },
  {
    process: "Flash Sale",
    tasks: [
      { id: "mbymi-11-1", title: "Write Flash Sale Announcement Email" },
      { id: "mbymi-11-2", title: "Send Flash Sale Emails to Waitlist" },
    ],
  },
  {
    process: "Webinar",
    tasks: [
      { id: "mbymi-12-1", title: "Create & Promote Webinar" },
      { id: "mbymi-12-2", title: "Deliver Webinar & Pitch Beta Offer" },
    ],
  },
  {
    process: "4-Day Follow-Up",
    tasks: [
      { id: "mbymi-13-2", title: "Write 4-7 Day Follow-Up Email Sequence" },
      { id: "mbymi-13-3", title: "Send Follow-Up Sequence" },
    ],
  },
  {
    process: "Close Day",
    tasks: [{ id: "mbymi-14-1", title: "Send Cart Close Day Email" }],
  },
  {
    process: "Launch Debrief",
    tasks: [{ id: "mbymi-15-1", title: "Complete Launch Debrief Analysis" }],
  },
];

// The ordered list of process group labels (used by the progress header / section order).
export const mbymiProcessOrder = processGroups.map((g) => g.process);

// The flat task list the app uses. `order` is the master sequence (1..50) and defines
// "next best task" = first task with done === false, lowest order. Note that order
// reflects the NEW Scribe-aligned sequence; ids are stable per task regardless.
export const mbymiTasks = processGroups
  .flatMap((group) =>
    group.tasks.map((task) => ({
      id: task.id,
      title: task.title, // James's verbatim task name
      process: group.process,
      done: false,
      bot: null, // a bot is mapped to each task later, when bots are built
    })),
  )
  .map((task, index) => ({ ...task, order: index + 1 }));

// 48 tasks total across 15 process groups (was 50; removed mbymi-06-2 FB
// engage step and mbymi-13-1 duplicate Connect Payment Processor).
