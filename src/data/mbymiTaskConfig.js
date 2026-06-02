// Per-task metadata layered ON TOP of mbymiLaunch.js — keeps James's verbatim
// task titles untouched while letting each step render with the right guided
// input, helper text, example, and (optional) playbook contribution.
//
// `inputType` values:
//   - 'text'        long-form textarea (chars: minimum length to continue)
//   - 'number'      numeric value (e.g. price, count)
//   - 'date'        date picker
//   - 'acknowledge' no input; user just confirms they've done this external step
//   - 'note'        optional short note + acknowledge (for execution tasks where
//                   the user might want to leave a reminder)
//
// `playbookField` (optional) — which playbook section/field this answer feeds.
// `unit`, `prefix`, `placeholder` — input affordances.
// `helper` — short why-this-matters sentence under the heading.
// `example` — pre-baked example expanded behind "See an example".
// `minChars` — for text inputs only.
//
// `aiBot` (optional) — { name, url } — when present, the StepCard shows an
// "AI" button that opens the Mindpal bot in a popup. Leave `url: ''` to keep
// a "coming soon" placeholder until the real Mindpal embed URL is ready.
//
// `linkLabel` (optional) — for note-type tasks that capture a URL. Surfaces
// the answer in the Links panel under this label.
//
// `promptMetricsUpdate` (optional) — when true, completing this task prompts
// the user to open the metrics drawer (good for milestone tasks like webinar
// delivered, flash sale sent, close day, etc.).
//
// `videoUrl` (optional) — link to the training video for this step. When set,
// the StepCard shows a "📹 Watch the training" link beneath the helper. Until
// real URLs are added, every step shows a placeholder version of the link.

// Real Mindpal bot endpoints. One bot may serve several steps.
export const BOT_URLS = {
  debrief: 'https://workflow.getmindpal.com/launch-debrief-analyzer-workflow-hefdkrlovsl4bfva',
  offer: 'https://workflow.getmindpal.com/irresistible-offer-creation-workflow-jwyw07nx0rrguqy2',
  webinar: 'https://workflow.getmindpal.com/webinar-outline-generator-f7wf5bwvajwejzmz',
  salesPage: 'https://chatbot.getmindpal.com/sales-page-copy-bot-8t7',
  promo: 'https://chatbot.getmindpal.com/promo-campaign-bot-ga2',
  email: 'https://chatbot.getmindpal.com/general-communication-email-bot-0g1',
  productOutline: 'https://chatbot.getmindpal.com/offer-product-builder-bot-vwj',
};

export const taskConfig = {
  // ---- Foundations (teaching lessons) -------------------------------------
  // 'lesson' inputType renders an embedded video / body paragraph / inline
  // resource links / plain-block bonus + a "Mark complete →" button. No
  // text/number/date input is collected. All copy is James's verbatim — do
  // not rewrite. `lessonNumber` drives the "STEP {n}: PLAN" label shown on
  // the completed-step card.
  'mbymi-00-1': {
    inputType: 'lesson',
    lessonNumber: '00',
    intro: 'Watch the Quick Video Below for a basic understanding of this strategy:',
    videoUrl: 'https://www.youtube.com/watch?v=Tbm3BCKZ4Es&t=2s',
    bonus: {
      title: 'BONUS: The Course Chronicles: Sold Out in 30 Seconds',
      body: "Listen along on this 8-Part Series that documents MY journey in Beta Launching a brand new product that sold out in less than 30 Seconds!",
      linkUrl: 'https://www.jameswedmoretraining.com/thecoursechroniclesplaylist',
    },
  },
  'mbymi-00-3': {
    inputType: 'lesson',
    lessonNumber: '01',
    // Verbatim body, paragraph by paragraph.
    body: [
      'Phase #01 of any planning process is always about creating some goals. But if this is the first time you\'ve ever "launched," I recommend keeping your goals as light and fun as possible. In fact, one of the things that makes this process so powerful, is that you can actually LIMIT the number of people you "accept" as Founding Members.',
      'So, we\'ll start there! How many Founding Members will you allow into your "Beta Program?" Between 5 and 20 is a good number to start with.',
      "Then, once you have your TARGET NUMBER of Founding Members, we'll need to identify two additional numbers: The Price for Founding Members (usually discounted) and the amount of people that will need to see your offer (or get on the PRIORITY LIST) in order to hit your target number.",
      'Please identify those three numbers now in the DREAM IT Phase:',
    ],
    inputsHeading: 'Your Three Metrics That Matter:',
    // Each subTask references an existing embedded task by id. When the lesson
    // is marked complete, the value typed here is written to that task's
    // `answer` field and the task is set done=true. Math/playbook continue to
    // look them up by id and see the values as if filled in standalone.
    subTasks: [
      {
        id: 'mbymi-01-3',
        label: "1. The # of Founding Members You'll Accept:",
        inputType: 'number',
        unit: 'members',
        placeholder: 'e.g. 5',
      },
      {
        id: 'mbymi-01-2',
        label: '2. The Founding Member Price Point (roughly 50% discount of future price):',
        inputType: 'number',
        prefix: '$',
        placeholder: 'e.g. 497',
      },
      {
        id: 'mbymi-01-1',
        label:
          '3. The # People Needed in Your Launch List (or Registered on Priority List) (Answer #1 x 10)  ex: 5 Founding Members x 10 = 50:',
        inputType: 'number',
        unit: 'people',
        placeholder: 'e.g. 50',
      },
    ],
  },
  'mbymi-00-4': {
    inputType: 'lesson',
    lessonNumber: '02',
    // `body` items can be:
    //   - a string         → renders as a paragraph
    //   - { image, alt }   → renders as an image (empty `image` → placeholder)
    //   - { bold, text }   → paragraph with a bold lead-in span
    body: [
      'In this Step, you\'ll "Map Out" all the moving pieces in your "Monetize Before You Make it" Launch Plan. Below is a sample MAP that shows you how I would run this promotion.',
      // Image placeholder — swap `image` to a public URL or '/launch-map.png'
      // once the file is added to the repo's public/ folder.
      { image: '', alt: "James Wedmore's 'Monetize Before You Make It' Launch Map" },
      "Notice there are two PRIMARY phases (and one third optional phase if you didn't fill your beta).",
      {
        bold: 'Phase #1',
        text:
          ' is to build momentum of your offer by "teasing" your audience and sending them to a Priority Waitlist Page. You can do this through your emails, content, and social media posts.',
      },
      {
        bold: 'Phase #2',
        text:
          ' is the Phase of actually announcing your Beta Program and opening up a limited amount of seats. If you have successfully built out a Priority Waitlist, then writing emails to these individuals may be the only step you need to take.  But in Phase 2, you can also use your social media assets to get the word out.',
      },
      "If you haven't filled your BETA through this process, you can transition to the optional Phase #3, and invite your audience to an informative webinar. And... we have an entire Webinar Launch Process you can follow to turn attendees into customers!",
    ],
  },
  'mbymi-00-2': {
    inputType: 'lesson',
    lessonNumber: '0.5',
    body:
      "Before diving in, it's crucial, to begin with the 5-Step Planning Process, so you have a clear picture of the entire map! Remember! There are just 5 easy steps: Dream it, Map it, Book it, Chunk it & Do it!",
    // Each resource renders as a sentence with an inline hyperlinked label
    // (linkText) replacing the raw URL.
    resources: [
      {
        label:
          "If you haven't learned WHAT our \"5 Step Launch Planning Process\" is, you can visit it",
        linkText: 'HERE',
        linkUrl:
          'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/1545212/posts/5205202',
        trailing: '.',
      },
      {
        label: "Download the 'Monetize Before You Make it' Planning Sheet",
        linkText: 'HERE',
        linkUrl: 'https://drive.google.com/file/d/1rNJsE0Gdf9SBj_SQ4p8qkF-HhdnboYf4/view',
      },
    ],
  },

  // ---- Dream It -----------------------------------------------------------
  'mbymi-01-1': {
    inputType: 'number',
    unit: 'people',
    placeholder: 'e.g. 50',
    helper:
      "The # People Needed in Your Launch List (or Registered on Priority List). Rule of thumb: Founding Members × 10. e.g. 5 Founding Members × 10 = 50.",
    example:
      'Most BBD members land between 300–1,500 depending on offer price. Higher price → smaller list needed.',
    playbookField: 'targets.launchListTarget',
  },
  'mbymi-01-2': {
    inputType: 'number',
    prefix: '$',
    placeholder: 'e.g. 497',
    helper:
      "The price you'll charge founding members. Lower price = more leads needed, higher price = bigger commitment.",
    example: 'A common BBD founding-member range is $297 – $997 for a beta cohort.',
    playbookField: 'offer.price',
  },
  'mbymi-01-3': {
    inputType: 'number',
    unit: 'members',
    placeholder: 'e.g. 30',
    helper: 'How many founders are you willing to take on? Caps your revenue and your delivery load.',
    example: '20–50 is typical for a first beta — small enough to give real attention, big enough to learn from.',
    playbookField: 'offer.foundingMembersTarget',
  },

  // Map It tasks (mbymi-02-1 + mbymi-02-2) removed — superseded by the
  // Planning Phase 02: Map It lesson (mbymi-00-4).

  // ---- Book It ------------------------------------------------------------
  'mbymi-03-1': {
    inputType: 'date',
    helper: 'Reserve the date your content-posting schedule kicks off to build the priority list.',
    playbookField: 'bookIt.contentSchedule',
    dateLabel: 'Content Schedule Starts',
  },
  'mbymi-03-2': {
    inputType: 'date',
    helper: 'Optional: a registration deadline that creates urgency. Leave blank if you don’t want one.',
    playbookField: 'bookIt.registrationDeadline',
    dateLabel: 'Registration Deadline',
  },
  'mbymi-03-3': {
    inputType: 'date',
    helper: 'Reserve the date you send your follow-up announcements about the beta offer.',
    playbookField: 'bookIt.followUpAnnouncements',
    dateLabel: 'Follow-Up Announcements',
  },
  'mbymi-03-4': {
    inputType: 'date',
    helper: 'Reserve the date you send the initial announcement that opens the launch.',
    playbookField: 'bookIt.initialAnnouncement',
    dateLabel: 'Initial Beta Announcement',
  },

  // ---- Priority Waitlist Registration -------------------------------------
  'mbymi-05-1': {
    inputType: 'note',
    placeholder: 'Paste your opt-in page URL (optional)',
    helper: 'External build in Kajabi/your funnel tool — use the AI bot for the opt-in page copy, then drop the live URL here.',
    linkLabel: 'Priority Waitlist Opt-in Page',
    aiBot: { name: 'Sales/Landing Page Copy Bot', url: BOT_URLS.salesPage },
  },
  'mbymi-05-2': {
    inputType: 'note',
    placeholder: 'Paste your thank-you page URL (optional)',
    helper: 'The page they land on after opting in. Use the AI bot for the copy, then drop the URL.',
    linkLabel: 'Waitlist Thank-You Page',
    aiBot: { name: 'Sales/Landing Page Copy Bot', url: BOT_URLS.salesPage },
  },
  'mbymi-05-3': {
    inputType: 'acknowledge',
    helper: 'Verify the form pushes signups into your CRM with the right tag.',
  },
  'mbymi-05-4': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Draft your confirmation email here…',
    helper: "Sent immediately after signup. Should confirm they’re in and tease what's coming.",
    example:
      "Subject: You're on the waitlist 🎉\nBody: Confirms their spot, sets the timeline for what they'll receive over the next X days, links to one piece of pillar content while they wait.",
    playbookField: 'waitlistSequence.confirmation',
    emailLabel: 'Waitlist Confirmation Email',
    aiBot: { name: 'Email Bot', url: BOT_URLS.email },
  },

  // ---- Facebook Group Creation --------------------------------------------
  'mbymi-06-1': {
    inputType: 'note',
    placeholder: 'Group URL (optional)',
    helper: 'Optional — only if a FB group is part of your nurture plan.',
    linkLabel: 'Facebook Group',
  },

  // ---- Waitlist (the nurture sequence — high-value content tasks) ---------
  'mbymi-07-1': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Draft your Day 0 thank-you email…',
    helper: 'The very first email after they join — the warmest moment of the whole sequence.',
    example: "Hey [first name] — you're in. Here's what's coming over the next 10 days, and the one thing I want you to think about today…",
    playbookField: 'waitlistSequence.day0',
    emailLabel: 'Day 0 · Thank You Email',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
  },
  'mbymi-07-2': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Draft your Day 2 origin-story email…',
    helper: 'Your story — who you were, what changed, why this offer exists. The trust-builder.',
    example: 'A short narrative going from "I was stuck doing X" → "I figured out Y" → "that’s why I built this".',
    playbookField: 'waitlistSequence.day2',
    emailLabel: 'Day 2 · Origin Story Email',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
  },
  'mbymi-07-3': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Draft your Day 4 industry stats/trends email…',
    helper: 'Why now? Use stats / trends to make the case that the timing matters.',
    example: 'Three stats about why [the problem] is getting worse — and what most people are doing about it.',
    playbookField: 'waitlistSequence.day4',
    emailLabel: 'Day 4 · Stats/Trends Email',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
  },
  'mbymi-07-4': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Draft your Day 6–10 case study email(s)…',
    helper: 'Show, don’t tell. Real (or composite) before/after stories.',
    example: 'Two short case studies from past students — one beginner, one more advanced — proving the method works.',
    playbookField: 'waitlistSequence.caseStudies',
    emailLabel: 'Day 6–10 · Case Study Email(s)',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
  },

  // ---- Promote Priority Waitlist ------------------------------------------
  'mbymi-08-1': {
    inputType: 'text',
    minChars: 10,
    placeholder: 'List the channels you’ll use (podcast, social, email, partnerships…)',
    helper: 'Pick the channels you actually have leverage in — better to do 2 well than 5 poorly.',
    playbookField: 'promote.channels',
  },
  'mbymi-08-2': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Draft 1–2 promotion posts/emails using James’s copy formula…',
    helper: 'Use the copy formula from the training — hook → problem → bridge → CTA.',
    playbookField: 'promote.copy',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
  },
  'mbymi-08-3': {
    inputType: 'acknowledge',
    helper: 'Schedule the posts. Once scheduled, mark this done.',
    promptMetricsUpdate: true,
  },

  // ---- Create Your Product ------------------------------------------------
  'mbymi-09-1': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Promise: …\nDeliverables: …\nPrice: …',
    helper: 'The three pieces every offer needs. Write them in plain language.',
    example:
      "Promise: Launch your first paid program to 30 founding members in 6 weeks.\nDeliverables: 6 weekly live calls + Notion playbook + Slack community.\nPrice: $497 one-time.",
    playbookField: 'offer.fullDefinition',
    aiBot: { name: 'Irresistible Offer Bot', url: BOT_URLS.offer },
  },
  'mbymi-09-2': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Sketch the full course outline / module agenda…',
    helper: 'Modules, lessons, sequence. Doesn’t need to be perfect — a draft is enough to start selling.',
    playbookField: 'product.outline',
    aiBot: { name: 'Product Outline Bot', url: BOT_URLS.productOutline },
  },
  'mbymi-09-3': {
    inputType: 'note',
    placeholder: 'Notes on the welcome video (optional)',
    helper: 'The first thing new members see in the portal. Sets expectations and reduces refunds.',
  },

  // ---- Payment + Delivery (mostly external Kajabi work) -------------------
  'mbymi-10-1': { inputType: 'note', placeholder: 'Checkout page URL (optional)', helper: 'External build — Kajabi / your checkout.', linkLabel: 'Checkout Page' },
  'mbymi-10-2': { inputType: 'note', placeholder: 'Thank-you page URL (optional)', helper: 'Confirms purchase and sets the first step.', linkLabel: 'Post-Purchase Thank You' },
  'mbymi-10-3': { inputType: 'note', placeholder: 'Portal URL (optional)', helper: 'Where members go to access the program.', linkLabel: 'Member Portal' },
  'mbymi-10-4': {
    inputType: 'note',
    placeholder: 'Sales page URL (optional)',
    helper: 'The main page that does the convincing. Use the AI bot to draft sales-page copy, then drop the published URL here.',
    linkLabel: 'Sales Page',
    aiBot: { name: 'Sales/Landing Page Copy Bot', url: BOT_URLS.salesPage },
  },
  'mbymi-10-5': { inputType: 'acknowledge', helper: 'Test the full purchase flow with a $1 test charge before launch.' },

  // ---- Flash Sale ---------------------------------------------------------
  'mbymi-11-1': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Draft the flash sale announcement email…',
    helper: 'A short, punchy email that creates urgency — cart is opening for X days only.',
    playbookField: 'flashSale.announcement',
    emailLabel: 'Flash Sale Announcement Email',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
  },
  'mbymi-11-2': {
    inputType: 'acknowledge',
    helper: 'Once scheduled in your CRM, mark this done.',
    promptMetricsUpdate: true,
  },

  // ---- Webinar ------------------------------------------------------------
  'mbymi-12-1': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Title, hook, key teaching points, pitch transition…',
    helper: 'Your webinar plan: title, hook, 2–3 key teaching points, the pitch transition.',
    playbookField: 'webinar.plan',
    aiBot: { name: 'Webinar Outline Bot', url: BOT_URLS.webinar },
  },
  'mbymi-12-2': {
    inputType: 'acknowledge',
    helper: 'Show up, deliver, pitch. Mark done after the live session.',
    promptMetricsUpdate: true,
  },

  // ---- 4-Day Follow-Up ----------------------------------------------------
  'mbymi-13-2': {
    inputType: 'text',
    minChars: 30,
    placeholder: 'Draft the 4–7 day follow-up email sequence outline…',
    helper: 'The post-webinar nurture: objections, FAQs, social proof, urgency.',
    playbookField: 'followUp.sequence',
    emailLabel: '4–7 Day Follow-Up Sequence',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
  },
  'mbymi-13-3': {
    inputType: 'acknowledge',
    helper: 'Once the sequence is scheduled to send, mark this done.',
    promptMetricsUpdate: true,
  },

  // ---- Close Day ----------------------------------------------------------
  'mbymi-14-1': {
    inputType: 'text',
    minChars: 20,
    placeholder: 'Draft the cart close day email…',
    helper: 'The "this is your last chance" email. Short, urgent, direct.',
    playbookField: 'closeDay.email',
    emailLabel: 'Cart Close Day Email',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
    promptMetricsUpdate: true,
  },

  // ---- Launch Debrief -----------------------------------------------------
  'mbymi-15-1': {
    inputType: 'debrief',
    helper:
      "This is the big one. Fill out the structured debrief in the Debrief tab of the Live Build panel on the right — every section captures something you'll want next launch. Hit Save Debrief when you're done.",
    aiBot: { name: 'Launch Debrief Analyzer', url: BOT_URLS.debrief },
  },
};

// Fallback used when a task id isn't explicitly configured above.
export const DEFAULT_TASK_CONFIG = {
  inputType: 'acknowledge',
  helper: '',
};

export function getTaskConfig(id) {
  return taskConfig[id] ?? DEFAULT_TASK_CONFIG;
}
