/**
 * app.js — Monika Makeovers Quotation Builder (Complete & Working)
 */

let dateCounter = 0;
let itemCounter = 0;
const STATE = { 
  dates: [], 
  additionalCharges: [], 
  considerations: [],
  advanceAmount: 0,
  conveyanceAmount: 0,
  quotationStatus: "",
  showPackageDetails: false
};

document.addEventListener("DOMContentLoaded", () => {
  initConsiderations();
  addDate();
  loadSavedQuotations();
});

/* ─── Validation ────────────────────────────────────── */
function validateRequiredFields() {
  const name = document.getElementById("cName").value.trim();
  const phone = document.getElementById("cPhone").value.trim();
  const location = document.getElementById("cLocation").value.trim();

  if (!name || !phone || !location) {
    alert("⚠️ Please fill in Client Name, Phone, and Location (marked with *)");
    return false;
  }
  return true;
}

/* ─── Status Change Handler ─────────────────────────── */
function onStatusChange() {
  const status = document.querySelector('input[name="quotationStatus"]:checked');
  STATE.quotationStatus = status ? status.value : "";
  
  const advanceSection = document.getElementById("advanceSection");
  if (STATE.quotationStatus === "advance_received") {
    advanceSection.style.display = "block";
  } else {
    advanceSection.style.display = "none";
    document.getElementById("advanceAmount").value = "0";
    STATE.advanceAmount = 0;
  }
}

/* ─── Update State ──────────────────────────────────── */
function updateState() {
  const advanceInput = document.getElementById("advanceAmount");
  STATE.advanceAmount = parseFloat(advanceInput.value) || 0;
  
  const conveyanceInput = document.getElementById("conveyanceAmount");
  STATE.conveyanceAmount = parseFloat(conveyanceInput.value) || 0;
}

/* ─── Considerations ────────────────────────────────── */
function initConsiderations() {
  if (!STATE.considerations || STATE.considerations.length === 0) {
    STATE.considerations = DEFAULT_CONSIDERATIONS.map((text) => ({
      id: "c" + Math.random().toString(36).substr(2, 9),
      text: text,
    }));
  }
  renderConsiderations();
}

function renderConsiderations() {
  const list = document.getElementById("considerList");
  if (!list) return;
  list.innerHTML = "";

  STATE.considerations.forEach((c) => {
    const item = document.createElement("div");
    item.className = "consideration-item";
    item.innerHTML = `
      <textarea class="consider-text" placeholder="e.g. Advance is non-refundable..." onchange="updateConsideration('${c.id}', this.value)">${c.text}</textarea>
      <button class="item-rm-btn" onclick="removeConsideration('${c.id}')">×</button>
    `;
    list.appendChild(item);
  });
}

function addConsideration() {
  STATE.considerations.push({
    id: "c" + Math.random().toString(36).substr(2, 9),
    text: "",
  });
  renderConsiderations();
}

function updateConsideration(id, text) {
  const c = STATE.considerations.find((x) => x.id === id);
  if (c) c.text = text;
}

function removeConsideration(id) {
  STATE.considerations = STATE.considerations.filter((c) => c.id !== id);
  renderConsiderations();
}

/* ─── Additional Charges ────────────────────────────── */
function addAdditionalCharge() {
  STATE.additionalCharges.push({
    id: "ac" + itemCounter++,
    name: "",
    price: 0,
  });
  renderAdditionalCharges();
}

function renderAdditionalCharges() {
  const list = document.getElementById("additionalList");
  if (!list) return;
  list.innerHTML = "";

  STATE.additionalCharges.forEach((ac) => {
    const item = document.createElement("div");
    item.className = "custom-item-row";
    item.innerHTML = `
      <input type="text" class="custom-name" placeholder="e.g. Travel charge" value="${ac.name}"
        onchange="updateAdditionalCharge('${ac.id}', 'name', this.value)" />
      <input type="number" class="custom-price" placeholder="₹0" min="0" value="${ac.price}"
        onchange="updateAdditionalCharge('${ac.id}', 'price', this.value)" />
      <button class="item-rm-btn" onclick="removeAdditionalCharge('${ac.id}')">×</button>
    `;
    list.appendChild(item);
  });
}

function updateAdditionalCharge(id, field, value) {
  const ac = STATE.additionalCharges.find((x) => x.id === id);
  if (ac) {
    if (field === "name") {
      ac.name = value;
    } else {
      ac.price = parseFloat(value) || 0;
    }
  }
}

function removeAdditionalCharge(id) {
  STATE.additionalCharges = STATE.additionalCharges.filter((ac) => ac.id !== id);
  renderAdditionalCharges();
}

/* ─── Dates & Events ────────────────────────────────── */
function addDate() {
  const id = "d" + dateCounter++;
  STATE.dates.push({ id, date: "", events: [] });
  renderSidebar();
  addEvent(id);
}

function removeDate(id) {
  STATE.dates = STATE.dates.filter((d) => d.id !== id);
  renderSidebar();
}

function setDate(id, value) {
  const d = STATE.dates.find((x) => x.id === id);
  if (d) d.date = value;
}

function copyDate(id) {
  const d = STATE.dates.find((x) => x.id === id);
  if (!d) return;
  const newDate = {
    id: "d" + dateCounter++,
    date: d.date,
    events: JSON.parse(JSON.stringify(d.events)),
  };
  STATE.dates.push(newDate);
  renderSidebar();
}

function addEvent(dateId) {
  const d = STATE.dates.find((x) => x.id === dateId);
  if (!d) return;
  d.events.push({
    id: "e" + Math.floor(Math.random() * 99999),
    name: "",
    pkgs: {},
  });
  renderSidebar();
}

function removeEvent(dateId, eventId) {
  const d = STATE.dates.find((x) => x.id === dateId);
  if (!d) return;
  d.events = d.events.filter((e) => e.id !== eventId);
  renderSidebar();
}

function copyEvent(dateId, eventId) {
  const d = STATE.dates.find((x) => x.id === dateId);
  if (!d) return;
  const ev = d.events.find((e) => e.id === eventId);
  if (!ev) return;
  const newEvent = {
    id: "e" + Math.floor(Math.random() * 99999),
    name: ev.name,
    pkgs: JSON.parse(JSON.stringify(ev.pkgs)),
  };
  d.events.push(newEvent);
  renderSidebar();
}

function setEventName(dateId, eventId, value) {
  const ev = getEvent(dateId, eventId);
  if (ev) ev.name = value;
}

function getEvent(dateId, eventId) {
  return STATE.dates
    .find((x) => x.id === dateId)
    ?.events.find((e) => e.id === eventId);
}

/* ─── Packages ──────────────────────────────────────── */
function togglePkg(dateId, eventId, pk) {
  const ev = getEvent(dateId, eventId);
  if (!ev) return;
  
  if (ev.pkgs[pk]) {
    delete ev.pkgs[pk];
  } else {
    ev.pkgs[pk] = {};
    PKGS[pk].fields.forEach((f) => {
      ev.pkgs[pk][f.k] = f.d;
    });
    ev.pkgs[pk]["disc"] = 0;
    ev.pkgs[pk]["pkgNote"] = "";
    if (pk === "bridal") {
      ev.pkgs[pk]["bridalEvents"] = {};
    }
  }
  renderSidebar();
}

function setField(dateId, eventId, pk, fieldKey, value) {
  const ev = getEvent(dateId, eventId);
  if (ev && ev.pkgs[pk]) {
    ev.pkgs[pk][fieldKey] = parseFloat(value) || 0;
  }
}

function setBridalEvent(dateId, eventId, eventType, checked) {
  const ev = getEvent(dateId, eventId);
  if (ev && ev.pkgs["bridal"]) {
    if (!ev.pkgs["bridal"]["bridalEvents"]) {
      ev.pkgs["bridal"]["bridalEvents"] = {};
    }
    if (checked) {
      ev.pkgs["bridal"]["bridalEvents"][eventType] = BRIDAL_EVENTS[eventType].price;
    } else {
      delete ev.pkgs["bridal"]["bridalEvents"][eventType];
    }
  }
  renderSidebar();
}

/* ─── Sidebar Render ────────────────────────────────── */
function renderSidebar() {
  const list = document.getElementById("datesList");
  list.innerHTML = "";

  STATE.dates.forEach((d, di) => {
    const db = document.createElement("div");
    db.className = "date-block";

    db.innerHTML = `
      <div class="d-head">
        <span class="d-label">Date ${di + 1}</span>
        <div class="d-actions">
          <button class="mini-btn" onclick="copyDate('${d.id}')" title="Copy date">📋</button>
          <button class="rm-btn" onclick="removeDate('${d.id}')">×</button>
        </div>
      </div>
      <div class="field">
        <label class="lbl">Date</label>
        <input type="date" value="${d.date}" onchange="setDate('${d.id}', this.value)" />
      </div>
      <div id="evts_${d.id}"></div>
      <button class="add-btn" onclick="addEvent('${d.id}')">+ Add event</button>
    `;

    list.appendChild(db);

    const evContainer = db.querySelector("#evts_" + d.id);
    d.events.forEach((ev, ei) => {
      evContainer.appendChild(buildEventBlock(d.id, ev, ei));
    });
  });
}

function buildEventBlock(dateId, ev, index) {
  const eb = document.createElement("div");
  eb.className = "event-block";

  let chips = '<div class="pkg-grid">';
  Object.entries(PKGS).forEach(([k, p]) => {
    const on = ev.pkgs[k] ? "on" : "";
    chips += `
      <div class="pkg-chip ${on}" onclick="togglePkg('${dateId}','${ev.id}','${k}')">
        <span class="chk">${ev.pkgs[k] ? "✓" : ""}</span>
        <span>${p.label}</span>
      </div>`;
  });
  chips += "</div>";

  let opts = '<div class="pkg-opts">';
  Object.entries(ev.pkgs).forEach(([k, pdata]) => {
    const p = PKGS[k];
    opts += `<div class="opt-box"><div class="opt-head" style="color:${p.color}">${p.label}</div>`;

    if (k === "bridal") {
      opts += `<div class="bridal-events-section"><div class="bridal-label">Select Bridal Events:</div>`;
      Object.entries(BRIDAL_EVENTS).forEach(([etype, edata]) => {
        const isSelected = pdata.bridalEvents && pdata.bridalEvents[etype];
        opts += `
          <label class="bridal-event-check">
            <input type="checkbox" ${isSelected ? "checked" : ""} onchange="setBridalEvent('${dateId}','${ev.id}','${etype}', this.checked)" />
            <span class="bridal-label-text">${edata.label}</span>
            <span class="bridal-price">₹${edata.price.toLocaleString()}</span>
          </label>
        `;
      });
      opts += `</div>`;
    }

    p.fields.forEach((f) => {
      const val = pdata[f.k] !== undefined ? pdata[f.k] : f.d;
      opts += `<div class="price-row">
        <span class="price-lbl">${f.l}</span>
        <input type="number" class="pi" value="${val}" min="0"
          onchange="setField('${dateId}','${ev.id}','${k}','${f.k}',this.value)" />
      </div>`;
    });

    const disc = pdata["disc"] || 0;
    opts += `<div class="price-row">
      <span class="price-lbl discount-lbl">Discount (₹)</span>
      <input type="number" class="pi discount-input" value="${disc}" min="0"
        onchange="setField('${dateId}','${ev.id}','${k}','disc',this.value)" />
    </div>`;

    const pkgNote = pdata["pkgNote"] || "";
    opts += `<div class="price-row">
      <span class="price-lbl">Notes</span>
      <textarea class="salon-note" onchange="setField('${dateId}','${ev.id}','${k}','pkgNote',this.value)">${pkgNote}</textarea>
    </div>`;

    opts += "</div>";
  });
  opts += "</div>";

  eb.innerHTML = `
    <div class="ev-head">
      <span class="ev-label">Event ${index + 1}</span>
      <div class="ev-actions">
        <button class="mini-btn" onclick="copyEvent('${dateId}','${ev.id}')" title="Copy">📋</button>
        <button class="rm-btn" onclick="removeEvent('${dateId}','${ev.id}')">×</button>
      </div>
    </div>
    <div class="field">
      <label class="lbl">Event Name</label>
      <input type="text" value="${ev.name}" placeholder="e.g. Wedding" 
        onchange="setEventName('${dateId}','${ev.id}',this.value)" />
    </div>
    <div class="lbl">Packages</div>
    ${chips}
    ${opts}
  `;

  return eb;
}

/* ─── Calculations ──────────────────────────────────── */
function calcPkgTotal(pk, pd) {
  let total = 0;
  
  if (pk === "bridal") {
    PKGS[pk].fields.forEach((f) => {
      const v = parseFloat(pd[f.k]) || 0;
      total += v;
    });
    if (pd.bridalEvents) {
      Object.values(pd.bridalEvents).forEach((price) => {
        total += price;
      });
    }
  } else {
    PKGS[pk].fields.forEach((f) => {
      total += parseFloat(pd[f.k]) || 0;
    });
  }

  return Math.max(0, total - (parseFloat(pd["disc"]) || 0));
}

/* ─── Date Formatter ────────────────────────────────── */
function fmtDate(ds) {
  if (!ds) return "Date TBA";
  try {
    return new Date(ds + "T00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return ds;
  }
}

function getDateRange() {
  const activeDates = STATE.dates.filter((d) =>
    d.events.some((e) => Object.keys(e.pkgs).length > 0)
  );
  
  if (activeDates.length === 0) return "";
  
  const dates = activeDates.map(d => new Date(d.date + "T00:00")).filter(d => !isNaN(d.getTime())).sort((a, b) => a - b);
  
  if (dates.length === 0) return "";
  
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
  const year = firstDate.getFullYear();
  
  const fmtD = (d) => {
    const day = d.getDate();
    const month = d.toLocaleDateString("en-IN", { month: "short" });
    return `${day} ${month}`;
  };
  
  const totalEvents = STATE.dates.reduce((a, d) => a + d.events.filter(e => Object.keys(e.pkgs).length > 0).length, 0);
  
  return `${fmtD(firstDate)} – ${fmtD(lastDate)} ${year} (${totalEvents} events)`;
}

/* ─── Receipt HTML Builder ──────────────────────────── */
function buildReceiptHTML() {
  const name = document.getElementById("cName").value.trim() || "Valued Client";
  const phone = document.getElementById("cPhone").value.trim() || "";
  const email = document.getElementById("cEmail").value.trim() || "";
  const location = document.getElementById("cLocation").value.trim() || "";
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  let grand = 0;
  let body = "";

  const activeDates = STATE.dates.filter((d) =>
    d.events.some((e) => Object.keys(e.pkgs).length > 0)
  );

  activeDates.forEach((d) => {
    const activeEvts = d.events.filter((e) => Object.keys(e.pkgs).length > 0);
    body += `<div class="date-section"><div class="date-pill">📅 ${fmtDate(d.date)}</div>`;

    activeEvts.forEach((ev) => {
      let evTotal = 0;
      let pkgBlocks = "";

      Object.entries(ev.pkgs).forEach(([k, pd]) => {
        const p = PKGS[k];
        const pt = calcPkgTotal(k, pd);
        evTotal += pt;
        grand += pt;

        let rows = "";
        
        if (k === "bridal") {
          PKGS[k].fields.forEach((f) => {
            const v = parseFloat(pd[f.k]) || 0;
            if (v > 0) {
              rows += `<tr><td>${f.l}</td><td class="td-right">₹${v.toLocaleString()}</td></tr>`;
            }
          });
          if (pd.bridalEvents) {
            Object.entries(pd.bridalEvents).forEach(([etype, price]) => {
              rows += `<tr><td>${BRIDAL_EVENTS[etype].label}</td><td class="td-right">₹${price.toLocaleString()}</td></tr>`;
            });
          }
        } else {
          PKGS[k].fields.forEach((f) => {
            const v = parseFloat(pd[f.k]) || 0;
            if (v > 0) {
              rows += `<tr><td>${f.l}</td><td class="td-right">₹${v.toLocaleString()}</td></tr>`;
            }
          });
        }

        const disc = parseFloat(pd["disc"]) || 0;
        if (disc) {
          rows += `<tr><td class="td-discount">Discount</td><td class="td-right td-discount">−₹${disc.toLocaleString()}</td></tr>`;
        }

        pkgBlocks += `<div class="pkg-block">
          <span class="pkg-badge" style="background:${p.bg};color:${p.color}">${p.label}</span>
          <table class="svc-table"><tbody>${rows}</tbody></table>
          <div class="pkg-subtotal">Subtotal: ₹${pt.toLocaleString()}</div>
        </div>`;
      });

      body += `<div class="event-section"><div class="event-title">${ev.name || "Event"}</div>${pkgBlocks}</div>`;
    });

    body += `</div><div class="divider"></div>`;
  });

  const dateRange = getDateRange();
  const conveyance = STATE.conveyanceAmount || 0;
  let additionalTotal = 0;
  let additionalHTML = "";

  STATE.additionalCharges.forEach(ac => {
    if (ac.name && ac.price > 0) {
      additionalHTML += `<div class="charge-row"><span>${ac.name}</span><span>₹${ac.price.toLocaleString()}</span></div>`;
      additionalTotal += ac.price;
    }
  });

  const finalAmount = grand + conveyance + additionalTotal;
  const dueAmount = finalAmount - STATE.advanceAmount;

  return { 
    html: body, 
    grand: finalAmount, 
    name, phone, email, location, today, 
    additionalHTML,
    dateRange,
    dueAmount,
    conveyance,
    additionalTotal,
    servicesTotal: grand
  };
}

/* ─── Generate Receipt ──────────────────────────────── */
function generate() {
  if (!validateRequiredFields()) return;

  if (!STATE.dates.length) {
    alert("⚠️ Please add at least one date.");
    return;
  }

  const hasPackages = STATE.dates.some((d) =>
    d.events.some((e) => Object.keys(e.pkgs).length > 0)
  );

  if (!hasPackages) {
    alert("⚠️ Please select at least one package for an event.");
    return;
  }

  updateState();

  const { html, grand, name, phone, email, location, today, additionalHTML, dateRange, dueAmount, conveyance, additionalTotal, servicesTotal } = buildReceiptHTML();

  const preview = document.getElementById("previewArea");
  preview.innerHTML = `
    <div class="button-group no-print">
      <button class="print-btn" onclick="window.print()">📥 Save as PDF</button>
      <button class="save-json-btn" onclick="exportQuotationAsJSON()">💾 Save JSON</button>
    </div>

    <div id="receipt">
      <div class="r-header">
        <div class="r-brand">
          <div class="r-brand-name">Monika Makeovers</div>
          <div class="r-brand-sub">Makeup Artist</div>
        </div>
        <div class="r-header-right">
          <img src="logo.png" alt="Monika" class="r-logo" onerror="this.style.display='none'" />
          <div class="r-date">Issued: ${today}</div>
        </div>
      </div>

      <div class="r-client">
        <div>
          <div class="ci"><span class="ck">Client</span><span class="cv">${name}</span></div>
          ${phone ? `<div class="ci"><span class="ck">Phone</span><span class="cv">${phone}</span></div>` : ""}
          ${email ? `<div class="ci"><span class="ck">Email</span><span class="cv">${email}</span></div>` : ""}
        </div>
        <div>
          ${location ? `<div class="ci"><span class="ck">Location</span><span class="cv">${location}</span></div>` : ""}
          ${dateRange ? `<div class="ci"><span class="ck">Booking</span><span class="cv">${dateRange}</span></div>` : ""}
        </div>
      </div>

      <div class="r-body">${html}</div>

      ${additionalHTML ? `<div class="r-additional"><strong>Additional Charges:</strong>${additionalHTML}</div>` : ""}

      <div class="r-billing-summary">
        <div class="billing-title">BILLING SUMMARY</div>
        <div class="billing-row">
          <span>Services Total</span>
          <span>₹${servicesTotal.toLocaleString()}</span>
        </div>
        ${conveyance > 0 ? `<div class="billing-row">
          <span>Conveyance</span>
          <span>₹${conveyance.toLocaleString()}</span>
        </div>` : ""}
        ${additionalTotal > 0 ? `<div class="billing-row">
          <span>Additional Charges</span>
          <span>₹${additionalTotal.toLocaleString()}</span>
        </div>` : ""}
        <div class="billing-row">
          <span>Final Amount</span>
          <span>₹${grand.toLocaleString()}</span>
        </div>
        ${STATE.advanceAmount > 0 ? `<div class="billing-row">
          <span>Advance Paid</span>
          <span>−₹${STATE.advanceAmount.toLocaleString()}</span>
        </div>` : ""}
        ${dueAmount > 0 ? `<div class="billing-row billing-due">
          <span><strong>DUE AMOUNT</strong></span>
          <span><strong>₹${dueAmount.toLocaleString()}</strong></span>
        </div>` : ""}
      </div>

      <div class="r-grand">
        <span>Grand Total</span>
        <span>₹${grand.toLocaleString()}</span>
      </div>

      ${STATE.considerations.some(c => c.text.trim()) ? `<div class="r-considerations">
        <div class="considerations-title">Things to Consider</div>
        ${STATE.considerations.map(c => c.text.trim() ? `<div class="consideration-bullet">• ${c.text}</div>` : "").join("")}
      </div>` : ""}

      <div class="r-footer">
        <div>${CONTACT.phone1} | ${CONTACT.phone2}</div>
        <div>${CONTACT.tagline}</div>
      </div>
    </div>
  `;
}

/* ─── Save & Load ────────────────────────────────────── */
function promptSaveQuotation() {
  const defaultName = (document.getElementById("cName").value.trim() || "Quotation") + " — " + new Date().toLocaleDateString();
  const name = prompt("Save as:", defaultName);
  if (!name) return;

  const quotation = {
    id: Date.now(),
    name: name.trim(),
    timestamp: new Date().toLocaleString(),
    client: {
      name: document.getElementById("cName").value.trim(),
      phone: document.getElementById("cPhone").value.trim(),
      email: document.getElementById("cEmail").value.trim(),
      location: document.getElementById("cLocation").value.trim(),
    },
    state: JSON.parse(JSON.stringify(STATE)),
  };

  let saved = JSON.parse(localStorage.getItem("monika_quotations")) || [];
  saved.unshift(quotation);
  localStorage.setItem("monika_quotations", JSON.stringify(saved));

  loadSavedQuotations();
  alert("✅ Quotation saved!");
}

function loadSavedQuotations() {
  const saved = JSON.parse(localStorage.getItem("monika_quotations")) || [];
  const list = document.getElementById("savedList");

  list.innerHTML = "";
  if (saved.length === 0) {
    list.innerHTML = `<div style="font-size:10px;color:#999;text-align:center;padding:8px;">No saved quotations</div>`;
    return;
  }

  saved.slice(0, 10).forEach(q => {
    const item = document.createElement("div");
    item.className = "saved-item";
    item.innerHTML = `
      <div class="saved-item-name">${q.name}</div>
      <button class="saved-item-btn" onclick="loadQuotation(${q.id})" title="Load">↻</button>
      <button class="saved-item-btn" onclick="deleteQuotation(${q.id})" title="Delete">×</button>
    `;
    list.appendChild(item);
  });
}

function loadQuotation(id) {
  const saved = JSON.parse(localStorage.getItem("monika_quotations")) || [];
  const q = saved.find(x => x.id === id);
  if (!q) return;

  document.getElementById("cName").value = q.client.name || "";
  document.getElementById("cPhone").value = q.client.phone || "";
  document.getElementById("cEmail").value = q.client.email || "";
  document.getElementById("cLocation").value = q.client.location || "";

  Object.assign(STATE, JSON.parse(JSON.stringify(q.state)));
  dateCounter = 0;
  itemCounter = 0;

  renderSidebar();
  renderConsiderations();
  renderAdditionalCharges();
  alert("✅ Quotation loaded!");
}

function deleteQuotation(id) {
  if (!confirm("Delete this quotation?")) return;
  let saved = JSON.parse(localStorage.getItem("monika_quotations")) || [];
  saved = saved.filter(x => x.id !== id);
  localStorage.setItem("monika_quotations", JSON.stringify(saved));
  loadSavedQuotations();
}

function exportQuotationAsJSON() {
  const data = {
    exportDate: new Date().toISOString(),
    client: {
      name: document.getElementById("cName").value,
      phone: document.getElementById("cPhone").value,
      email: document.getElementById("cEmail").value,
      location: document.getElementById("cLocation").value,
    },
    state: STATE,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quotation_${data.client.name || 'export'}_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleImportFile(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      document.getElementById("cName").value = data.client.name || "";
      document.getElementById("cPhone").value = data.client.phone || "";
      document.getElementById("cEmail").value = data.client.email || "";
      document.getElementById("cLocation").value = data.client.location || "";

      Object.assign(STATE, JSON.parse(JSON.stringify(data.state)));
      dateCounter = 0;
      itemCounter = 0;

      renderSidebar();
      renderConsiderations();
      renderAdditionalCharges();
      alert("✅ Quotation imported!");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };
  reader.readAsText(file);
  input.value = "";
}
