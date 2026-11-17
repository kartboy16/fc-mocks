(function () {
  const support = "support@financialtechtools.ca";
  const subject = "Help verifying a custom sending domain — Your Firm Name";
  const body = [
    "Hello,",
    "",
    "Please help me set up and verify a custom sending domain.",
    "",
    "Firm: Your Firm Name",
    "Domain: yourfirm.com",
    "Advisor: Jane Advisor",
    "",
    "Thank you."
  ].join("\n");
  const mailto = "mailto:" + support
    + "?subject=" + encodeURIComponent(subject)
    + "&body=" + encodeURIComponent(body);

  window.FC869 = {
    firm: "Your Firm Name",
    advisor: "Jane Advisor",
    domain: "yourfirm.com",
    fromName: "Jane Advisor",
    fromEmail: "jane.advisor@yourfirm.com",
    listName: "All subscribers",
    listCount: 248,
    support: support,
    mailSubject: subject,
    mailBody: body,
    mailto: mailto,
    schedulePick: "Thursday, Nov 20, 2026, 9:00 AM PT",
    schedulePickValue: "2026-11-20T09:00",
    draft: {
      id: "nov",
      name: "November market notes",
      subject: "November market notes for your inbox",
      status: "Draft",
      created: "Nov 12, 2026",
      scheduledAt: null,
      sent: 0, opens: 0, clicks: 0
    },
    scheduled: {
      id: "year",
      name: "Year-end planning tips",
      subject: "Three year-end planning ideas for your clients",
      status: "Scheduled",
      created: "Nov 10, 2026",
      scheduledAt: "Thursday, Nov 20, 2026, 9:00 AM PT",
      sent: 0, opens: 0, clicks: 0
    },
    sent: {
      id: "oct",
      name: "October newsletter",
      subject: "October market notes",
      status: "Sent",
      created: "Oct 8, 2026",
      scheduledAt: null,
      sent: 241, opens: 98, clicks: 22
    },
    copy: {
      title: "Your domain isn’t verified",
      introSend: "yourfirm.com isn’t verified yet, so this campaign can’t be sent.",
      introSched: "yourfirm.com isn’t verified yet, so this campaign can’t be scheduled.",
      introKeep: "yourfirm.com isn’t verified yet, so this campaign can’t be sent or rescheduled.",
      point: "Verify yourfirm.com in Email Campaigns → Settings before you send.",
      pointSched: "Verify yourfirm.com in Email Campaigns → Settings before you schedule.",
      stateDraftSend: "This campaign stays a draft. Nothing has been sent.",
      stateDraftSched: "This campaign stays a draft. The date and time you chose were not saved.",
      stateKeep: "This campaign is still scheduled for Thursday, Nov 20, 2026, 9:00 AM PT. Nothing was sent, and the schedule was not changed.",
      primary: "Verify your domain",
      secondary: "Get help setting up your domain",
      close: "Close",
      bannerHint: "yourfirm.com isn’t verified yet. You can save this draft, but you can’t send or schedule until the domain is verified.",
      bannerBlock: "yourfirm.com isn’t verified yet. Send and Schedule are unavailable until the domain is verified.",
      listBanner: "yourfirm.com isn’t verified yet. Send and Schedule are unavailable for every campaign until the domain is verified.",
      disabledReason: "Send and Schedule are unavailable until yourfirm.com is verified.",
      todayConfirm: "Custom domain is not verified. Send using your default sender instead?",
      todayError: "id is not defined",
      settingsLead: "yourfirm.com is not verified yet. Add the DNS records below, then click Check Status. You can’t send or schedule campaigns until this domain is verified."
    }
  };
})();
