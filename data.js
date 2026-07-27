/**
 * data.js — Monika Makeovers
 * All package definitions, pricing defaults, and configuration.
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
    ],
    qty: true,
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

/* Bridal Event Types */
const BRIDAL_EVENTS = {
  roka: { label: "Roka Ceremony / Day Function Makeup", price: 15000 },
  haldi: { label: "Haldi / Mehendi / Carnival / Mayra", price: 15000 },
  sangeet: { label: "Sangeet / Sagai / Ring Ceremony / Cocktail", price: 20000 },
  wedding: { label: "Wedding / Reception / Pheras", price: 31000 },
};

/* Bridal Package Details */
const BRIDAL_DETAILS = {
  products: ["NARS", "HUDA Beauty", "Estee Lauder", "Too Faced", "Charlotte Tilbury", "Giorgio Armani"],
  inclusions: [
    { name: "Makeup", checked: true },
    { name: "Hairstyle", checked: true },
    { name: "Draping", checked: true },
    { name: "Lenses", checked: true },
    { name: "Lashes", checked: true },
  ],
  exclusions: [
    { name: "Conveyance", checked: true },
    { name: "Fresh Flowers", checked: true },
    { name: "Hair Accessories", checked: true },
  ],
};

const HD_DETAILS = {
  products: ["MAC", "NARS", "Bobbi Brown", "Kay Beauty", "PAC HD", "Too Faced"],
  inclusions: [
    { name: "Makeup", checked: true },
    { name: "Hairstyle", checked: true },
    { name: "Draping", checked: true },
  ],
  exclusions: [
    { name: "Conveyance", checked: true },
    { name: "Hair Extension", checked: true },
  ],
};

const BASIC_DETAILS = {
  products: ["Maybelline", "Forever 52", "Loreal Paris", "LA Girl", "Milani"],
  inclusions: [
    { name: "Makeup", checked: true },
    { name: "Hairstyle", checked: true },
  ],
  exclusions: [
    { name: "Hair Extension", checked: true },
    { name: "Lenses", checked: true },
  ],
};

const DEFAULT_CONSIDERATIONS = [
  "Advance is non-refundable. 50% advance required to block the date.",
  "Conveyance charges extra as per distance from location.",
  "Minimum 4-5 guests required for guest makeup packages.",
  "Trial session to be scheduled 1 week before the event.",
  "Balance payment due 2 days before the event.",
];

const CONTACT = {
  phone1: "+91-8107654303",
  phone2: "+91-9886008604",
  tagline: "Thank you for choosing us ✦",
  instagram: "https://instagram.com/monika_makeovers",
  wedme: "https://wedme.in/monika-makeovers",
};
