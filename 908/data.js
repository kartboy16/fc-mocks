(function () {
  const audience = {
    id: "news",
    name: "News page audience",
    count: 1284
  };
  const otherAudience = {
    id: "events",
    name: "Event follow-ups",
    count: 86
  };

  const people = [
    { email: "subscriber@example.com", first: "Pat", last: "Example", status: "subscribed", tags: ["Newsletter", "Clients"], phone: "604-555-0100", city: "Vancouver", changed: "Nov 16, 2026, 11:42 AM", consent: "In person", consentNote: "" },
    { email: "alex.client@example.com", first: "Alex", last: "Client", status: "unsubscribed", tags: ["Newsletter"], phone: "", city: "Victoria", changed: "Nov 10, 2026, 3:18 PM", consent: "Website form", consentNote: "" },
    { email: "sam.planner@example.com", first: "Sam", last: "Planner", status: "subscribed", tags: ["Prospects"], phone: "604-555-0142", city: "Burnaby", changed: "Nov 8, 2026, 9:04 AM", consent: "Event", consentNote: "" },
    { email: "jordan.client@example.com", first: "Jordan", last: "Client", status: "subscribed", tags: ["News page"], phone: "", city: "Vancouver", changed: "Nov 5, 2026, 1:22 PM", consent: "Website form", consentNote: "" },
    { email: "casey.example@example.com", first: "Casey", last: "Example", status: "pending", tags: ["Newsletter"], phone: "", city: "", changed: "Nov 15, 2026, 4:05 PM", consent: "In person", consentNote: "" },
    { email: "riley.client@example.com", first: "Riley", last: "Client", status: "subscribed", tags: ["Clients"], phone: "604-555-0188", city: "Richmond", changed: "Oct 28, 2026, 10:11 AM", consent: "In person", consentNote: "" },
    { email: "morgan.example@example.com", first: "Morgan", last: "Example", status: "subscribed", tags: ["Clients", "Newsletter"], phone: "", city: "Vancouver", changed: "Oct 21, 2026, 2:40 PM", consent: "Imported list", consentNote: "" },
    { email: "avery.client@example.com", first: "Avery", last: "Client", status: "cleaned", tags: [], phone: "", city: "Surrey", changed: "Oct 18, 2026, 8:55 AM", consent: "Website form", consentNote: "" },
    { email: "quinn.example@example.com", first: "Quinn", last: "Example", status: "subscribed", tags: ["Prospects"], phone: "", city: "", changed: "Oct 12, 2026, 5:19 PM", consent: "Event", consentNote: "" },
    { email: "taylor.client@example.com", first: "Taylor", last: "Client", status: "subscribed", tags: ["Newsletter"], phone: "604-555-0160", city: "Vancouver", changed: "Oct 9, 2026, 11:03 AM", consent: "Website form", consentNote: "" },
    { email: "jamie.example@example.com", first: "Jamie", last: "Example", status: "unsubscribed", tags: ["News page"], phone: "", city: "North Vancouver", changed: "Sep 30, 2026, 9:47 AM", consent: "Website form", consentNote: "" },
    { email: "drew.client@example.com", first: "Drew", last: "Client", status: "subscribed", tags: [], phone: "", city: "Vancouver", changed: "Sep 22, 2026, 3:12 PM", consent: "In person", consentNote: "" }
  ];

  const page2 = [
    { email: "lee.client@example.com", first: "Lee", last: "Client", status: "subscribed", tags: ["Newsletter"], phone: "", city: "", changed: "Sep 18, 2026, 9:10 AM", consent: "Website form", consentNote: "" },
    { email: "cameron.example@example.com", first: "Cameron", last: "Example", status: "subscribed", tags: ["Clients"], phone: "", city: "", changed: "Sep 16, 2026, 4:02 PM", consent: "In person", consentNote: "" },
    { email: "skyler.client@example.com", first: "Skyler", last: "Client", status: "unsubscribed", tags: [], phone: "", city: "", changed: "Sep 12, 2026, 11:28 AM", consent: "Event", consentNote: "" },
    { email: "jamie.client@example.com", first: "Jamie", last: "Client", status: "subscribed", tags: ["News page"], phone: "", city: "", changed: "Sep 9, 2026, 2:51 PM", consent: "Website form", consentNote: "" },
    { email: "robin.example@example.com", first: "Robin", last: "Example", status: "subscribed", tags: ["Prospects"], phone: "", city: "", changed: "Sep 3, 2026, 8:17 AM", consent: "In person", consentNote: "" }
  ];

  const history = {
    "subscriber@example.com": [
      { who: "Jane Advisor", action: "updated name and phone for subscriber@example.com", when: "Nov 16, 2026, 11:42 AM PT" },
      { who: "Jane Advisor", action: "updated tags on subscriber@example.com (added Clients)", when: "Nov 14, 2026, 9:05 AM PT" },
      { who: "Jane Advisor", action: "added subscriber@example.com. Consent: In person", when: "Nov 12, 2026, 2:14 PM PT" }
    ],
    "alex.client@example.com": [
      { who: "Jane Advisor", action: "unsubscribed alex.client@example.com", when: "Nov 10, 2026, 3:18 PM PT" },
      { who: "Jane Advisor", action: "added alex.client@example.com. Consent: Website form", when: "Sep 4, 2026, 10:02 AM PT" }
    ],
    "casey.example@example.com": [
      { who: "Jane Advisor", action: "asked Mailchimp to send a confirmation email to casey.example@example.com. Status is Pending until they confirm", when: "Nov 15, 2026, 4:05 PM PT" },
      { who: "Jane Advisor", action: "unsubscribed casey.example@example.com", when: "Oct 3, 2026, 1:20 PM PT" },
      { who: "Jane Advisor", action: "added casey.example@example.com. Consent: In person", when: "Aug 19, 2026, 11:11 AM PT" }
    ],
    "avery.client@example.com": [
      { who: "Mailchimp", action: "marked avery.client@example.com as Cleaned after a bounce", when: "Oct 18, 2026, 8:55 AM PT" },
      { who: "Jane Advisor", action: "added avery.client@example.com. Consent: Website form", when: "Jul 2, 2026, 4:44 PM PT" }
    ],
    "jamie.example@example.com": [
      { who: "Jane Advisor", action: "unsubscribed jamie.example@example.com", when: "Sep 30, 2026, 9:47 AM PT" },
      { who: "Jane Advisor", action: "added jamie.example@example.com. Consent: Website form", when: "Jun 11, 2026, 2:08 PM PT" }
    ],
    "sam.planner@example.com": [
      { who: "Jane Advisor", action: "added sam.planner@example.com. Consent: Event", when: "Nov 8, 2026, 9:04 AM PT" }
    ]
  };

  const allHistory = [
    { who: "Jane Advisor", action: "updated name and phone for subscriber@example.com", when: "Nov 16, 2026, 11:42 AM PT", email: "subscriber@example.com" },
    { who: "Jane Advisor", action: "asked Mailchimp to send a confirmation email to casey.example@example.com. Status is Pending until they confirm", when: "Nov 15, 2026, 4:05 PM PT", email: "casey.example@example.com" },
    { who: "Jane Advisor", action: "updated tags on subscriber@example.com (added Clients)", when: "Nov 14, 2026, 9:05 AM PT", email: "subscriber@example.com" },
    { who: "Jane Advisor", action: "added subscriber@example.com. Consent: In person", when: "Nov 12, 2026, 2:14 PM PT", email: "subscriber@example.com" },
    { who: "Jane Advisor", action: "unsubscribed alex.client@example.com", when: "Nov 10, 2026, 3:18 PM PT", email: "alex.client@example.com" },
    { who: "Jane Advisor", action: "added sam.planner@example.com. Consent: Event", when: "Nov 8, 2026, 9:04 AM PT", email: "sam.planner@example.com" },
    { who: "Jane Advisor", action: "updated tags on jordan.client@example.com (added News page)", when: "Nov 5, 2026, 1:22 PM PT", email: "jordan.client@example.com" },
    { who: "Mailchimp", action: "marked avery.client@example.com as Cleaned after a bounce", when: "Oct 18, 2026, 8:55 AM PT", email: "avery.client@example.com" },
    { who: "Jane Advisor", action: "unsubscribed jamie.example@example.com", when: "Sep 30, 2026, 9:47 AM PT", email: "jamie.example@example.com" },
    { who: "Jane Advisor", action: "added drew.client@example.com. Consent: In person", when: "Sep 22, 2026, 3:12 PM PT", email: "drew.client@example.com" }
  ];

  const copy = {
    title: "Mailchimp Subscribers",
    help: "This is your Mailchimp audience, News page audience. It is not the FTT Mail list. Changes here update Mailchimp only.",
    historyHelp: "Every change Jane Advisor (or anyone on this account) makes to the Mailchimp audience is recorded here. This log is stored in FC, not in Mailchimp.",
    todayHelp: "Audience counts come from Mailchimp. There is no way to add, edit, unsubscribe, or remove subscribers from here.",
    casl: "This person gave me permission to email them (CASL consent).",
    caslNote: "You must have express consent before adding someone to this Mailchimp audience. They will not get a confirmation email when you add them here.",
    caslError: "Confirm that this person gave you permission to email them, and choose how you got that consent.",
    resubTitle: "Mailchimp will send a confirmation email",
    resubBody: "alex.client@example.com unsubscribed earlier, so Mailchimp will not add them back right away. Mailchimp will email them a confirmation link instead. Their status stays Pending until they confirm.",
    resubOk: "Send confirmation email",
    removeTitle: "Remove this subscriber?",
    removeBody: "Remove archives subscriber@example.com in Mailchimp. They stop getting campaigns, and you can add them again later if you have consent. This is not a permanent delete.",
    deleteTitle: "Permanently delete this subscriber?",
    deleteBody: "This cannot be undone. Mailchimp permanently deletes subscriber@example.com from the News page audience and will not let you add this address again easily. Type the email to confirm.",
    unsubTitle: "Unsubscribe this person?",
    unsubBody: "subscriber@example.com will be marked Unsubscribed in Mailchimp and will stop getting campaigns. You can ask Mailchimp to send them a confirmation email later if they want to subscribe again.",
    empty: "No subscribers in this Mailchimp audience yet. Add a subscriber to get started.",
    emptySearch: "No Mailchimp subscribers match that email.",
    loading: "Loading Mailchimp subscribers…",
    errConnect: "Connect it in Email Campaigns → Settings to manage this audience.",
    errApi: "This is a Mailchimp API error, not an FTT Mail problem. Try again in a moment.",
    toastAdd: "Subscriber added to the Mailchimp audience.",
    toastEdit: "Subscriber updated in Mailchimp.",
    toastUnsub: "Jane Advisor unsubscribed subscriber@example.com, Nov 17, 2026, 10:20 AM PT.",
    toastRemove: "Removed subscriber@example.com from the Mailchimp audience.",
    toastDelete: "Permanently deleted subscriber@example.com. This cannot be undone.",
    toastResub: "Confirmation email sent to alex.client@example.com. Their status is Pending until they confirm."
  };

  window.FC908 = {
    firm: "Your Firm Name",
    advisor: "Jane Advisor",
    audience: audience,
    audiences: [audience, otherAudience],
    people: people,
    page2: page2,
    history: history,
    allHistory: allHistory,
    tags: ["Newsletter", "Clients", "News page", "Prospects"],
    sources: ["In person", "Website form", "Event", "Imported list", "Other"],
    copy: copy,
    pageSize: 50,
    total: 1284
  };
})();
