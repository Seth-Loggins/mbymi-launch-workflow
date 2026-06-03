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

// Shared resource link reused across the Waitlist-Email lesson cards.
const CHATGPT_PROMPTS_URL =
  'https://scribehow.com/page/MBYMI_PROCESS__ChatGPT_Prompts__cAQquPq1RYm6sGoyowjOZg?referrer=page&slug=/page-embed/Monetize_Before_You_Make_It_tm__IlWMuS3PSTO4UGVm8K7x9w?removeLogo=true';

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
  'mbymi-00-7': {
    inputType: 'lesson',
    lessonNumber: '05',
    body: [
      "Well... now it's time to do it! Follow the process below to execute on all the necessary steps! You freakin' got this!",
    ],
  },
  'mbymi-00-6': {
    inputType: 'lesson',
    lessonNumber: '04',
    body: [
      // First line has TWO inline hyperlinks behind "PDF Version" and
      // "Excel Sheet Version" — the `parts` block type lets a paragraph mix
      // plain text spans with hyperlinked spans inline.
      {
        parts: [
          { text: 'The "Chunked" Projects For Your Monetize Before You Make It (' },
          {
            link: 'https://drive.google.com/file/d/1OUUtrkUIyxnB5q5N1lHZE0ynOU7RPBqC/view',
            text: 'PDF Version',
          },
          { text: ' / ' },
          {
            link: 'https://docs.google.com/spreadsheets/d/18teZDL6RaDGMMv4x1F6YppEc9FRjJhre/edit?gid=1764815534#gid=1764815534',
            text: 'Excel Sheet Version',
          },
          { text: '):' },
        ],
      },
      // Numbered list — each item is its own paragraph so the layout matches
      // the source lesson.
      '1. Create "Early-Interest" PRIORITY LIST Opt-In Page',
      '2. Facebook Group Creation (optional)',
      '3. PRIORITY Waitlist Follow-Up Emails',
      '4. Promote "PRIORITY WAITLIST"',
      '5. Create Your Product Outline',
      '6. Payment + Delivery Process',
      '7. Flash Sale',
      '8. Rock Your Webinars! (Optional)',
      '9. 4-Day Follow-Up',
      '10. Close Day',
      '11. Launch Debrief',
    ],
  },
  'mbymi-00-5': {
    inputType: 'lesson',
    lessonNumber: '03',
    body: [
      "In this planning phase, we must identify all of your key dates and events, and then LOCK them into your calendar. Remember... if you don't schedule it... you won't do it!",
      { bold: 'Monetize Before You Make It Key Dates:', text: '' },
      'Inside this Launch Process, there are a few key dates that you must put on the calendar:',
      // The 4 numbered key dates render as plain paragraphs so the body reads
      // exactly as the source. The actual date pickers come right below via
      // the {subtasks: true} marker so the user fills them in context.
      '1. Initial Announcement of Beta Offer',
      '2. All Follow-Up Announcements on Beta Offer',
      '3. Deadline to register (optional)',
      '4. Content-Posting Schedule (to build Priority List)',
      { subtasks: true },
      'Below is a SAMPLE calendar that uses those KEY DATES:',
      { image: './book-it-calendar.png', alt: "MBYMI Launch Calendar — primary sample" },
      'If you follow the above calendar and do not fill your beta, you can move onto the optional PHASE 03 and run a webinar(s) to get more Founding Members. If you follow that third phase, below is a SAMPLE calendar to run from:',
      {
        image: './book-it-webinar-calendar.webp',
        alt: "MBYMI Launch Calendar — optional Phase 03 webinar variant",
      },
    ],
    subTasks: [
      {
        id: 'mbymi-03-4',
        label: '1. Initial Announcement of Beta Offer',
        inputType: 'date',
      },
      {
        id: 'mbymi-03-3',
        label: '2. All Follow-Up Announcements on Beta Offer',
        inputType: 'date',
      },
      {
        id: 'mbymi-03-2',
        label: '3. Deadline to register (optional)',
        inputType: 'date',
      },
      {
        id: 'mbymi-03-1',
        label: '4. Content-Posting Schedule (to build Priority List)',
        inputType: 'date',
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
      { image: './launch-map.png', alt: "James Wedmore's 'Monetize Before You Make It' Launch Map" },
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
  // First task in the phase is a teaching lesson (same pattern as the Plan
  // phase). Verbatim copy — do not rewrite. Image is a dashed placeholder
  // (empty `image`) until the real asset is supplied.
  'mbymi-05-0': {
    inputType: 'lesson',
    lessonNumber: '01',
    body: [
      "Ok, it's time to get to work! In this first step, I recommend building a completed and working Priority List Page and Thank You Page. Make sure it is complete and connected to your email CRM software.",
      { image: '', alt: 'Priority List Page' },
    ],
  },
  // Step 2 of 10 ("Create Priority Waitlist Opt-In Page") is now folded into
  // this teaching card — verbatim copy, do not rewrite. The 4 images are dashed
  // placeholders (empty `image`) until the real assets are supplied. AI Assist
  // opens the Sales/Landing Page Copy Bot.
  'mbymi-05-1': {
    inputType: 'lesson',
    lessonNumber: '1.1',
    aiBot: { name: 'Sales/Landing Page Copy Bot', url: BOT_URLS.salesPage },
    body: [
      'Here you\'ll want to create your "Official PRIORITY Waitlist Page" for Your Future Program. There is NO need to offer anything for free here (no giveaway, pdf, etc) this is simply a place where people can "raise their hand" by submitting their email to be notified when something is coming.',
      {
        bold: 'IMPORTANT:',
        text: " if you DO decide to give away something for free... you are having people join for the wrong reasons, and won't have a TRUE segmented list of interest buyers.",
      },
      {
        parts: [
          { text: 'To execute on the Priority Waitlist Page, simply follow the ' },
          {
            link: 'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/218956/posts/763212',
            text: '"Waitlist Creation"',
          },
          { text: ' Process.' },
        ],
      },
      'Priority Waitlist Page Examples:',
      { image: '', alt: 'Priority Waitlist Page example' },
      { image: '', alt: 'Priority Waitlist Page example' },
      { image: '', alt: 'Priority Waitlist Page example' },
      'PREVIOUS VERSION EXAMPLE',
      { image: '', alt: 'Priority Waitlist Page — previous version example' },
      {
        parts: [
          { text: 'The examples above is our Priority Waitlist Page. (' },
          { link: 'https://www.BusinessbyDesign.net', text: 'www.BusinessbyDesign.net' },
          { text: ') Notice there is nothing we are giving away here, just asking people to "get in the line".' },
        ],
      },
    ],
    // Required URL capture — Mark complete stays disabled until it's filled,
    // and the link flows to the Links tab (via the embedded task's linkLabel).
    subTasks: [
      {
        id: 'mbymi-05-1-link',
        label: 'Priority Waitlist Page URL:',
        inputType: 'url',
        placeholder: 'https://...',
      },
    ],
  },
  // Step 3 of 10 ("Create Thank You / Redirect Page") folded into a teaching
  // card — verbatim copy, do not rewrite. Image is a dashed placeholder until
  // the real asset is supplied. The training video embeds inline; the closing
  // sentence is one full hyperlink to the transcript PDF. AI Assist opens the
  // Sales/Landing Page Copy Bot.
  'mbymi-05-2': {
    inputType: 'lesson',
    lessonNumber: '1.2',
    aiBot: { name: 'Sales/Landing Page Copy Bot', url: BOT_URLS.salesPage },
    body: [
      'In this step, you\'ll need to create a simple "thank you" page for your visitors who successfully complete their registration of joining your Priority Waitlist.  The purpose of this page is:',
      { bullet: 'Confirm their registration' },
      { bullet: 'Create more excitement and anticipation for your upcoming product launch' },
      { bullet: 'Learn more about YOU' },
      { bullet: '...and take a next step (like save the date, or join a private group)' },
      'Below is an example of the Thank You Page I use when people "opt in" for MY BBD Priority Waitlist',
      { image: '', alt: 'BBD Priority Waitlist Thank You Page' },
      'Below is the ACTUAL video I use on the Priority List Thank You Page:',
      { video: 'https://www.youtube.com/watch?v=zLzArmXS3DM' },
      {
        parts: [
          {
            link: 'https://drive.google.com/file/d/1ojO9WRYwSA1DeQw2UDZpI46p1Dvsy0pf/view',
            text: 'And here is a PDF of the exact transcript of that above video.',
          },
        ],
      },
    ],
    // Required URL capture — Mark complete stays disabled until it's filled,
    // and the link flows to the Links tab (via the embedded task's linkLabel).
    subTasks: [
      {
        id: 'mbymi-05-2-link',
        label: 'Thank You Page URL:',
        inputType: 'url',
        placeholder: 'https://...',
      },
    ],
  },
  // Embedded URL-capture tasks for the 1.1 / 1.2 lesson cards. They render
  // inline as a sub-task input; `linkLabel` surfaces the saved URL in the
  // Links tab of the Live Build panel (same as the old standalone note steps).
  'mbymi-05-1-link': {
    inputType: 'url',
    linkLabel: 'Priority Waitlist Opt-in Page',
  },
  'mbymi-05-2-link': {
    inputType: 'url',
    linkLabel: 'Waitlist Thank-You Page',
  },
  'mbymi-06-1-link': {
    inputType: 'url',
    linkLabel: 'Facebook Group',
  },
  // Email draft captured inside the 1.4 lesson card → surfaces in the Emails
  // panel via emailLabel (same as the old standalone email step).
  'mbymi-05-4-email': {
    inputType: 'textarea',
    emailLabel: 'Waitlist Confirmation Email',
    playbookField: 'waitlistSequence.confirmation',
  },
  // Step 4 of 10 ("Connect CRM to Priority Waitlist Form") folded into a
  // teaching card — verbatim copy, do not rewrite. The 5 tutorials render as a
  // bulleted list, each item hyperlinked to its YouTube video.
  'mbymi-05-3': {
    inputType: 'lesson',
    lessonNumber: '1.3',
    body: [
      'In this step, you MUST connect your Priority Waitlist Page FORM to your Email Marketing or CRM software so that anyone who "opts in" or submits their email will immediately have their email added to your CRM with the appropriate tag applied.',
      'There are several different email marketing providers out there... each with their own set of instructions on how to integrate with your landing page.  Below is a list of simple video tutorials on the most common software applications:',
      { bullet: 'Creating a Form with ActiveCampaign', link: 'https://www.youtube.com/watch?v=AmN-STRljCg' },
      { bullet: 'Creating a Form with MailChimp', link: 'https://www.youtube.com/watch?v=qS4D0YIXj0E' },
      { bullet: 'Creating a Form with Kajabi', link: 'https://www.youtube.com/watch?v=Ogr74okQWVU' },
      { bullet: 'Creating a Form with Brevo', link: 'https://www.youtube.com/watch?v=QqEAJ90-aJQ' },
      { bullet: 'Creating a Form with Jotform', link: 'https://www.youtube.com/watch?v=VwC6g5Ym0RQ' },
    ],
  },
  // Step 5 of 10 ("Create Priority Waitlist Confirmation Email") folded into a
  // teaching card — verbatim copy, do not rewrite. The existing email-draft
  // input is kept as a required inline textarea that fans out to the embedded
  // mbymi-05-4-email task (which carries emailLabel → Emails panel). AI Assist
  // opens the Email Bot.
  'mbymi-05-4': {
    inputType: 'lesson',
    lessonNumber: '1.4',
    aiBot: { name: 'Email Bot', url: BOT_URLS.email },
    body: [
      'With your CRM, you\'ll want to have a confirmation email delivered to your recipient as soon as they "register" for your Priority Waitlist.',
      'Below is the ACTUAL confirmation email I send:',
      { image: '', alt: 'Priority Waitlist confirmation email' },
      {
        bold: 'Note:',
        text: ' you can always add additional emails in your follow-up sequence that share your story, other valuable content, and customer case studies!',
      },
    ],
    subTasks: [
      {
        id: 'mbymi-05-4-email',
        label: 'Your confirmation email:',
        inputType: 'textarea',
        minChars: 30,
        placeholder: 'Draft your confirmation email here…',
      },
    ],
    example:
      "Subject: You're on the waitlist 🎉\nBody: Confirms their spot, sets the timeline for what they'll receive over the next X days, links to one piece of pillar content while they wait.",
  },

  // ---- Facebook Group Creation --------------------------------------------
  // FB Group track (optional). Pure teaching cards — no inputs, so Mark
  // complete is ALWAYS enabled (the whole FB-group section is optional, never
  // mandatory). Images are dashed placeholders until the real assets arrive.
  'mbymi-06-1': {
    inputType: 'lesson',
    lessonNumber: '2',
    body: [
      { image: '', alt: 'Facebook Group Creation' },
      { bold: '2.1 FB Group Process' },
      'To create more engagement and conversation around your course "topic," you can ALSO create a FB Group.',
      'After someone joins your PRIORITY waitlist, you can direct them to a FB group to keep them engaged.',
      'Answer questions, do Facebook Live, and overall just engage with everyone leading up to the announcement of your Pre-Release Offer.',
      { image: '', alt: 'FB Group example' },
    ],
    // Optional URL capture — does NOT gate Mark complete (FB group is optional).
    // Feeds the Links panel via the embedded task's linkLabel.
    subTasks: [
      {
        id: 'mbymi-06-1-link',
        label: 'Facebook Group URL (optional):',
        inputType: 'url',
        optional: true,
        placeholder: 'https://facebook.com/groups/...',
      },
    ],
  },

  // ---- Waitlist Emails phase ----------------------------------------------
  // Intro card + the Day 0–10 autoresponder sequence. Each Day card is a
  // teaching lesson (verbatim copy) that KEEPS its email-draft input as a
  // required textarea, fanned out to an embedded `…-email` task carrying the
  // emailLabel (Emails panel) + playbookField. AI Assist = Promo Campaign Bot.
  'mbymi-07-0': {
    inputType: 'lesson',
    lessonNumber: '3',
    body: [
      "In this section, you can create a series of SIMPLE (key word there!) emails spread out over time in an \"email autoresponder' campaign that keeps people engaged.",
      'I have included a list of sample suggestions for email topics in this section',
    ],
  },
  'mbymi-07-1': {
    inputType: 'lesson',
    lessonNumber: '3.1',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
    body: [
      'In this email you simply want to offer the following:',
      '1. Thank You For Joining the List',
      '2. Reminder of Your Domino Belief (m4)',
      '3. Save the Date (if you have a date for your open cart)',
      '4. A Link to your Private FB group (optional)',
      '5. A resource or something to go consume (optional)',
      { parts: [{ link: CHATGPT_PROMPTS_URL, text: 'MBYMI PROCESS: ChatGPT Prompts' }] },
    ],
    subTasks: [
      {
        id: 'mbymi-07-1-email',
        label: 'Your Day 0 email:',
        inputType: 'textarea',
        minChars: 30,
        placeholder: 'Draft your Day 0 thank-you email…',
      },
    ],
    example:
      "Hey [first name] — you're in. Here's what's coming over the next 10 days, and the one thing I want you to think about today…",
  },
  'mbymi-07-2': {
    inputType: 'lesson',
    lessonNumber: '3.2',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
    body: [
      'In this email, you have an opportunity to start telling a bit of YOUR story... your ORIGIN STORY of how you came to do what you do. You can follow a very simple structure:',
      { bullet: 'Get Attention (start at the climax of the problem)' },
      { bullet: 'Share your BEFORE, where were you, (internal, external)' },
      { bullet: 'Share anything that shows credibility/experience' },
      { bullet: 'Get to the LOWEST POINT of the Story' },
      { bullet: 'Share what you DID specifically to get through that' },
      { bullet: 'Where you are now... who you help now' },
      { bold: 'The more specific the story the better 🙂', text: '' },
    ],
    subTasks: [
      {
        id: 'mbymi-07-2-email',
        label: 'Your Day 2 email:',
        inputType: 'textarea',
        minChars: 30,
        placeholder: 'Draft your Day 2 origin-story email…',
      },
    ],
    example: 'A short narrative going from "I was stuck doing X" → "I figured out Y" → "that’s why I built this".',
  },
  'mbymi-07-3': {
    inputType: 'lesson',
    lessonNumber: '3.3',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
    body: [
      'In this email, you want to appease to any logic that shows people that what you are teaching is IMPORTANT.',
      { bullet: 'Are there recent articles about what you do?' },
      { bullet: 'Studies?' },
      { bullet: 'Statistics?' },
      { bullet: 'Trends?' },
    ],
    subTasks: [
      {
        id: 'mbymi-07-3-email',
        label: 'Your Day 4 email:',
        inputType: 'textarea',
        minChars: 30,
        placeholder: 'Draft your Day 4 industry stats/trends email…',
      },
    ],
    example: 'Three stats about why [the problem] is getting worse — and what most people are doing about it.',
  },
  'mbymi-07-4': {
    inputType: 'lesson',
    lessonNumber: '3.4',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
    body: [
      'Any specific client case study stories you can share in email is gong to be fantastic.',
      '"what if I don\'t have any case studies?"',
      'Well... use a "big name" industry as an example.  It does NOT have to be YOUR client in order for you to show proof that what you teach is important.',
      'ex: I use to show off how big companies were using YouTube all the time! They weren\'t my clients... but I figured, "if IBM was using YT, others should as well, right?!"',
      'Please feel free to use the pre-designed ChatGPT prompts for assistance on your emails:',
      { parts: [{ link: CHATGPT_PROMPTS_URL, text: 'MBYMI PROCESS: ChatGPT Prompts' }] },
    ],
    subTasks: [
      {
        id: 'mbymi-07-4-email',
        label: 'Your Day 6–10 email(s):',
        inputType: 'textarea',
        minChars: 30,
        placeholder: 'Draft your Day 6–10 case study email(s)…',
      },
    ],
    example: 'Two short case studies from past students — one beginner, one more advanced — proving the method works.',
  },
  // Embedded email-draft tasks for the Day cards above — emailLabel surfaces
  // each draft in the Emails panel (same labels as the old standalone steps).
  'mbymi-07-1-email': {
    inputType: 'textarea',
    emailLabel: 'Day 0 · Thank You Email',
    playbookField: 'waitlistSequence.day0',
  },
  'mbymi-07-2-email': {
    inputType: 'textarea',
    emailLabel: 'Day 2 · Origin Story Email',
    playbookField: 'waitlistSequence.day2',
  },
  'mbymi-07-3-email': {
    inputType: 'textarea',
    emailLabel: 'Day 4 · Stats/Trends Email',
    playbookField: 'waitlistSequence.day4',
  },
  'mbymi-07-4-email': {
    inputType: 'textarea',
    emailLabel: 'Day 6–10 · Case Study Email(s)',
    playbookField: 'waitlistSequence.caseStudies',
  },

  // ---- Promote Priority Waitlist (Promo phase) ----------------------------
  // Intro card + the two promo lessons. 4.1 / 4.2 are teaching cards (verbatim
  // copy) that KEEP their drafting inputs as required textareas, fanned out to
  // embedded `…-input` tasks (preserving the playbook fields). AI Assist on 4.2
  // = Promo Campaign Bot. Images are dashed placeholders until assets arrive.
  'mbymi-08-1': {
    inputType: 'lesson',
    lessonNumber: '4',
    body: [
      { image: '', alt: 'Promote Early Interest List' },
      { bold: '4.1 Promotion Options:' },
      'Now it\'s time to "tease" your "Early-Interest" List. Explore your Options for Promotion: Your Podcast, Being a Guest on Other Podcasts, a Popular Blog, or other platforms you can leverage.This is your chance to get the word out about your brand new upcoming program.',
      { image: '', alt: 'Promotion Options' },
    ],
    subTasks: [
      {
        id: 'mbymi-08-1-input',
        label: 'Your promotion channels:',
        inputType: 'textarea',
        minChars: 10,
        placeholder: 'List the channels you’ll use (podcast, social, email, partnerships…)',
      },
    ],
  },
  'mbymi-08-2': {
    inputType: 'lesson',
    lessonNumber: '4.2',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
    body: [
      'The Following is a Simple "Copy Formula" to get people excited to join your Priority Waitlist in anticipation for your program\'s release!',
      { bold: 'The Problem Context:', text: ' Identify a problem others have, that you\'ve been able to solve.' },
      { bold: 'The Big Idea:', text: ' Your Big Idea is about putting together something that can help people.' },
      { bold: 'The Pull:', text: ' It\'s going to be an intimate, small "beta" group.' },
      { bold: 'The Call to Action:', text: ' Tell them what to do next.' },
      { bold: 'EXAMPLE:', text: '' },
      '"After five years of running our own successful podcast, and seeing so many entrepreneurs struggle with theirs, I realized the big disconnect is in HOW you to put content together in away that doesn\'t just get attention and provide value, but also turns a casual listener into a lifetime loyal customer.',
      'I\'ve decided to teach our exact process for Podcast Growth so more people with important messages like yourself can get out to more people.',
      'This is going to be a small, intimate group that we\'ll be launching in a few weeks.  Probably limited to just 20 members.',
      'To get on the interest list, so you are notified as soon as we open this open, click the link below."',
      { parts: [{ link: CHATGPT_PROMPTS_URL, text: 'MBYMI PROCESS: ChatGPT Prompts' }] },
      { bold: 'EXAMPLES of INSTAGRAM Content Promoting Your Priority List', text: '' },
      { image: '', alt: 'Instagram content examples' },
      { parts: [{ link: 'https://www.instagram.com/p/C6o2yC-ykHd/', text: 'Instagram Content Example #1' }] },
      { parts: [{ link: 'https://www.instagram.com/p/C6EySq3voBo/', text: 'Instagram Content Example #2' }] },
      { parts: [{ link: 'https://www.instagram.com/p/C7DYyi7O3tx/', text: 'Instagram Content Example #3' }] },
      { bold: 'EXAMPLE Email Promoting Your Priority List', text: '' },
      { parts: [{ link: 'https://drive.google.com/file/d/1_Iw9s7d_hs4bR5lxX8kafJcIq9Owcu4u/view', text: 'Link to the Email Promoting Your Priority List PDF' }] },
      { image: '', alt: 'Email promoting priority list' },
    ],
    subTasks: [
      {
        id: 'mbymi-08-2-input',
        label: 'Your promotion content:',
        inputType: 'textarea',
        minChars: 30,
        placeholder: 'Draft 1–2 promotion posts/emails using James’s copy formula…',
      },
    ],
  },
  // Embedded drafting inputs for cards 4.1 / 4.2 (preserve the playbook fields).
  'mbymi-08-1-input': {
    inputType: 'textarea',
    playbookField: 'promote.channels',
  },
  'mbymi-08-2-input': {
    inputType: 'textarea',
    playbookField: 'promote.copy',
  },

  // ---- Create Your Product (Offer phase) ----------------------------------
  // Intro card + the two offer lessons (verbatim copy). 5.1 / 5.2 keep their
  // drafting inputs as required textareas, fanned out to embedded `…-input`
  // tasks (preserving playbook fields). AI Assist: 5.1 = Irresistible Offer
  // Bot, 5.2 = Product Outline Bot.
  'mbymi-09-0': {
    inputType: 'lesson',
    lessonNumber: '05',
    body: [
      "In this step, you'll get clear on WHAT you're selling and what's included!",
    ],
  },
  'mbymi-09-1': {
    inputType: 'lesson',
    lessonNumber: '5.1',
    aiBot: { name: 'Irresistible Offer Bot', url: BOT_URLS.offer },
    body: [
      {
        parts: [
          { text: 'When following Monetize Before You Make It, you have the opportunity to launch a course or program before you create any of the content. ' },
          { bold: 'BUT' },
          { text: ' that does not mean you don\'t know what you\'re selling! You must get clear on your OFFER first. You can do that by following the ' },
          {
            link: 'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/1531339/posts/2157450897',
            text: 'Offer Creation Process',
          },
          { text: ' inside of Module 3.' },
        ],
      },
      'Here are the "deliverables" that will tell you that you have successfully completed this step:',
      '1. You are clear on the PROMISE of this offer. Who it is for, what problem you solve, what transformation you provide.',
      '2. You have clarity on your deliverables. How long is the program? What else is included?',
      '3. The Price Point. How much will it be? How much are you charging for the Beta?',
    ],
    subTasks: [
      {
        id: 'mbymi-09-1-input',
        label: 'Your offer (promise, deliverables, price):',
        inputType: 'textarea',
        minChars: 30,
        placeholder: 'Promise: …\nDeliverables: …\nPrice: …',
      },
    ],
    example:
      "Promise: Launch your first paid program to 30 founding members in 6 weeks.\nDeliverables: 6 weekly live calls + Notion playbook + Slack community.\nPrice: $497 one-time.",
  },
  'mbymi-09-2': {
    inputType: 'lesson',
    lessonNumber: '5.2',
    aiBot: { name: 'Product Outline Bot', url: BOT_URLS.productOutline },
    body: [
      "Once you have gained clarity on your OFFER, it's time to create a general Outline of the content deliverables. My advice here is to create a timeline for the delivery of your course (2-8 weeks) and have ONE TOPIC delivered per week.",
      'Here are the "deliverables" that will tell you that you have successfully completed this step:',
      '1. You have a completed "course outline"',
      { indent: '1. List of Modules/Weeks TOPICS' },
      { indent: '2. a rough idea of the content covered in each module' },
      "2. Get a Week ahead! Turn your first week's outline into Keynote (Powerpoint) Slides",
      '3. Create a "Welcome" Video or tutorial that can be watched immediately in your course portal (Kajabi) once people join.',
      'Here is a SAMPLE Course Outline for "Podcasting"',
      { image: '', alt: 'Sample Podcasting Course Outline' },
      {
        parts: [
          {
            link: 'https://drive.google.com/file/d/1lbqQyQbgR3U3HCL7wF2aIXHGV5WrYEHK/view',
            text: 'Link to the Sample Podcasting Course Outline PDF',
          },
        ],
      },
      {
        bold: 'IMPORTANT:',
        text: " When you are a new course creator, it's very common to get in your head and struggle with what you teach, and how you teach it. Inside Business By Design, I have included an entire MINICOURSE on how to craft the BEST program for your students. If you would like more assistance in this area, click the link below to access Program Design:",
      },
      {
        parts: [
          {
            link: 'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/214968',
            text: 'ACCESS Program Design NOW!',
          },
        ],
      },
    ],
    subTasks: [
      {
        id: 'mbymi-09-2-input',
        label: 'Your course outline / agenda:',
        inputType: 'textarea',
        minChars: 30,
        placeholder: 'Sketch the full course outline / module agenda…',
      },
    ],
  },
  // Embedded drafting inputs for cards 5.1 / 5.2 (preserve the playbook fields).
  'mbymi-09-1-input': {
    inputType: 'textarea',
    playbookField: 'offer.fullDefinition',
  },
  'mbymi-09-2-input': {
    inputType: 'textarea',
    playbookField: 'product.outline',
  },

  // ---- Payment + Delivery phase -------------------------------------------
  // Intro card + 6 build cards (verbatim copy). Each external-build card keeps
  // its OPTIONAL URL capture (does not gate Mark complete) feeding the Links
  // panel via an embedded `…-link` task. 6.2 has no input (was an acknowledge).
  // 6.5 keeps the Sales/Landing Page Copy Bot. Images are dashed placeholders.
  'mbymi-10-0': {
    inputType: 'lesson',
    lessonNumber: '06',
    body: [
      "In this step, you'll need to set up a way for people to PAY YOU and a way to deliver ACCESS to your Beta Program.",
      'The Deliverables needed to call this step complete include:',
      '1. A checkout page',
      '2. The checkout page connected with Payment Processor (like Stripe)',
      '3. A Thank You Confirmation Page Redirect AFTER Checkout Page',
      '4. A Members-Only, Password-Protected Portal',
      '5. A Sales Page (Optional)',
    ],
  },
  'mbymi-10-1': {
    inputType: 'lesson',
    lessonNumber: '6.1',
    body: [
      'Inside Business By Design, there is a step-by-step process for designing and building your checkout page. For us, we use and recommend KAJABI. Samcart is another option we use and recommend.',
      {
        parts: [
          { text: 'Please refer to out ' },
          {
            link: 'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/218956/posts/750131',
            text: 'Checkout Page Process',
          },
          { text: ', to create your Checkout Page.' },
        ],
      },
      { image: '', alt: 'Checkout Page' },
    ],
    subTasks: [
      { id: 'mbymi-10-1-link', label: 'Checkout Page URL (optional):', inputType: 'url', optional: true, placeholder: 'https://...' },
    ],
  },
  'mbymi-10-5': {
    inputType: 'lesson',
    lessonNumber: '6.2',
    body: [
      "In this step, you'll need to make sure you have connected your checkout page to STRIPE and/or Paypal. Whatever software you are using, will have instructions on this.  We use Kajabi.",
      {
        parts: [
          {
            link: 'https://help.kajabi.com/articles/api-integrations/payment-integrations/connect-a-third-party-payment-gateway-to-kajabi#h_01HMSCSE8RX5EE31PPGMBBQM9D',
            text: 'How to Connect a Third-Party Payment Gateway to Kajabi',
          },
        ],
      },
      { image: '', alt: 'Connect to Payment Process' },
    ],
  },
  'mbymi-10-2': {
    inputType: 'lesson',
    lessonNumber: '6.3',
    body: [
      'This is the page your founding members will see as soon as they submit their credit card information. Here are the essential ingredients I recommend having on this page.',
      '1. A headline that confirms their purchase, thanks them for their investment, and directs them on next step',
      '2. A simple "talking head" video that thanks and welcomes your new members, and reinstates the promise',
      '3. Simple instructions on how to get started and access all the course materials, live calls, etc.',
      {
        parts: [
          {
            link: 'https://drive.google.com/file/d/148uRfywg--sQy5FhJjI9Td-H5hXGSjMz/view',
            text: 'Below is an actual picture of our thank you page.',
          },
        ],
      },
      { image: '', alt: 'Thank You Confirmation Page' },
    ],
    subTasks: [
      { id: 'mbymi-10-2-link', label: 'Thank You Page URL (optional):', inputType: 'url', optional: true, placeholder: 'https://...' },
    ],
  },
  'mbymi-10-3': {
    inputType: 'lesson',
    lessonNumber: '6.4',
    body: [
      "We use Kajabi to house all of our products, courses and trainings.  You'll want to build out a simple course inside Kajabi that will have the following:",
      '1. Any trainings you already have available',
      '2. information on how to register for calls',
      '3. placeholders for replays',
      '4.',
      'Here is an example of Jen Finley\'s completed BETA COURSE delivery. On the left side is the Kajabi "backend" design. On the right side, is the customer-facing portal.',
      { image: '', alt: 'Members-Only Portal example' },
    ],
    subTasks: [
      { id: 'mbymi-10-3-link', label: 'Member Portal URL (optional):', inputType: 'url', optional: true, placeholder: 'https://...' },
    ],
  },
  'mbymi-10-4': {
    inputType: 'lesson',
    lessonNumber: '6.5',
    aiBot: { name: 'Sales/Landing Page Copy Bot', url: BOT_URLS.salesPage },
    body: [
      {
        parts: [
          { text: 'Creating your Sales Page is optional here. (Think Minimum Viable Promotion!)  It is a lot more work to create a Sales Page. If you use a webinar, this can help to sell. But even a mini sales page can be better than nothing.  You can follow our ' },
          {
            link: 'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/218956/posts/750129',
            text: 'Sales Page Creation Process',
          },
          { text: '.' },
        ],
      },
    ],
    subTasks: [
      { id: 'mbymi-10-4-link', label: 'Sales Page URL (optional):', inputType: 'url', optional: true, placeholder: 'https://...' },
    ],
  },
  // Embedded URL captures for the Payment + Delivery build cards.
  'mbymi-10-1-link': { inputType: 'url', linkLabel: 'Checkout Page' },
  'mbymi-10-2-link': { inputType: 'url', linkLabel: 'Post-Purchase Thank You' },
  'mbymi-10-3-link': { inputType: 'url', linkLabel: 'Member Portal' },
  'mbymi-10-4-link': { inputType: 'url', linkLabel: 'Sales Page' },

  // ---- Flash Sale phase ---------------------------------------------------
  // Intro card + the flash-sale lesson (verbatim copy). 7.1 keeps its email
  // draft as a required textarea → embedded mbymi-11-1-email (Emails panel).
  // AI Assist = Promo Campaign Bot. Images are dashed placeholders.
  'mbymi-11-1': {
    inputType: 'lesson',
    lessonNumber: '07',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
    body: [
      { image: '', alt: 'Flash Sale' },
      { bold: '7.1 48-72 Hour Flash Sale Process' },
      'The "FLASH SALE" step is the phase where you actually PITCH and SELL your Beta OFFER to everyone on your Priority List.  (note, feel free to also mirror the same messaging across Social Media for more reach).',
      "If you have been following all the steps, and things have been working, then you should have a good amount of quality leads that have registered to that Priority List. These leads have said YES to learning more about this program. So now... it's time to make the offer and fill your beta!",
      'There are two things that make this work:',
      '#1. They raised their hand to be the first one notified when this program would become available! (So... notify them! They gave you permission!)',
      'and #2. The scarcity of limited seats.',
      {
        bold: 'Note:',
        text: ' My first one-on-one client followed this process, and sold 34 out of his 60 seats... with one email!',
      },
      { image: '', alt: 'Sample Flash Sale Emails' },
      {
        parts: [
          {
            link: 'https://drive.google.com/file/d/1jP7i-Cu82oapWKfVAGRKiEE65-qDUwPk/view',
            text: 'Link to the Sample Flash Sale Emails PDF',
          },
        ],
      },
    ],
    subTasks: [
      {
        id: 'mbymi-11-1-email',
        label: 'Your flash sale announcement email:',
        inputType: 'textarea',
        minChars: 30,
        placeholder: 'Draft the flash sale announcement email…',
      },
    ],
  },
  'mbymi-11-1-email': {
    inputType: 'textarea',
    emailLabel: 'Flash Sale Announcement Email',
    playbookField: 'flashSale.announcement',
  },

  // ---- Webinar phase (optional) -------------------------------------------
  // Single card (verbatim copy). The whole phase is optional, so the webinar-
  // plan input is OPTIONAL (never gates Mark complete) and feeds the playbook
  // field. AI Assist = Webinar Outline Bot. Image is a dashed placeholder.
  'mbymi-12-1': {
    inputType: 'lesson',
    lessonNumber: '08',
    aiBot: { name: 'Webinar Outline Bot', url: BOT_URLS.webinar },
    body: [
      "If you didn't fill out your beta with the emails, you have an option to now go and run a webinar or two. This is a strategy of inviting your entire audience to register and attend a free training class where you pitch your beta at the end of the webinar.",
      'Deliver 45 minutes of HIGH-VALUE CONTENT and make a direct invite selling spots into your Founding Members Group. Direct them straight to the Checkout Page or Sales Page.',
      'Mention the remaining spots. Mention how the price will go up for everyone else. Note: My first one-on-one client sent people straight from the webinar to a Checkout Page. No payment plans, just one option to pay $297.',
      'This is a SEPARATE process. Which we have laid out for you inside Business By Design. You can follow that process here:',
      {
        parts: [
          {
            link: 'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/720756/posts/2157450939',
            text: 'Webinar Creation and Promotion Process.',
          },
        ],
      },
      { image: '', alt: 'Webinar' },
    ],
    subTasks: [
      {
        id: 'mbymi-12-1-input',
        label: 'Your webinar plan (optional):',
        inputType: 'textarea',
        optional: true,
        placeholder: 'Title, hook, key teaching points, pitch transition…',
      },
    ],
  },
  'mbymi-12-1-input': {
    inputType: 'textarea',
    playbookField: 'webinar.plan',
  },

  // ---- 4-Day Follow-Up phase (optional) -----------------------------------
  // Single card (verbatim copy). Optional phase, so the follow-up sequence
  // input is OPTIONAL (never gates Mark complete); it still feeds the Emails
  // panel via embedded mbymi-13-2-email. AI Assist = Promo Campaign Bot.
  'mbymi-13-2': {
    inputType: 'lesson',
    lessonNumber: '09',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
    body: [
      "If you do decide to offer a webinar or two, you'll also want to create a  a 4- to 7-Day follow up campaign with a DEADLINE.",
      'Either the TOTAL spots fill up, or you hit deadline. But the promotion ends when one of those two things happen.  Send a 4-Day Follow-Up Email Series where you emphasize when the group will be closing.  Give a deadline and/or let your spots fill up - whichever comes first!',
      {
        parts: [
          { text: 'For more clarity on how to execute on your Follow-Up Sequence, you can follow ' },
          {
            link: 'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/218956/posts/750130',
            text: 'The Ultimate Follow-Up Process',
          },
          { text: '.' },
        ],
      },
      { image: '', alt: '4-Day Follow-Up' },
    ],
    subTasks: [
      {
        id: 'mbymi-13-2-email',
        label: 'Your 4-day follow-up sequence (optional):',
        inputType: 'textarea',
        optional: true,
        placeholder: 'Draft the 4–7 day follow-up email sequence outline…',
      },
    ],
  },
  'mbymi-13-2-email': {
    inputType: 'textarea',
    emailLabel: '4–7 Day Follow-Up Sequence',
    playbookField: 'followUp.sequence',
  },

  // ---- Close Day phase (optional) -----------------------------------------
  // Single card (verbatim copy). Optional — the cart-close email input is
  // OPTIONAL (never gates Mark complete) and feeds the Emails panel via the
  // embedded mbymi-14-1-email task. AI Assist = Promo Campaign Bot; completing
  // prompts a metrics check (final numbers).
  'mbymi-14-1': {
    inputType: 'lesson',
    lessonNumber: '10',
    aiBot: { name: 'Promo Campaign Bot', url: BOT_URLS.promo },
    promptMetricsUpdate: true,
    body: [
      "This optional step is available to you, if you still haven't filled your BETA. If it isn't filled, it still helps to have a deadline.  I had a student who filled their 60 spots at 5pm on the day of closing!",
      {
        parts: [
          { text: 'Use the "Cart Close Day" Email from ' },
          {
            link: 'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/218956/posts/750130',
            text: 'The Ultimate Follow-Up Process',
          },
          { text: ' to inform your audience of this deadline and get people signed up!' },
        ],
      },
      "...and if all spots still aren't filled, that's okay!",
    ],
    subTasks: [
      {
        id: 'mbymi-14-1-email',
        label: 'Your cart close day email (optional):',
        inputType: 'textarea',
        optional: true,
        placeholder: 'Draft the cart close day email…',
      },
    ],
  },
  'mbymi-14-1-email': {
    inputType: 'textarea',
    emailLabel: 'Cart Close Day Email',
    playbookField: 'closeDay.email',
  },

  // ---- Launch Debrief phase -----------------------------------------------
  // Single card. Keeps the special `debrief` input type (structured 7-section
  // form in the Debrief tab + Save Debrief celebration), and renders the
  // placeholder image, the "11.1 Debrief Process" heading + verbatim teaching
  // copy, and the Launch Debrief Analyzer AI button on the card itself.
  'mbymi-15-1': {
    inputType: 'debrief',
    lessonNumber: '11',
    aiBot: { name: 'Launch Debrief Analyzer', url: BOT_URLS.debrief },
    body: [
      { image: '', alt: 'Launch Debrief' },
      { bold: '11.1 Debrief Process' },
      {
        parts: [
          { text: 'Now that doors are closed and you have celebrated your launch, it is time to complete a launch debrief! Follow the steps for ' },
          {
            link: 'https://www.jameswedmoretraining.com/products/james-wedmore-s-business-by-design/categories/1545212/posts/5205851',
            text: 'The Launch Debrief Process',
          },
          { text: " to understand the full scope of your launch's performance and identify areas to replicate or improve for your next launch." },
        ],
      },
    ],
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
