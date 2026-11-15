/* Generic fixtures only. Times are America/Vancouver (PT). */
window.FC890 = (function () {
  const CAMPAIGN = {
    name: "November market notes",
    subject: "Your November update from Your Firm Name",
    audience: "All subscribers",
    sentAt: "Nov 10, 2026, 9:00 AM PT",
    sent: 1240,
    delivered: 1186,
    uniqueOpens: 512,
    uniqueClicks: 96,
    bounced: 28,
    permanent: 6,
    temporary: 22,
    complained: 1,
    noResult: 25
  };

  const FEATURED = [
    {
      email: "pat.client@outlook.example",
      domain: "outlook.example",
      status: "bounced",
      bounceType: "temporary",
      bounceSubType: "General",
      diagnostic: "smtp; 450 4.4.1 Temporarily refused — the mail server[outlook.example] is temporarily unavailable",
      smtp: "450 4.4.1",
      contactStatus: "subscribed",
      softBounceCount: 3,
      suppression: "unknown",
      lastEventAt: "Nov 10, 2026, 9:02:18 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:01 AM PT", source: "event.send.timestamp" },
        { type: "Bounce", at: "Nov 10, 2026, 9:02:18 AM PT", source: "event.bounce.timestamp", bounceType: "Temporary (Transient)", bounceSubType: "General", diagnostic: "smtp; 450 4.4.1 Temporarily refused — the mail server[outlook.example] is temporarily unavailable", smtp: "450 4.4.1" }
      ]
    },
    {
      email: "morgan.client@example.com",
      domain: "example.com",
      status: "bounced",
      bounceType: "permanent",
      bounceSubType: "NoEmail",
      diagnostic: "smtp; 550 5.1.1 User unknown",
      smtp: "550 5.1.1",
      contactStatus: "bounced",
      softBounceCount: 0,
      suppression: "BOUNCE",
      lastEventAt: "Nov 10, 2026, 9:00:22 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:02 AM PT", source: "event.send.timestamp" },
        { type: "Bounce", at: "Nov 10, 2026, 9:00:22 AM PT", source: "event.bounce.timestamp", bounceType: "Permanent", bounceSubType: "NoEmail", diagnostic: "smtp; 550 5.1.1 User unknown", smtp: "550 5.1.1" }
      ]
    },
    {
      email: "casey.client@example.com",
      domain: "example.com",
      status: "complained",
      bounceType: "",
      bounceSubType: "",
      diagnostic: "",
      smtp: "",
      contactStatus: "unsubscribed",
      softBounceCount: 0,
      suppression: "COMPLAINT",
      lastEventAt: "Nov 10, 2026, 2:14:07 PM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:02 AM PT", source: "event.send.timestamp" },
        { type: "Delivery", at: "Nov 10, 2026, 9:00:06 AM PT", source: "event.delivery.timestamp" },
        { type: "Complaint", at: "Nov 10, 2026, 2:14:07 PM PT", source: "event.complaint.timestamp", feedback: "abuse" }
      ]
    },
    {
      email: "sam.planner@example.com",
      domain: "example.com",
      status: "none",
      bounceType: "",
      bounceSubType: "",
      diagnostic: "",
      smtp: "",
      contactStatus: "subscribed",
      softBounceCount: 0,
      suppression: "unknown",
      lastEventAt: "Nov 10, 2026, 9:00:03 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:03 AM PT", source: "event.send.timestamp" }
      ]
    },
    {
      email: "alex.client@example.com",
      domain: "example.com",
      status: "delivered",
      bounceType: "",
      bounceSubType: "",
      diagnostic: "",
      smtp: "",
      contactStatus: "subscribed",
      softBounceCount: 0,
      suppression: "not suppressed",
      lastEventAt: "Nov 10, 2026, 9:00:04 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:01 AM PT", source: "event.send.timestamp" },
        { type: "Delivery", at: "Nov 10, 2026, 9:00:04 AM PT", source: "event.delivery.timestamp" },
        { type: "Open", at: "Nov 10, 2026, 9:18:41 AM PT", source: "event.open.timestamp" }
      ]
    },
    {
      email: "jane.subscriber@example.com",
      domain: "example.com",
      status: "delivered",
      bounceType: "",
      bounceSubType: "",
      diagnostic: "",
      smtp: "",
      contactStatus: "subscribed",
      softBounceCount: 0,
      suppression: "not suppressed",
      lastEventAt: "Nov 10, 2026, 9:00:05 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:01 AM PT", source: "event.send.timestamp" },
        { type: "Delivery", at: "Nov 10, 2026, 9:00:05 AM PT", source: "event.delivery.timestamp" }
      ]
    },
    {
      email: "robin.client@hotmail.example",
      domain: "hotmail.example",
      status: "bounced",
      bounceType: "temporary",
      bounceSubType: "MailboxFull",
      diagnostic: "smtp; 452 4.2.2 The email account that you tried to reach is over quota",
      smtp: "452 4.2.2",
      contactStatus: "subscribed",
      softBounceCount: 1,
      suppression: "unknown",
      lastEventAt: "Nov 10, 2026, 9:03:41 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:02 AM PT", source: "event.send.timestamp" },
        { type: "Bounce", at: "Nov 10, 2026, 9:03:41 AM PT", source: "event.bounce.timestamp", bounceType: "Temporary (Transient)", bounceSubType: "MailboxFull", diagnostic: "smtp; 452 4.2.2 The email account that you tried to reach is over quota", smtp: "452 4.2.2" }
      ]
    },
    {
      email: "lee.client@example.com",
      domain: "example.com",
      status: "delivered",
      bounceType: "",
      bounceSubType: "",
      diagnostic: "",
      smtp: "",
      contactStatus: "subscribed",
      softBounceCount: 0,
      suppression: "not suppressed",
      lastEventAt: "Nov 10, 2026, 9:00:07 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:02 AM PT", source: "event.send.timestamp" },
        { type: "Delivery", at: "Nov 10, 2026, 9:00:07 AM PT", source: "event.delivery.timestamp" }
      ]
    },
    {
      email: "kim.client@example.com",
      domain: "example.com",
      status: "none",
      bounceType: "",
      bounceSubType: "",
      diagnostic: "",
      smtp: "",
      contactStatus: "subscribed",
      softBounceCount: 0,
      suppression: "unknown",
      lastEventAt: "Nov 10, 2026, 9:00:03 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:03 AM PT", source: "event.send.timestamp" }
      ]
    },
    {
      email: "drew.client@example.com",
      domain: "example.com",
      status: "delivered",
      bounceType: "",
      bounceSubType: "",
      diagnostic: "",
      smtp: "",
      contactStatus: "subscribed",
      softBounceCount: 0,
      suppression: "not suppressed",
      lastEventAt: "Nov 10, 2026, 9:00:08 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:02 AM PT", source: "event.send.timestamp" },
        { type: "Delivery", at: "Nov 10, 2026, 9:00:08 AM PT", source: "event.delivery.timestamp" }
      ]
    },
    {
      email: "taylor.client@outlook.example",
      domain: "outlook.example",
      status: "bounced",
      bounceType: "temporary",
      bounceSubType: "General",
      diagnostic: "smtp; 450 4.4.1 Temporarily refused",
      smtp: "450 4.4.1",
      contactStatus: "subscribed",
      softBounceCount: 2,
      suppression: "unknown",
      lastEventAt: "Nov 10, 2026, 9:02:44 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:02 AM PT", source: "event.send.timestamp" },
        { type: "Bounce", at: "Nov 10, 2026, 9:02:44 AM PT", source: "event.bounce.timestamp", bounceType: "Temporary (Transient)", bounceSubType: "General", diagnostic: "smtp; 450 4.4.1 Temporarily refused", smtp: "450 4.4.1" }
      ]
    },
    {
      email: "jordan.client@example.com",
      domain: "example.com",
      status: "bounced",
      bounceType: "permanent",
      bounceSubType: "General",
      diagnostic: "smtp; 550 5.1.0 Address rejected",
      smtp: "550 5.1.0",
      contactStatus: "bounced",
      softBounceCount: 0,
      suppression: "BOUNCE",
      lastEventAt: "Nov 10, 2026, 9:00:31 AM PT",
      events: [
        { type: "Send", at: "Nov 10, 2026, 9:00:03 AM PT", source: "event.send.timestamp" },
        { type: "Bounce", at: "Nov 10, 2026, 9:00:31 AM PT", source: "event.bounce.timestamp", bounceType: "Permanent", bounceSubType: "General", diagnostic: "smtp; 550 5.1.0 Address rejected", smtp: "550 5.1.0" }
      ]
    }
  ];

  function pad(n) { return String(n).padStart(3, "0"); }

  function filler(i) {
    const kind = i % 17;
    let status = "delivered";
    let bounceType = "";
    let bounceSubType = "";
    let diagnostic = "";
    let smtp = "";
    let contactStatus = "subscribed";
    let softBounceCount = 0;
    let suppression = "not suppressed";
    let last = "Nov 10, 2026, 9:00:12 AM PT";
    let events = [
      { type: "Send", at: "Nov 10, 2026, 9:00:04 AM PT", source: "event.send.timestamp" },
      { type: "Delivery", at: "Nov 10, 2026, 9:00:12 AM PT", source: "event.delivery.timestamp" }
    ];
    if (kind === 0) {
      status = "none";
      suppression = "unknown";
      last = "Nov 10, 2026, 9:00:04 AM PT";
      events = [{ type: "Send", at: "Nov 10, 2026, 9:00:04 AM PT", source: "event.send.timestamp" }];
    } else if (kind === 1) {
      status = "bounced";
      bounceType = "temporary";
      bounceSubType = "General";
      diagnostic = "smtp; 450 4.4.1 Temporarily refused";
      smtp = "450 4.4.1";
      softBounceCount = 1;
      suppression = "unknown";
      last = "Nov 10, 2026, 9:04:10 AM PT";
      events = [
        { type: "Send", at: "Nov 10, 2026, 9:00:04 AM PT", source: "event.send.timestamp" },
        { type: "Bounce", at: "Nov 10, 2026, 9:04:10 AM PT", source: "event.bounce.timestamp", bounceType: "Temporary (Transient)", bounceSubType: "General", diagnostic: diagnostic, smtp: smtp }
      ];
    } else if (kind === 2 && i < 80) {
      status = "bounced";
      bounceType = "permanent";
      bounceSubType = "NoEmail";
      diagnostic = "smtp; 550 5.1.1 User unknown";
      smtp = "550 5.1.1";
      contactStatus = "bounced";
      suppression = "BOUNCE";
      last = "Nov 10, 2026, 9:00:40 AM PT";
      events = [
        { type: "Send", at: "Nov 10, 2026, 9:00:04 AM PT", source: "event.send.timestamp" },
        { type: "Bounce", at: "Nov 10, 2026, 9:00:40 AM PT", source: "event.bounce.timestamp", bounceType: "Permanent", bounceSubType: "NoEmail", diagnostic: diagnostic, smtp: smtp }
      ];
    }
    const domain = (kind === 1 && i % 2 === 0) ? "outlook.example" : "example.com";
    const local = "subscriber-" + pad(i);
    return {
      email: local + "@" + domain,
      domain,
      status,
      bounceType,
      bounceSubType,
      diagnostic,
      smtp,
      contactStatus,
      softBounceCount,
      suppression,
      lastEventAt: last,
      events
    };
  }

  // Build a capped illustration list: 12 featured + enough fillers to page realistically.
  // Total matches campaign.sent (1,240). Only the current page is rendered.
  const ROWS = FEATURED.slice();
  for (let i = 1; i <= CAMPAIGN.sent - FEATURED.length; i++) ROWS.push(filler(i));

  const HISTORY = {
    email: "pat.client@outlook.example",
    contactStatus: "subscribed",
    softBounceCount: 3,
    suppression: "unknown",
    totalOpens: 4,
    totalClicks: 1,
    uniqueCampaigns: 3,
    lastOpenAt: "Oct 13, 2026, 10:22 AM PT",
    lastClickAt: "Oct 13, 2026, 10:24 AM PT",
    campaigns: [
      { name: "November market notes", opens: 0, clicks: 0, last: "—" },
      { name: "October newsletter", opens: 2, clicks: 1, last: "Oct 13, 2026, 10:24 AM PT" },
      { name: "September notes", opens: 2, clicks: 0, last: "Sep 8, 2026, 9:41 AM PT" }
    ],
    delivery: [
      {
        campaign: "November market notes",
        events: [
          { type: "Send", at: "Nov 10, 2026, 9:00:01 AM PT", source: "event.send.timestamp" },
          { type: "Bounce", at: "Nov 10, 2026, 9:02:18 AM PT", source: "event.bounce.timestamp", bounceType: "Temporary (Transient)", bounceSubType: "General", diagnostic: "smtp; 450 4.4.1 Temporarily refused — the mail server[outlook.example] is temporarily unavailable", smtp: "450 4.4.1" }
        ]
      },
      {
        campaign: "October newsletter",
        events: [
          { type: "Send", at: "Oct 13, 2026, 10:00:00 AM PT", source: "event.send.timestamp" },
          { type: "Delivery", at: "Oct 13, 2026, 10:00:03 AM PT", source: "event.delivery.timestamp" },
          { type: "Open", at: "Oct 13, 2026, 10:22:11 AM PT", source: "event.open.timestamp" },
          { type: "Click", at: "Oct 13, 2026, 10:24:02 AM PT", source: "event.click.timestamp", url: "https://yourfirm.ca/news" }
        ]
      },
      {
        campaign: "September notes",
        events: [
          { type: "Send", at: "Sep 8, 2026, 9:00:00 AM PT", source: "event.send.timestamp" },
          { type: "Bounce", at: "Sep 8, 2026, 9:01:12 AM PT", source: "event.bounce.timestamp", bounceType: "Temporary (Transient)", bounceSubType: "General", diagnostic: "smtp; 450 4.4.1 Temporarily refused", smtp: "450 4.4.1" }
        ]
      }
    ]
  };

  const CROSS = [
    { campaign: "November market notes", advisor: "Jane Advisor", sentAt: "Nov 10, 2026, 9:00 AM PT", row: FEATURED[0] },
    { campaign: "November market notes", advisor: "Jane Advisor", sentAt: "Nov 10, 2026, 9:00 AM PT", row: FEATURED[1] },
    { campaign: "November market notes", advisor: "Jane Advisor", sentAt: "Nov 10, 2026, 9:00 AM PT", row: FEATURED[2] },
    { campaign: "November market notes", advisor: "Jane Advisor", sentAt: "Nov 10, 2026, 9:00 AM PT", row: FEATURED[3] },
    { campaign: "November market notes", advisor: "Jane Advisor", sentAt: "Nov 10, 2026, 9:00 AM PT", row: FEATURED[6] },
    { campaign: "October newsletter", advisor: "Jane Advisor", sentAt: "Oct 13, 2026, 10:00 AM PT", row: { email: "pat.client@outlook.example", domain: "outlook.example", status: "delivered", bounceType: "", lastEventAt: "Oct 13, 2026, 10:00:03 AM PT", contactStatus: "subscribed", softBounceCount: 2, suppression: "unknown", events: HISTORY.delivery[1].events } },
    { campaign: "September notes", advisor: "Jane Advisor", sentAt: "Sep 8, 2026, 9:00 AM PT", row: { email: "pat.client@outlook.example", domain: "outlook.example", status: "bounced", bounceType: "temporary", lastEventAt: "Sep 8, 2026, 9:01:12 AM PT", contactStatus: "subscribed", softBounceCount: 1, suppression: "unknown", events: HISTORY.delivery[2].events } },
    { campaign: "November market notes", advisor: "Sam Planner", sentAt: "Nov 11, 2026, 8:30 AM PT", row: { email: "alex.client@example.com", domain: "example.com", status: "delivered", bounceType: "", lastEventAt: "Nov 11, 2026, 8:30:05 AM PT", contactStatus: "subscribed", softBounceCount: 0, suppression: "not suppressed", events: [{ type: "Send", at: "Nov 11, 2026, 8:30:01 AM PT", source: "event.send.timestamp" }, { type: "Delivery", at: "Nov 11, 2026, 8:30:05 AM PT", source: "event.delivery.timestamp" }] } }
  ];

  function statusLabel(s) {
    return ({ delivered: "Delivered", bounced: "Bounced", complained: "Complained", none: "No result yet", sent: "Sent" })[s] || s;
  }
  function chipClass(s, bounceType) {
    if (s === "bounced") return bounceType === "permanent" ? "permanent" : "temporary";
    if (s === "none") return "none";
    return s;
  }
  function bounceLabel(row) {
    if (row.status !== "bounced") return "—";
    return row.bounceType === "permanent" ? "Permanent" : "Temporary";
  }

  return { CAMPAIGN, FEATURED, ROWS, HISTORY, CROSS, statusLabel, chipClass, bounceLabel };
})();
