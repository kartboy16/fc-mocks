/**
 * FC Scan #169 — Direction A dense table mock
 * Allowlist-only tags · Use for suggestions · editable names
 */
(function () {
  const STORAGE_KEY = "fc-scan-169-mock-a";

  const ALLOWLIST = [
    "life insurance",
    "family",
    "business",
    "annuities",
    "critical illness",
    "disability",
    "retirement",
    "estate planning",
    "investments",
  ];

  const DEFAULT_SERVICES = [
    {
      id: "annuities",
      name: "Annuities",
      tags: [],
      suggested: ["annuities", "retirement"],
      use: false,
    },
    {
      id: "personal-li",
      name: "Personal Life Insurance",
      tags: ["life insurance", "family"],
      suggested: ["life insurance", "family"],
      use: true,
    },
    {
      id: "corporate-li",
      name: "Corporate Life Insurance",
      tags: ["life insurance", "business"],
      suggested: ["life insurance", "business"],
      use: true,
    },
    {
      id: "ci-dis",
      name: "Critical Illness & Disability",
      tags: ["critical illness", "disability"],
      suggested: ["critical illness", "disability"],
      use: true,
    },
    {
      id: "retirement-income",
      name: "Retirement Income Planning",
      tags: ["retirement"],
      suggested: ["retirement", "annuities", "estate planning"],
      use: false,
    },
  ];

  let services = loadServices();
  let openDropdownId = null;
  let showEmpty = false;
  let beforeDismissed = sessionStorage.getItem("fc-169-before-dismissed") === "1";

  function loadServices() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (_) {}
    return DEFAULT_SERVICES.map((s) => ({ ...s, tags: [...s.tags], suggested: [...s.suggested] }));
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch (_) {}
  }

  function resetToDefaults() {
    services = DEFAULT_SERVICES.map((s) => ({
      ...s,
      tags: [...s.tags],
      suggested: [...s.suggested],
    }));
    persist();
    render();
    toast("Reset to demo defaults");
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function toast(msg) {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.innerHTML = `<span class="check" aria-hidden="true">✓</span><span>${msg}</span>`;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function renderChips(svc, chipsEl) {
    chipsEl.innerHTML = "";

    if (svc.tags.length === 0) {
      const prompt = document.createElement("button");
      prompt.type = "button";
      prompt.className = "empty-prompt";
      prompt.textContent = "Pick tags…";
      prompt.setAttribute("aria-label", "Pick tags for " + svc.name);
      prompt.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDropdown(svc.id);
      });
      chipsEl.appendChild(prompt);

      // Subtle suggested (not yet selected)
      svc.suggested.forEach((tag) => {
        if (svc.tags.includes(tag)) return;
        const sug = document.createElement("button");
        sug.type = "button";
        sug.className = "chip-suggested";
        sug.innerHTML = `<span class="hint-label">Suggested</span> ${tag}`;
        sug.title = "Click to add from allowlist";
        sug.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!svc.tags.includes(tag) && ALLOWLIST.includes(tag)) {
            svc.tags.push(tag);
            persist();
            render();
          }
        });
        chipsEl.appendChild(sug);
      });
    } else {
      svc.tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        const label = document.createElement("span");
        label.textContent = tag;
        chip.appendChild(label);
        const rm = document.createElement("button");
        rm.type = "button";
        rm.setAttribute("aria-label", "Remove " + tag);
        rm.textContent = "×";
        rm.addEventListener("click", (e) => {
          e.stopPropagation();
          svc.tags = svc.tags.filter((t) => t !== tag);
          persist();
          render();
        });
        chip.appendChild(rm);
        chipsEl.appendChild(chip);
      });

      // Suggested not yet selected
      svc.suggested.forEach((tag) => {
        if (svc.tags.includes(tag)) return;
        const sug = document.createElement("button");
        sug.type = "button";
        sug.className = "chip-suggested";
        sug.innerHTML = `+ ${tag}`;
        sug.title = "Suggested — click to add";
        sug.addEventListener("click", (e) => {
          e.stopPropagation();
          if (ALLOWLIST.includes(tag)) {
            svc.tags.push(tag);
            persist();
            render();
          }
        });
        chipsEl.appendChild(sug);
      });

      const add = document.createElement("button");
      add.type = "button";
      add.className = "add-chip";
      add.textContent = "+ Add";
      add.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDropdown(svc.id);
      });
      chipsEl.appendChild(add);
    }
  }

  function buildDropdown(svc) {
    const dd = document.createElement("div");
    dd.className = "dropdown";
    dd.id = "dd-" + svc.id;
    dd.setAttribute("role", "listbox");
    dd.setAttribute("aria-label", "Allowlist tags");

    const note = document.createElement("div");
    note.className = "dd-note";
    note.textContent = "Allowlist only — cannot invent tags";
    dd.appendChild(note);

    const search = document.createElement("input");
    search.type = "search";
    search.placeholder = "Filter allowlist…";
    search.setAttribute("aria-label", "Filter allowlist tags");
    search.autocomplete = "off";
    dd.appendChild(search);

    const list = document.createElement("div");
    list.className = "opt-list";
    dd.appendChild(list);

    const paintOpts = () => {
      const q = (search.value || "").toLowerCase().trim();
      list.innerHTML = "";
      const opts = ALLOWLIST.filter((t) => !q || t.includes(q));
      if (!opts.length) {
        list.innerHTML = `<div class="empty">No allowlist matches — try another term</div>`;
        return;
      }
      opts.forEach((tag) => {
        const on = svc.tags.includes(tag);
        const isSug = svc.suggested.includes(tag);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt" + (on ? " on" : "");
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.innerHTML =
          (on ? "✓ " : "") +
          tag +
          (isSug && !on ? '<span class="badge">suggested</span>' : "");
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (on) svc.tags = svc.tags.filter((t) => t !== tag);
          else svc.tags = [...svc.tags, tag];
          persist();
          const keepOpen = svc.id;
          render();
          requestAnimationFrame(() => toggleDropdown(keepOpen, true));
        });
        list.appendChild(btn);
      });
    };

    search.addEventListener("input", paintOpts);
    search.addEventListener("click", (e) => e.stopPropagation());
    search.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDropdowns();
      }
      // Block inventing: Enter does nothing if no exact match selected
      if (e.key === "Enter") {
        e.preventDefault();
        const q = (search.value || "").toLowerCase().trim();
        const exact = ALLOWLIST.find((t) => t === q);
        if (exact && !svc.tags.includes(exact)) {
          svc.tags.push(exact);
          persist();
          render();
          requestAnimationFrame(() => toggleDropdown(svc.id, true));
        }
      }
    });
    paintOpts();
    return dd;
  }

  function renderTableRow(svc) {
    const tr = document.createElement("tr");
    tr.dataset.id = svc.id;
    if (!svc.use) tr.classList.add("off");

    // Use for suggestions
    const tdUse = document.createElement("td");
    tdUse.className = "col-use";
    const useLabel = document.createElement("label");
    useLabel.className = "use-label" + (svc.use ? " on" : "");
    useLabel.innerHTML = `
      <span class="switch">
        <input type="checkbox" ${svc.use ? "checked" : ""} aria-label="Use ${svc.name} for suggestions" />
        <span class="slider"></span>
      </span>
      <span class="use-text">${svc.use ? "On" : "Off"}</span>
    `;
    useLabel.querySelector("input").addEventListener("change", (e) => {
      svc.use = e.target.checked;
      persist();
      render();
    });
    tdUse.appendChild(useLabel);

    // Name
    const tdName = document.createElement("td");
    tdName.className = "col-name";
    const nameInput = document.createElement("input");
    nameInput.className = "name-input";
    nameInput.value = svc.name;
    nameInput.setAttribute("aria-label", "Service name");
    nameInput.addEventListener("change", () => {
      const v = nameInput.value.trim();
      if (v) svc.name = v;
      else nameInput.value = svc.name;
      persist();
    });
    nameInput.addEventListener("blur", () => {
      const v = nameInput.value.trim();
      if (v) {
        svc.name = v;
        persist();
      } else {
        nameInput.value = svc.name;
      }
    });
    tdName.appendChild(nameInput);

    // Tags
    const tdTags = document.createElement("td");
    tdTags.className = "tag-cell col-tags";
    const chips = document.createElement("div");
    chips.className = "chips";
    renderChips(svc, chips);
    const dd = buildDropdown(svc);
    tdTags.appendChild(chips);
    tdTags.appendChild(dd);

    // Actions
    const tdAct = document.createElement("td");
    tdAct.className = "col-actions";
    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn btn-icon btn-sm";
    del.title = "Remove service (demo)";
    del.setAttribute("aria-label", "Remove " + svc.name);
    del.textContent = "🗑";
    del.addEventListener("click", () => {
      if (!confirm(`Remove “${svc.name}” from scan results?`)) return;
      services = services.filter((s) => s.id !== svc.id);
      persist();
      render();
      toast("Service removed");
    });
    tdAct.appendChild(del);

    tr.appendChild(tdUse);
    tr.appendChild(tdName);
    tr.appendChild(tdTags);
    tr.appendChild(tdAct);
    return tr;
  }

  function renderCard(svc) {
    const card = document.createElement("div");
    card.className = "svc-card" + (svc.use ? "" : " off");
    card.dataset.id = svc.id;

    const top = document.createElement("div");
    top.className = "svc-card-top";
    const useLabel = document.createElement("label");
    useLabel.className = "use-label" + (svc.use ? " on" : "");
    useLabel.innerHTML = `
      <span class="switch">
        <input type="checkbox" ${svc.use ? "checked" : ""} aria-label="Use ${svc.name} for suggestions" />
        <span class="slider"></span>
      </span>
      <span class="use-text">Use for suggestions · ${svc.use ? "On" : "Off"}</span>
    `;
    useLabel.querySelector("input").addEventListener("change", (e) => {
      svc.use = e.target.checked;
      persist();
      render();
    });
    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn btn-icon btn-sm";
    del.setAttribute("aria-label", "Remove " + svc.name);
    del.textContent = "🗑";
    del.addEventListener("click", () => {
      if (!confirm(`Remove “${svc.name}”?`)) return;
      services = services.filter((s) => s.id !== svc.id);
      persist();
      render();
    });
    top.appendChild(useLabel);
    top.appendChild(del);
    card.appendChild(top);

    const nameLab = document.createElement("div");
    nameLab.className = "field-label";
    nameLab.textContent = "Name";
    card.appendChild(nameLab);

    const nameInput = document.createElement("input");
    nameInput.className = "name-input";
    nameInput.value = svc.name;
    nameInput.setAttribute("aria-label", "Service name");
    nameInput.addEventListener("change", () => {
      const v = nameInput.value.trim();
      if (v) svc.name = v;
      else nameInput.value = svc.name;
      persist();
    });
    card.appendChild(nameInput);

    const tagLab = document.createElement("div");
    tagLab.className = "field-label";
    tagLab.textContent = "Tags (allowlist)";
    card.appendChild(tagLab);

    const tagCell = document.createElement("div");
    tagCell.className = "tag-cell";
    const chips = document.createElement("div");
    chips.className = "chips";
    renderChips(svc, chips);
    const dd = buildDropdown(svc);
    // mobile dropdown ids need uniqueness vs table
    dd.id = "dd-m-" + svc.id;
    tagCell.appendChild(chips);
    tagCell.appendChild(dd);
    card.appendChild(tagCell);

    return card;
  }

  function updateStats() {
    const el = $("#stat");
    if (!el) return;
    const onCount = services.filter((s) => s.use).length;
    const tagged = services.filter((s) => s.tags.length > 0).length;
    el.textContent = `${services.length} services · ${tagged} tagged · ${onCount} used for suggestions`;
  }

  function renderBefore() {
    const el = $("#before-strip");
    if (!el) return;
    el.classList.toggle("hidden", beforeDismissed);
  }

  function render() {
    const tbody = $("#tbody");
    const stack = $("#card-stack");
    const results = $("#results-block");
    const empty = $("#empty-state");

    if (showEmpty || services.length === 0) {
      if (results) results.classList.add("hidden");
      if (empty) empty.classList.add("show");
    } else {
      if (results) results.classList.remove("hidden");
      if (empty) empty.classList.remove("show");
    }

    if (tbody) {
      tbody.innerHTML = "";
      services.forEach((svc) => tbody.appendChild(renderTableRow(svc)));
    }
    if (stack) {
      stack.innerHTML = "";
      services.forEach((svc) => stack.appendChild(renderCard(svc)));
    }

    // Re-open dropdown if needed
    if (openDropdownId) {
      const dd =
        document.getElementById("dd-" + openDropdownId) ||
        document.getElementById("dd-m-" + openDropdownId);
      if (dd) {
        dd.classList.add("open");
        const inp = dd.querySelector('input[type="search"]');
        if (inp) {
          inp.value = "";
          inp.dispatchEvent(new Event("input"));
        }
      }
    }

    updateStats();
    renderBefore();

    const sub = $("#panel-sub");
    if (sub) {
      sub.textContent = showEmpty
        ? "No services yet — run a scan or restore demo data"
        : `${services.length} services found · match HTML Posts via allowlist tags`;
    }
  }

  function closeDropdowns() {
    document.querySelectorAll(".dropdown").forEach((d) => {
      d.classList.remove("open");
      d.classList.remove("drop-up");
    });
    document.querySelectorAll(".tag-cell.dd-open").forEach((c) => c.classList.remove("dd-open"));
    document.querySelectorAll("tr.dd-open-row").forEach((r) => r.classList.remove("dd-open-row"));
    openDropdownId = null;
  }

  function toggleDropdown(id, forceOpen) {
    const candidates = [
      document.getElementById("dd-" + id),
      document.getElementById("dd-m-" + id),
    ].filter(Boolean);

    // Prefer visible one
    const dd =
      candidates.find((el) => {
        const style = window.getComputedStyle(el.parentElement.closest(".table-wrap, .card-stack, .svc-card") || el);
        return true;
      }) || candidates[0];

    // Pick the one in the visible layout
    let target = null;
    for (const el of candidates) {
      const wrap = el.closest(".table-wrap");
      const stack = el.closest(".card-stack");
      if (wrap && window.getComputedStyle(wrap).display !== "none") {
        target = el;
        break;
      }
      if (stack && window.getComputedStyle(stack).display !== "none") {
        target = el;
        break;
      }
      // phone-screen forces card-stack
      if (el.closest(".phone-screen")) {
        target = el;
        break;
      }
    }
    if (!target) target = candidates[0];
    if (!target) return;

    const wasOpen = target.classList.contains("open") && openDropdownId === id;
    closeDropdowns();
    if (forceOpen || !wasOpen) {
      target.classList.add("open");
      openDropdownId = id;
      const cell = target.closest(".tag-cell");
      if (cell) cell.classList.add("dd-open");
      const row = target.closest("tr");
      if (row) row.classList.add("dd-open-row");
      // flip up if near bottom
      const rect = target.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 20) {
        target.classList.add("drop-up");
      } else {
        target.classList.remove("drop-up");
      }
      const inp = target.querySelector('input[type="search"]');
      if (inp) {
        inp.value = "";
        inp.dispatchEvent(new Event("input"));
        setTimeout(() => inp.focus(), 10);
      }
    }
  }

  function bind() {
    document.addEventListener("click", () => closeDropdowns());

    const save = $("#btn-save");
    if (save) {
      save.addEventListener("click", () => {
        persist();
        toast("Services saved — tags will drive HTML Post suggestions");
      });
    }

    const rescan = $("#btn-rescan");
    if (rescan) {
      rescan.addEventListener("click", () => {
        toast("Re-scan stub — would fetch advisor site again");
      });
    }

    const selectAll = $("#btn-select-all-use");
    if (selectAll) {
      selectAll.addEventListener("click", () => {
        services.forEach((s) => (s.use = true));
        persist();
        render();
        toast("All services set to Use for suggestions");
      });
    }

    const clearUse = $("#btn-clear-use");
    if (clearUse) {
      clearUse.addEventListener("click", () => {
        services.forEach((s) => (s.use = false));
        persist();
        render();
        toast("Cleared Use for suggestions");
      });
    }

    const emptyToggle = $("#demo-empty");
    if (emptyToggle) {
      emptyToggle.addEventListener("change", (e) => {
        showEmpty = e.target.checked;
        render();
      });
    }

    const resetBtn = $("#demo-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", resetToDefaults);
    }

    const dismiss = $("#before-dismiss");
    if (dismiss) {
      dismiss.addEventListener("click", () => {
        beforeDismissed = true;
        sessionStorage.setItem("fc-169-before-dismissed", "1");
        renderBefore();
      });
    }

    const restoreEmpty = $("#btn-restore-demo");
    if (restoreEmpty) {
      restoreEmpty.addEventListener("click", () => {
        showEmpty = false;
        const t = $("#demo-empty");
        if (t) t.checked = false;
        if (services.length === 0) resetToDefaults();
        else render();
      });
    }
  }

  // Expose for mobile.html iframe isolation if needed
  window.FCScan169 = { render, resetToDefaults, ALLOWLIST };

  document.addEventListener("DOMContentLoaded", () => {
    bind();
    render();
  });
})();
