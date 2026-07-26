/**
 * data.js — Monika Makeovers
 * All package definitions, pricing defaults, and configuration.
 * Edit this file to update services or default rates.
 */

const PKGS = {
  bridal: {
    label: "Bridal Package",
    color: "#993556",
    bg: "#fbeaf0",
    fields: [
      { k: "look",   l: "Bridal look",        d: 18000 },
      { k: "trial",  l: "Pre-bridal trial",    d: 5000  },
      { k: "draping",l: "Draping",             d: 800   },
    ],
    qty: false,
    guestField: false,
    artistField: false,
    editable: true,
  },
  hd: {
    label: "HD Guest Makeup",
    color: "#2b6070",
    bg: "#e0f0f3",
    fields: [
      { k: "full",      l: "Full look (HD)",        d: 7500 },
      { k: "mkp",       l: "Only makeup (HD)",       d: 6000 },
      { k: "hair",      l: "Hairstyle",              d: 1500 },
      { k: "drape",     l: "Draping",                d: 800  },
      { k: "mkpDrape",  l: "Makeup + Draping",       d: 6500 },
      { k: "hairDrape", l: "Hair + Draping",          d: 2000 },
    ],
    qty: true,
    note: "False eyelashes & lenses included.",
    guestField: false,
    artistField: false,
    editable: true,
  },
  basic: {
    label: "Basic Guest Makeup",
    color: "#854F0B",
    bg: "#faeeda",
    fields: [
      { k: "full",      l: "Full look (Basic)",      d: 4500 },
      { k: "mkp",       l: "Only makeup (Basic)",    d: 3000 },
      { k: "hair",      l: "Hairstyle",              d: 1500 },
      { k: "drape",     l: "Draping",                d: 800  },
      { k: "mkpDrape",  l: "Makeup + Draping",       d: 3500 },
      { k: "hairDrape", l: "Hair + Draping",          d: 2000 },
    ],
    qty: true,
    guestField: false,
    artistField: false,
    editable: true,
  },
  special: {
    label: "Special Guest Price",
    color: "#3a7d8c",
    bg: "#e0f0f3",
    fields: [
      { k: "special", l: "Special look", d: 0 },
    ],
    qty: true,
    guestField: false,
    artistField: false,
    editable: true,
  },
  salon: {
    label: "Salon Package",
    color: "#534AB7",
    bg: "#eeedfe",
    fields: [
      { k: "pkg", l: "Package price (total)", d: 0 },
    ],
    qty: false,
    guestField: true,
    artistField: false,
    editable: true,
  },
  artist: {
    label: "Per Artist Rate",
    color: "#3B6D11",
    bg: "#eaf3de",
    fields: [
      { k: "rate", l: "Rate per artist", d: 0 },
    ],
    qty: false,
    guestField: false,
    artistField: true,
    editable: true,
  },
};

/* ─── Bridal Event Types ─────────────────────────────────── */
const BRIDAL_EVENTS = {
  roka: { label: "Roka Ceremony / Day Function Makeup", price: 15000 },
  haldi: { label: "Haldi / Mehendi / Carnival / Mayra", price: 15000 },
  sangeet: { label: "Sangeet / Sagai / Ring Ceremony / Cocktail", price: 20000 },
  wedding: { label: "Wedding / Reception / Pheras", price: 31000 },
};

/* ─── Bridal Package Details ────────────────────────────── */
const BRIDAL_DETAILS = {
  products: [
    "NARS",
    "HUDA Beauty",
    "Estee Lauder",
    "Too Faced",
    "Charlotte Tilbury",
    "Giorgio Armani",
  ],
  inclusions: [
    { name: "Makeup", checked: true },
    { name: "Hairstyle", checked: true },
    { name: "Draping", checked: true },
    { name: "Lenses", checked: true },
    { name: "Lashes", checked: true },
    { name: "One Reusable Hair Extension", checked: true },
  ],
  exclusions: [
    { name: "Conveyance", checked: true },
    { name: "Fresh Flowers (On prior request)", checked: true },
    { name: "Hair Accessories (Printed Price)", checked: true },
  ],
};

/* ─── HD Makeup Package Details ─────────────────────────── */
const HD_DETAILS = {
  products: [
    "MAC",
    "NARS",
    "Bobbi Brown",
    "Kay Beauty",
    "PAC HD",
    "Too Faced",
  ],
  inclusions: [
    { name: "Makeup", checked: true },
    { name: "Hairstyle", checked: true },
    { name: "Draping", checked: true },
    { name: "Lenses", checked: true },
    { name: "False Lashes", checked: true },
  ],
  exclusions: [
    { name: "Conveyance Extra", checked: true },
    { name: "Hair Extension (₹1,000 / ₹1,500)", checked: true },
    { name: "Fresh Flowers (On prior request)", checked: true },
    { name: "Hair Accessories (Printed Price)", checked: true },
  ],
};

/* ─── Basic Makeup Package Details ──────────────────────── */
const BASIC_DETAILS = {
  products: [
    "Maybelline",
    "Forever 52",
    "Loreal Paris",
    "LA Girl",
    "Milani",
    "PAC",
    "Kay Beauty",
  ],
  inclusions: [
    { name: "Makeup", checked: true },
    { name: "Hairstyle", checked: true },
    { name: "Draping", checked: true },
  ],
  exclusions: [
    { name: "Hair Extension (₹1,000)", checked: true },
    { name: "Hair Accessories (Printed Price)", checked: true },
    { name: "Lenses (₹500)", checked: true },
    { name: "False Lashes (₹500)", checked: true },
  ],
};

/* Default "Things to Consider" sections — shown as a final page on the
   receipt. Each client starts with these 5; edit, remove, or add more
   from the sidebar. Change the defaults here if you want new quotations
   to start with different standard text. */
const DEFAULT_CONSIDERATIONS = [
  "Advance paid is strictly non-refundable in case of cancellation.",
  "Conveyance charges are extra and will be added as per the client's location.",
  "Trial sessions, if required, must be scheduled at least 7 days prior to the event.",
  "Reporting time is fixed in advance; please share the exact event schedule to avoid last-minute delays.",
  "Balance payment must be cleared in full on the day of the service, before the makeup session begins.",
];

/* Contact info shown in receipt footer — edit to customise */
const CONTACT = {
  phone1: "+91-8107654303",
  phone2: "+91-9886008604",
  tagline: "Thank you for choosing us ✦",
  instagram: "https://instagram.com/monika_makeovers",
  wedme: "https://wedme.in/monika-makeovers",
};
