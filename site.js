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
  /* Ads are CONDITIONAL: the Monetag tag is injected only when enabled AND the page is
     either in `pages` (allowlist, refreshed weekly from GA4 >= minMonthlyViews) or testMode.
     No ad markup on other pages -> keeps indexing safe on a fresh domain. */
  ads: { enabled: true, minMonthlyViews: 50, testMode: true, pages: ["/"] },
  /* Monetag Multitag (docs: help.monetag.com -> Multitag). Tag zone + push SW zone. */
  monetag: { tagSrc: "https://quge5.com/88/tag.min.js", tagZoneId: "289165",
             swDomain: "3nbf4.com", swZoneId: 11929785 },
  paths: { privacy: "/privacy/", about: "/about/", map: "/" }
};
/* ===== BLOCK:ADS (Monetag Multitag, conditional) =====
   Injects the Monetag tag (async, data-cfasync=false -> bypasses CF Rocket Loader) only when
   the page qualifies. Never blocks the map render; adds no DOM nodes (zero layout shift). */
(function(){
  var A=(window.SITE&&window.SITE.ads)||{}, M=(window.SITE&&window.SITE.monetag)||{};
  if(!A.enabled||!M.tagSrc||!M.tagZoneId)return;
  var path=location.pathname.replace(/index\.html$/,"");
  var allowed=(A.testMode===true)||((A.pages||[]).indexOf(path)>=0);
  if(!allowed)return;
  var s=document.createElement("script");
  s.src=M.tagSrc;s.async=true;s.setAttribute("data-zone",String(M.tagZoneId));
  s.setAttribute("data-cfasync","false");
  document.head.appendChild(s);
  try{window.gtag&&window.gtag("event","ad_tag_injected",{path:path});}catch(e){}
})();
})();
