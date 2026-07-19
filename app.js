/**
* app.js — Monika Makeovers Quotation Builder
* Handles all state, rendering, PDF generation, quotation history, and PDF import logic.
*/
/* ─── State ─────────────────────────────────────────── */
let dateCounter = 0;
let noteCounter = 0;
const STATE = { dates: [], notes: [], currentQno: null };
const HISTORY_KEY = "mm_quotation_history";
 
/* ─── Initialise ────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
addDate();
renderNotes();
renderHistoryPanel();
});
 
/* ─── Note helpers ──────────────────────────────────– */
function addNote() {
const id = "n" + noteCounter++;
STATE.notes.push({ id, text: "" });
renderNotes();
}
function removeNote(id) {
STATE.notes = STATE.notes.filter((n) => n.id !== id);
renderNotes();
}
function setNoteText(id, value) {
const n = STATE.notes.find((x) => x.id === id);
if (n) n.text = value;
}
function renderNotes() {
const list = document.getElementById("notesList");
list.innerHTML = "";
STATE.notes.forEach((note, index) => {
   const noteBlock = document.createElement("div");
   noteBlock.className = "note-block";
   noteBlock.innerHTML = `
<div class="note-header">
<span class="note-label">Note ${index + 1}</span>
<button class="rm-btn" aria-label="Remove note" onclick="removeNote('${note.id}')">×</button>
</div>
<div class="field">
<input type="text" class="note-input" value="${note.text}"
         placeholder="e.g. Bring HD makeup kit"
         onchange="setNoteText('${note.id}', this.value)"
         onkeyup="setNoteText('${note.id}', this.value)" />
</div>
   `;
   list.appendChild(noteBlock);
});
}
/* ─── Date helpers ──────────────────────────────────── */
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
/* ─── Event helpers ─────────────────────────────────── */
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
function setEventName(dateId, eventId, value) {
const ev = getEvent(dateId, eventId);
if (ev) ev.name = value;
}
/* ─── Package helpers ───────────────────────────────── */
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
}
renderSidebar();
}
function setField(dateId, eventId, pk, fieldKey, value) {
const ev = getEvent(dateId, eventId);
if (ev && ev.pkgs[pk]) {
   ev.pkgs[pk][fieldKey] = parseFloat(value) || 0;
}
}
function getEvent(dateId, eventId) {
return STATE.dates
   .find((x) => x.id === dateId)
   ?.events.find((e) => e.id === eventId);
}
/* ─── Sidebar renderer ──────────────────────────────── */
function renderSidebar() {
const list = document.getElementById("datesList");
list.innerHTML = "";
STATE.dates.forEach((d, di) => {
   const db = document.createElement("div");
   db.className = "date-block";
   /* Date header */
   db.innerHTML = `
<div class="d-head">
<span class="d-label">Date ${di + 1}</span>
<button class="rm-btn" aria-label="Remove date" onclick="removeDate('${d.id}')">×</button>
</div>
<div class="field">
<label class="lbl">Date</label>
<input type="date" value="${d.date}" onchange="setDate('${d.id}', this.value)" />
</div>
<div id="evts_${d.id}"></div>
<button class="add-btn" onclick="addEvent('${d.id}')">+ Add event on this date</button>
   `;
   list.appendChild(db);
   /* Events */
   const evContainer = db.querySelector("#evts_" + d.id);
   d.events.forEach((ev, ei) => {
     evContainer.appendChild(buildEventBlock(d.id, ev, ei));
   });
});
}
function buildEventBlock(dateId, ev, index) {
const eb = document.createElement("div");
eb.className = "event-block";
/* Package checkboxes */
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
/* Package options */
let opts = '<div class="pkg-opts">';
Object.entries(ev.pkgs).forEach(([k, pdata]) => {
   const p = PKGS[k];
   opts += `<div class="opt-box">
<div class="opt-head" style="color:${p.color}">${p.label}</div>`;
   p.fields.forEach((f) => {
     const val = pdata[f.k] !== undefined ? pdata[f.k] : f.d;
     opts += `<div class="price-row">
<span class="price-lbl">${f.l}</span>
<input type="number" class="pi" value="${val}" min="0"
         onchange="setField('${dateId}','${ev.id}','${k}','${f.k}',this.value)" />`;
     if (p.qty) {
       const q = pdata[f.k + "_q"] || 1;
       opts += `<input type="number" class="qi" value="${q}" min="1" title="Quantity / guests"
         onchange="setField('${dateId}','${ev.id}','${k}','${f.k}_q',this.value)" />`;
     }
     opts += "</div>";
   });
   if (p.guestField) {
     const g = pdata["guests"] || 1;
     opts += `<div class="price-row">
<span class="price-lbl">No. of guests</span>
<input type="number" class="qi" value="${g}" min="1"
         onchange="setField('${dateId}','${ev.id}','${k}','guests',this.value)" />
</div>`;
   }
   if (p.artistField) {
     const a = pdata["artists"] || 1;
     opts += `<div class="price-row">
<span class="price-lbl">No. of artists</span>
<input type="number" class="qi" value="${a}" min="1"
         onchange="setField('${dateId}','${ev.id}','${k}','artists',this.value)" />
</div>`;
   }
   const disc = pdata["disc"] || 0;
   opts += `<div class="price-row">
<span class="price-lbl discount-lbl">Discount (₹)</span>
<input type="number" class="pi discount-input" value="${disc}" min="0"
       onchange="setField('${dateId}','${ev.id}','${k}','disc',this.value)" />
</div>`;
   opts += "</div>"; /* end opt-box */
});
opts += "</div>"; /* end pkg-opts */
eb.innerHTML = `
<div class="ev-head">
<span class="ev-label">Event ${index + 1}</span>
<button class="rm-btn" aria-label="Remove event" onclick="removeEvent('${dateId}','${ev.id}')">×</button>
</div>
<div class="field">
<label class="lbl">Event Name</label>
<input type="text" value="${ev.name}"
       placeholder="e.g. Mehendi, Sangeet, Wedding"
       onchange="setEventName('${dateId}','${ev.id}',this.value)" />
</div>
<div class="lbl" style="margin-bottom:4px">Packages</div>
   ${chips}
   ${opts}
`;
return eb;
}
/* ─── Calculation ───────────────────────────────────── */
function calcPkgTotal(pk, pd) {
const p = PKGS[pk];
let total = 0;
p.fields.forEach((f) => {
   const v = parseFloat(pd[f.k]) || 0;
   if (p.qty) {
     total += v * (parseInt(pd[f.k + "_q"]) || 1);
   } else if (p.artistField && f.k === "rate") {
     total += v * (parseInt(pd["artists"]) || 1);
   } else {
     total += v;
   }
});
return Math.max(0, total - (parseFloat(pd["disc"]) || 0));
}
/* ─── Date formatter ────────────────────────────────── */
function fmtDate(ds) {
if (!ds) return "Date to be confirmed";
try {
   return new Date(ds + "T00:00").toLocaleDateString("en-IN", {
     weekday: "long",
     day: "numeric",
     month: "long",
     year: "numeric",
   });
} catch {
   return ds;
}
}
/* ─── Receipt HTML builder ──────────────────────────── */
function buildReceiptHTML(name, phone, note, qno, today) {
let grand = 0;
let body = "";
const activeDates = STATE.dates.filter((d) =>
   d.events.some((e) => Object.keys(e.pkgs).length > 0)
);
activeDates.forEach((d) => {
   const activeEvts = d.events.filter((e) => Object.keys(e.pkgs).length > 0);
   body += `<div class="date-section">
<div class="date-pill">📅 ${fmtDate(d.date)}</div>`;
   activeEvts.forEach((ev) => {
     let evTotal = 0;
     let pkgBlocks = "";
     Object.entries(ev.pkgs).forEach(([k, pd]) => {
       const p = PKGS[k];
       const pt = calcPkgTotal(k, pd);
       evTotal += pt;
       grand += pt;
       let rows = "";
       p.fields.forEach((f) => {
         const v = parseFloat(pd[f.k]) || 0;
         if (!v) return;
         if (p.qty) {
           const q = parseInt(pd[f.k + "_q"]) || 1;
           rows += `<tr>
<td>${f.l}</td>
<td class="td-center">${q}</td>
<td>₹${v.toLocaleString("en-IN")}</td>
<td class="td-right">₹${(v * q).toLocaleString("en-IN")}</td>
</tr>`;
         } else if (p.artistField && f.k === "rate") {
           const a = parseInt(pd["artists"]) || 1;
           rows += `<tr>
<td>${f.l}</td>
<td class="td-center">${a} artists</td>
<td>₹${v.toLocaleString("en-IN")}</td>
<td class="td-right">₹${(v * a).toLocaleString("en-IN")}</td>
</tr>`;
         } else {
           rows += `<tr>
<td colspan="2">${f.l}</td>
<td></td>
<td class="td-right">₹${v.toLocaleString("en-IN")}</td>
</tr>`;
         }
       });
       if (p.guestField) {
         const g = parseInt(pd["guests"]) || 1;
         rows += `<tr><td colspan="4" class="td-note">For ${g} guests</td></tr>`;
       }
       const disc = parseFloat(pd["disc"]) || 0;
       if (disc) {
         rows += `<tr>
<td colspan="3" class="td-discount">Discount</td>
<td class="td-right td-discount">−₹${disc.toLocaleString("en-IN")}</td>
</tr>`;
       }
       pkgBlocks += `<div class="pkg-block">
<span class="pkg-badge" style="background:${p.bg};color:${p.color}">${p.label}</span>
<table class="svc-table">
<thead>
<tr>
<th style="width:42%">Service</th>
<th style="width:12%;text-align:center">Qty</th>
<th style="width:20%">Rate</th>
<th style="width:26%;text-align:right">Amount</th>
</tr>
</thead>
<tbody>
             ${rows}
<tr class="subtotal-row">
<td colspan="3">Subtotal</td>
<td class="td-right">₹${pt.toLocaleString("en-IN")}</td>
</tr>
</tbody>
</table>
</div>`;
     });
     const multi = Object.keys(ev.pkgs).length > 1;
     body += `<div class="event-section">
<div class="event-title">${ev.name || "Event"}</div>
       ${pkgBlocks}
       ${multi ? `<div class="event-total">Event total: ₹${evTotal.toLocaleString("en-IN")}</div>` : ""}
</div>`;
   });
   body += `</div><div class="divider"></div>`;
});
const totalDates = activeDates.length;
const totalEvts = activeDates.reduce(
   (a, d) => a + d.events.filter((e) => Object.keys(e.pkgs).length > 0).length,
   0
);
return { html: body, grand, totalDates, totalEvts };
}
/* ─── Generate receipt ──────────────────────────────── */
function generate() {
const name  = document.getElementById("cName").value.trim()  || "Valued Client";
const phone = document.getElementById("cPhone").value.trim() || "";
const note  = document.getElementById("cNote").value.trim()  ||
   "Conveyance charges extra. False eyelashes & lenses included in HD makeup. Minimum 4–5 guests for guest packages.";
if (!STATE.dates.length) {
   alert("Please add at least one date.");
   return;
}
const hasPackages = STATE.dates.some((d) =>
   d.events.some((e) => Object.keys(e.pkgs).length > 0)
);
if (!hasPackages) {
   alert("Please select at least one package for an event.");
   return;
}
const today = new Date().toLocaleDateString("en-IN", {
   day: "numeric", month: "long", year: "numeric",
});
// Reuse the same quotation number across edits/regenerations so that
// saving history updates the same version instead of creating duplicates.
// Only assign a fresh number when starting a brand-new quotation.
if (!STATE.currentQno) {
   STATE.currentQno = "MM-" + String(Math.floor(Math.random() * 900) + 100);
}
const qno = STATE.currentQno;
const { html: body, grand, totalDates, totalEvts } = buildReceiptHTML(
   name, phone, note, qno, today
);
// Build notes section
const activeNotes = STATE.notes.filter((n) => n.text.trim());
let notesSection = "";
if (activeNotes.length > 0) {
   notesSection = `<div class="r-notes-section">
<strong>Things to Consider:</strong>
<ul class="r-notes-list">
       ${activeNotes.map((n) => `<li>${n.text}</li>`).join("")}
</ul>
</div>`;
}
const preview = document.getElementById("previewArea");
preview.innerHTML = `
<div class="action-buttons no-print">
<button class="print-btn" onclick="window.print()">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 9 6 2 18 2 18 9"/>
<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
<rect x="6" y="14" width="12" height="8"/>
</svg>
       Print
</button>
<button class="pdf-btn" onclick="savePDF('${qno.replace(/"/g, '\\"')}', '${name.replace(/"/g, '\\"')}')">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
<polyline points="7 10 12 15 17 10"/>
<line x1="12" y1="15" x2="12" y2="3"/>
</svg>
       Save as PDF
</button>
</div>
<div id="receipt">
<div class="r-header">   <div class="r-header-top">     <div class="r-brand">       <div class="r-brand-name">Monika Makeovers</div> 
<div class="r-brand-sub">Makeup Artist</div>     </div>
<div class="r-logo-container">    
<img src="logo.png" alt="Monika Makeovers Logo" class="r-logo" />
</div>  
</div>   <div class="r-issued-date">Issued: ${today}</div>  <!-- ONLY ISSUED DATE, NO QNO --> </div>
</div>
</div>
<div class="r-client">
<div class="ci"><span class="ck">Client</span><span class="cv">${name}</span></div>
       ${phone ? `<div class="ci"><span class="ck">Phone</span><span class="cv">${phone}</span></div>` : ""}
<div class="ci">
<span class="ck">Booking</span>
<span class="cv">${totalEvts} event${totalEvts > 1 ? "s" : ""} · ${totalDates} date${totalDates > 1 ? "s" : ""}</span>
</div>
</div>
<div class="r-body">${body}</div>
<div class="r-grand">
<span class="r-grand-label">Grand Total</span>
<span class="r-grand-value">₹${grand.toLocaleString("en-IN")}</span>
</div>
     ${note ? `<div class="r-note"><strong>Note:</strong> ${note}</div>` : ""}
     ${notesSection}
<div class="r-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
<div class="r-footer">
<div class="r-footer-contact">
         ${CONTACT.phone1} &nbsp;|&nbsp; ${CONTACT.phone2}
</div>
<div class="r-footer-tag">${CONTACT.tagline}</div>
</div>
</div>
`;
 
// Persist this version to local quotation history so it can be reloaded/edited later.
saveCurrentAsVersion({ qno, name, phone, note, grand, today });
}
/* ─── PDF Save functionality ─────────────────────────── */
function savePDF(qno, clientName) {
const receiptElement = document.getElementById("receipt");
if (!receiptElement) {
   alert("No quotation to save. Please generate a quotation first.");
   return;
}
// Generate filename with client name and quotation number
const timestamp = new Date().toISOString().slice(0, 10);
const cleanName = clientName.substring(0, 15).replace(/[^a-zA-Z0-9]/g, "");
const filename = `MM_Quotation_${cleanName}_${qno}_${timestamp}.pdf`;
const options = {
   margin: 10,
   filename: filename,
   image: { type: "jpeg", quality: 0.98 },
   html2canvas: { scale: 2 },
   jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
};
html2pdf().set(options).from(receiptElement).save();
}
 
/* ═══════════════════════════════════════════════════════
   QUOTATION HISTORY (save versions + reload for editing)
   Stored entirely in the browser via localStorage — no backend.
   ═══════════════════════════════════════════════════════ */
 
function getHistory() {
try {
   return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
} catch {
   return [];
}
}
 
function persistHistory(list) {
try {
   localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
} catch (err) {
   console.error("Could not save quotation history:", err);
}
}
 
/**
* Saves (or updates) a full snapshot of the current builder state under the
* given quotation number. Called automatically every time generate() runs.
*/
function saveCurrentAsVersion({ qno, name, phone, note, grand, today }) {
const history = getHistory();
const record = {
   qno,
   name,
   phone,
   note,
   grand,
   issuedDisplay: today,
   updatedAt: new Date().toISOString(),
   // Deep clone so later edits to STATE don't mutate saved history.
   dates: JSON.parse(JSON.stringify(STATE.dates)),
   notes: JSON.parse(JSON.stringify(STATE.notes)),
};
const idx = history.findIndex((h) => h.qno === qno);
if (idx >= 0) {
   history[idx] = record;
} else {
   history.unshift(record);
}
persistHistory(history);
renderHistoryPanel();
}
 
/**
* Reloads a previously saved quotation back into the builder for editing.
* Requires a container <div id="historyList"></div> in the page (see notes).
*/
function loadQuotationFromHistory(qno) {
const record = getHistory().find((h) => h.qno === qno);
if (!record) {
   alert("Could not find that saved quotation.");
   return;
}
STATE.dates = JSON.parse(JSON.stringify(record.dates));
STATE.notes = JSON.parse(JSON.stringify(record.notes));
STATE.currentQno = record.qno; // keep editing the same version instead of minting a new number
 
// Reset id counters above any ids already in use, to avoid collisions with new items.
dateCounter = STATE.dates.reduce((max, d) => {
   const n = parseInt(String(d.id).replace("d", ""), 10);
   return isNaN(n) ? max : Math.max(max, n + 1);
}, 0);
noteCounter = STATE.notes.reduce((max, n) => {
   const num = parseInt(String(n.id).replace("n", ""), 10);
   return isNaN(num) ? max : Math.max(max, num + 1);
}, 0);
 
const nameEl = document.getElementById("cName");
const phoneEl = document.getElementById("cPhone");
const noteEl = document.getElementById("cNote");
if (nameEl) nameEl.value = record.name || "";
if (phoneEl) phoneEl.value = record.phone || "";
if (noteEl) noteEl.value = record.note || "";
 
renderSidebar();
renderNotes();
window.scrollTo({ top: 0, behavior: "smooth" });
}
 
function deleteQuotationFromHistory(qno) {
if (!confirm(`Delete saved quotation ${qno}? This cannot be undone.`)) return;
const history = getHistory().filter((h) => h.qno !== qno);
persistHistory(history);
renderHistoryPanel();
}
 
/**
* Clears the builder to start a brand-new quotation (fresh quotation number).
*/
function newQuotation() {
if (!confirm("Start a new quotation? Unsaved changes to the current one will be lost unless already saved.")) return;
STATE.dates = [];
STATE.notes = [];
STATE.currentQno = null;
dateCounter = 0;
noteCounter = 0;
const nameEl = document.getElementById("cName");
const phoneEl = document.getElementById("cPhone");
const noteEl = document.getElementById("cNote");
if (nameEl) nameEl.value = "";
if (phoneEl) phoneEl.value = "";
if (noteEl) noteEl.value = "";
addDate();
renderNotes();
const preview = document.getElementById("previewArea");
if (preview) preview.innerHTML = "";
}
 
/**
* Renders the "Saved Quotations" panel. Expects a container element with
* id="historyList" somewhere in the page (see HTML notes provided alongside this file).
*/
function renderHistoryPanel() {
const list = document.getElementById("historyList");
if (!list) return; // panel not present on this page — safe no-op
const history = getHistory();
if (!history.length) {
   list.innerHTML = `<div class="history-empty">No saved quotations yet. Generate one to save it here.</div>`;
   return;
}
list.innerHTML = history
   .map((h) => {
     const updated = new Date(h.updatedAt).toLocaleString("en-IN", {
       day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
     });
     return `
<div class="history-item">
<div class="history-main">
<div class="history-qno">${h.qno} — ${h.name}</div>
<div class="history-meta">₹${(h.grand || 0).toLocaleString("en-IN")} · saved ${updated}</div>
</div>
<div class="history-actions">
<button class="history-load-btn" onclick="loadQuotationFromHistory('${h.qno}')">Load / Edit</button>
<button class="history-del-btn" onclick="deleteQuotationFromHistory('${h.qno}')">Delete</button>
</div>
</div>`;
   })
   .join("");
}
 
/* ═══════════════════════════════════════════════════════
   PDF IMPORT (upload a PDF, auto-extract what's extractable)
   ═══════════════════════════════════════════════════════
   IMPORTANT LIMITATION: this relies on pdf.js text extraction, which only
   works on PDFs that contain a real text layer. PDFs generated by this
   app's current savePDF() are rasterized images (via html2canvas), so they
   will NOT extract anything useful — use "Load / Edit" from the Saved
   Quotations history for those instead. This importer is best-effort for
   externally sourced, text-based PDFs, and will only reliably recover the
   client name, phone, quotation number, note, and grand total — not the
   full per-package/per-event breakdown, since that structure is lost once
   flattened to plain text.
   Requires pdf.js to be loaded on the page (see HTML notes).
*/
 
async function handlePdfUpload(event) {
const file = event.target.files && event.target.files[0];
if (!file) return;
if (typeof pdfjsLib === "undefined") {
   alert("PDF import requires pdf.js to be loaded on this page. See setup notes.");
   return;
}
try {
   const buffer = await file.arrayBuffer();
   const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
   let fullText = "";
   for (let i = 1; i <= pdf.numPages; i++) {
     const page = await pdf.getPage(i);
     const content = await page.getTextContent();
     fullText += content.items.map((it) => it.str).join(" ") + "\n";
   }
   fullText = fullText.trim();
   if (!fullText) {
     alert(
       "No selectable text found in this PDF. It's likely an image-based PDF " +
       "(e.g. one exported by this app's current PDF export), which can't be " +
       "auto-extracted. If this quotation was created here, use 'Load / Edit' " +
       "from Saved Quotations instead."
     );
     return;
   }
   const extracted = parseExtractedPdfText(fullText);
   applyExtractedToForm(extracted);
} catch (err) {
   console.error(err);
   alert("Could not read that PDF. It may be corrupted or in an unsupported format.");
} finally {
   event.target.value = ""; // allow re-selecting the same file later
}
}
 
function parseExtractedPdfText(text) {
const result = { name: "", phone: "", qno: "", grand: "", note: "" };
 
const qnoMatch = text.match(/\bMM-\d{3,}\b/);
if (qnoMatch) result.qno = qnoMatch[0];
 
const phoneMatch = text.match(/(?:Phone|Contact)\s*[:\-]?\s*(\+?\d[\d\s-]{7,})/i);
if (phoneMatch) result.phone = phoneMatch[1].trim();
 
const nameMatch = text.match(/Client\s*[:\-]?\s*([A-Za-z][A-Za-z .]{1,40})/i);
if (nameMatch) result.name = nameMatch[1].trim();
 
const grandMatch = text.match(/Grand Total\s*[:\-]?\s*₹?\s*([\d,]+)/i);
if (grandMatch) result.grand = grandMatch[1].replace(/,/g, "");
 
const noteMatch = text.match(/Note\s*[:\-]?\s*(.+?)(?:Things to Consider|✦|$)/i);
if (noteMatch) result.note = noteMatch[1].trim();
 
return result;
}
 
function applyExtractedToForm(extracted) {
const nameEl = document.getElementById("cName");
const phoneEl = document.getElementById("cPhone");
const noteEl = document.getElementById("cNote");
if (extracted.name && nameEl) nameEl.value = extracted.name;
if (extracted.phone && phoneEl) phoneEl.value = extracted.phone;
if (extracted.note && noteEl) noteEl.value = extracted.note;
 
const foundAny = extracted.name || extracted.phone || extracted.note || extracted.qno || extracted.grand;
if (!foundAny) {
   alert("Text was found in the PDF, but no recognizable quotation fields could be matched. You'll need to fill the form in manually.");
   return;
}
alert(
   "Imported what we could find:\n" +
   (extracted.name ? `Client: ${extracted.name}\n` : "") +
   (extracted.phone ? `Phone: ${extracted.phone}\n` : "") +
   (extracted.qno ? `Quotation No: ${extracted.qno}\n` : "") +
   (extracted.grand ? `Grand Total: ₹${extracted.grand}\n` : "") +
   "\nEvent, date, and package details could not be reliably reconstructed from PDF text — " +
   "please re-select those manually in the builder below."
);
}
