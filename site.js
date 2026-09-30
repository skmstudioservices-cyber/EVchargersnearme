/* site.js — central site config (BLOCK:SITE-CONFIG).
   Single place for brand + integration constants. Change here, applies everywhere.
   Loaded before mapapp.js / feedback.js / pwa.js on every page. */
(function(){
"use strict";
window.SITE={
  name: "EV Chargers Near Me",
  shortName: "EV Near Me",
  tagline: "live OSM data · DIGIPIN directions",
  brand: { ac: "#10B981", ac2: "#34D399" },
  ga: "G-ZE1GR23S8E",
  db: {
    url: "https://timnrnmmmmuqmcnuaend.supabase.co",
    key: "sb_publishable_HDo7lgQV4FBbLmfmSmTVmA_mT7NJIJ8",
    feedbackTable: "popup_feedback_ev"
  },
  pwa: { minDays: 7, maxDays: 30 },   /* random re-prompt window */
  tiles: {
    light: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  },
  routeColors: ["#2563EB","#10B981","#F59E0B","#DC2626","#7C3AED"],
  confirmations: { visitor: 75, community: 500 },   /* new place -> verified */
  ads: { enabled: true, minMonthlyViews: 50, pages: [] },   /* per-page gate, GA4-driven */
  monetag: { domain: "3nbf4.com", zoneId: 11929279 },
  paths: { privacy: "/privacy/", about: "/about/", map: "/" }
};
})();
