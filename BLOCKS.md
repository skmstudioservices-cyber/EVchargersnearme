# BLOCKS.md — Block registry (EV Chargers Near Me)

Every section on every page has a `<!-- BLOCK:NAME -->` marker + an `id="block-..."` anchor.
To request a change, say: **"block X on <page>"** — the block id or the h2 text is enough.

## Global blocks (same on every page)

| Block | Anchor id | What it is |
|---|---|---|
| HEADER | `#block-header` | Top bar (logo, site name) |
| HERO | `#block-hero` | H1 + intro + search + city chips (home/city) |
| HERO-H1 | `#block-hero-h1` | The main H1 |
| MAPBAR | `#block-mapbar` | Count + route info + filters + add button |
| MAP | `#block-map` (kw pages) / `#map` | The live map |
| LEGEND | `#block-legend` | Line under map |
| CONTENT | `#block-content` | `<main>` guide cards |
| FOOTER | `#block-footer` | Footer links |
| THEME-SWITCH | `#themeBtn` | 💡 light/dark/auto bulb (bottom-right) |
| PWA-INSTALL | `#installCard` | Conditional install card |

## Shared assets (single source — edit here, changes everywhere)

| File | Purpose |
|---|---|
| `theme.css` | ALL styling + brand colours (change brand here) |
| `site.js` | Central config: brand, GA, DB links, PWA cadence |
| `theme.js` | Bulb toggle logic |
| `pwa.js` | Install card + GA conversion events |
| `sw.js` | Offline cache (service worker) |
| `manifest.webmanifest` | PWA identity |

## Per-page content blocks

### /about/

- `#block-why-this-site-exists` — CARD-why-this-site-exists
- `#block-how-it-works` — CARD-how-it-works
- `#block-spot-something-wrong` — CARD-spot-something-wrong
- `#block-contact` — CARD-contact
- `#block-related-pages` — CARD-related-pages

### /ahmedabad/

- `#block-ev-charging-stations-in-ahmedabad` — CARD-ev-charging-stations-in-ahmedabad
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-ahmedabad-faq` — CARD-ev-charging-stations-in-ahmedabad-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /battery-swapping-stations-near-me/

- `#block-battery-swapping-stations-near-me-live-m` — CARD-battery-swapping-stations-near-me-live-m
- `#block-how-swapping-works` — CARD-how-swapping-works
- `#block-who-offers-swapping-in-india` — CARD-who-offers-swapping-in-india
- `#block-swap-vs-charge-which-is-cheaper` — CARD-swap-vs-charge-which-is-cheaper
- `#block-battery-swapping-stations-near-me-mdash-` — CARD-battery-swapping-stations-near-me-mdash-
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card

### /bengaluru/

- `#block-ev-charging-stations-in-bengaluru` — CARD-ev-charging-stations-in-bengaluru
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-bengaluru-faq` — CARD-ev-charging-stations-in-bengaluru-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /bhopal/

- `#block-ev-charging-stations-in-bhopal` — CARD-ev-charging-stations-in-bhopal
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-bhopal-faq` — CARD-ev-charging-stations-in-bhopal-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /car-charging-stations-near-me/

- `#block-car-charging-stations-near-me-live-map` — CARD-car-charging-stations-near-me-live-map
- `#block-how-to-find-car-charging-stations-near-y` — CARD-how-to-find-car-charging-stations-near-y
- `#block-what-to-check-before-you-drive` — CARD-what-to-check-before-you-drive
- `#block-charger-speeds-in-plain-language` — CARD-charger-speeds-in-plain-language
- `#block-car-charging-stations-near-me-mdash-faq` — CARD-car-charging-stations-near-me-mdash-faq
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card

### /chandigarh/

- `#block-ev-charging-stations-in-chandigarh` — CARD-ev-charging-stations-in-chandigarh
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-chandigarh-faq` — CARD-ev-charging-stations-in-chandigarh-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /chennai/

- `#block-ev-charging-stations-in-chennai` — CARD-ev-charging-stations-in-chennai
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-chennai-faq` — CARD-ev-charging-stations-in-chennai-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /dc-fast-charging-stations-near-me/

- `#block-dc-fast-charging-stations-near-me-live-m` — CARD-dc-fast-charging-stations-near-me-live-m
- `#block-what-dc-fast-charging-means` — CARD-what-dc-fast-charging-means
- `#block-where-dc-fast-chargers-are-located` — CARD-where-dc-fast-chargers-are-located
- `#block-what-dc-fast-charging-costs` — CARD-what-dc-fast-charging-costs
- `#block-dc-fast-charging-stations-near-me-mdash-` — CARD-dc-fast-charging-stations-near-me-mdash-
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card

### /delhi/

- `#block-ev-charging-stations-in-delhi` — CARD-ev-charging-stations-in-delhi
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-delhi-faq` — CARD-ev-charging-stations-in-delhi-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /ev-charging-cost-in-india/

- `#block-ev-charging-cost-in-india-live-map` — CARD-ev-charging-cost-in-india-live-map
- `#block-what-charging-costs-by-type` — CARD-what-charging-costs-by-type
- `#block-cost-per-km-worked-example` — CARD-cost-per-km-worked-example
- `#block-why-rates-vary` — CARD-why-rates-vary
- `#block-how-to-pay-less` — CARD-how-to-pay-less
- `#block-ev-charging-cost-in-india-mdash-faq` — CARD-ev-charging-cost-in-india-mdash-faq
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card

### /ev-charging-networks-in-india/

- `#block-ev-charging-networks-in-india-live-map` — CARD-ev-charging-networks-in-india-live-map
- `#block-india-s-charging-networks-at-a-glance` — CARD-india-s-charging-networks-at-a-glance
- `#block-how-the-pieces-fit-together` — CARD-how-the-pieces-fit-together
- `#block-picking-the-right-app-for-you` — CARD-picking-the-right-app-for-you
- `#block-ev-charging-networks-in-india-mdash-faq` — CARD-ev-charging-networks-in-india-mdash-faq
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card

### /free-ev-charging-stations-near-me/

- `#block-free-ev-charging-stations-near-me-live-m` — CARD-free-ev-charging-stations-near-me-live-m
- `#block-where-free-charging-actually-exists` — CARD-where-free-charging-actually-exists
- `#block-why-most-free-chargers-disappear` — CARD-why-most-free-chargers-disappear
- `#block-the-cheaper-alternative-to-hunting-free-` — CARD-the-cheaper-alternative-to-hunting-free-
- `#block-free-ev-charging-stations-near-me-mdash-` — CARD-free-ev-charging-stations-near-me-mdash-
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card

### /highway-ev-charging-stations-in-india/

- `#block-highway-ev-charging-stations-in-india-li` — CARD-highway-ev-charging-stations-in-india-li
- `#block-highway-charging-today` — CARD-highway-charging-today
- `#block-how-to-plan-an-ev-road-trip` — CARD-how-to-plan-an-ev-road-trip
- `#block-what-highway-charging-costs` — CARD-what-highway-charging-costs
- `#block-highway-ev-charging-stations-in-india-md` — CARD-highway-ev-charging-stations-in-india-md
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card

### /how-to-find-ev-charging-stations/

- `#block-how-to-find-ev-charging-stations-live-ma` — CARD-how-to-find-ev-charging-stations-live-ma
- `#block-method-1-live-charger-maps` — CARD-method-1-live-charger-maps
- `#block-method-2-google-maps` — CARD-method-2-google-maps
- `#block-method-3-network-apps` — CARD-method-3-network-apps
- `#block-method-4-community-finders` — CARD-method-4-community-finders
- `#block-method-5-your-car-s-app` — CARD-method-5-your-car-s-app
- `#block-how-to-find-ev-charging-stations-mdash-f` — CARD-how-to-find-ev-charging-stations-mdash-f
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card

### /hyderabad/

- `#block-ev-charging-stations-in-hyderabad` — CARD-ev-charging-stations-in-hyderabad
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-hyderabad-faq` — CARD-ev-charging-stations-in-hyderabad-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /index.html/

- `#block-quick-tips` — CARD-quick-tips
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-frequently-asked-questions` — CARD-frequently-asked-questions
- `#block-city-guides` — CARD-city-guides
- `#block-about-this-data` — CARD-about-this-data
- `#block-popular-guides` — CARD-popular-guides

### /indore/

- `#block-ev-charging-stations-in-indore` — CARD-ev-charging-stations-in-indore
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-indore-faq` — CARD-ev-charging-stations-in-indore-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /jaipur/

- `#block-ev-charging-stations-in-jaipur` — CARD-ev-charging-stations-in-jaipur
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-jaipur-faq` — CARD-ev-charging-stations-in-jaipur-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /kolkata/

- `#block-ev-charging-stations-in-kolkata` — CARD-ev-charging-stations-in-kolkata
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-kolkata-faq` — CARD-ev-charging-stations-in-kolkata-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /lucknow/

- `#block-ev-charging-stations-in-lucknow` — CARD-ev-charging-stations-in-lucknow
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-lucknow-faq` — CARD-ev-charging-stations-in-lucknow-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /mumbai/

- `#block-ev-charging-stations-in-mumbai` — CARD-ev-charging-stations-in-mumbai
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-mumbai-faq` — CARD-ev-charging-stations-in-mumbai-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /nagpur/

- `#block-ev-charging-stations-in-nagpur` — CARD-ev-charging-stations-in-nagpur
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-nagpur-faq` — CARD-ev-charging-stations-in-nagpur-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /privacy/

- `#block-the-short-version` — CARD-the-short-version
- `#block-what-we-collect-automatically` — CARD-what-we-collect-automatically
- `#block-the-feedback-popup-optional` — CARD-the-feedback-popup-optional
- `#block-map-data` — CARD-map-data
- `#block-what-we-never-do` — CARD-what-we-never-do
- `#block-your-rights-dpdp-act-2023` — CARD-your-rights-dpdp-act-2023
- `#block-related-pages` — CARD-related-pages

### /pune/

- `#block-ev-charging-stations-in-pune` — CARD-ev-charging-stations-in-pune
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-pune-faq` — CARD-ev-charging-stations-in-pune-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /surat/

- `#block-ev-charging-stations-in-surat` — CARD-ev-charging-stations-in-surat
- `#block-how-to-find-ev-charging-stations-nearby` — CARD-how-to-find-ev-charging-stations-nearby
- `#block-charger-types-in-plain-language` — CARD-charger-types-in-plain-language
- `#block-what-does-charging-cost` — CARD-what-does-charging-cost
- `#block-ev-charging-stations-in-surat-faq` — CARD-ev-charging-stations-in-surat-faq
- `#block-other-cities` — CARD-other-cities
- `#block-popular-guides` — CARD-popular-guides

### /tata-power-ev-charging-stations-near-me/

- `#block-tata-power-ev-charging-stations-near-me-` — CARD-tata-power-ev-charging-stations-near-me-
- `#block-about-the-tata-power-ez-charge-network` — CARD-about-the-tata-power-ez-charge-network
- `#block-using-the-ez-charge-app` — CARD-using-the-ez-charge-app
- `#block-tata-power-home-charging` — CARD-tata-power-home-charging
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card

### /two-wheeler-ev-charging-stations-near-me/

- `#block-charging-stations-near-me-live-map` — CARD-charging-stations-near-me-live-map
- `#block-1-home-charging-the-default-for-two-whee` — CARD-1-home-charging-the-default-for-two-whee
- `#block-2-ather-grid-fast-charging` — CARD-2-ather-grid-fast-charging
- `#block-3-ola-hyperchargers-and-dealer-charging` — CARD-3-ola-hyperchargers-and-dealer-charging
- `#block-4-battery-swapping` — CARD-4-battery-swapping
- `#block-5-public-charging-points-with-your-porta` — CARD-5-public-charging-points-with-your-porta
- `#block-2-wheeler-ev-charging-mdash-faq` — CARD-2-wheeler-ev-charging-mdash-faq
- `#block-related-guides` — CARD-related-guides
- `#block-ev-chargers-near-me-by-city` — CARD-ev-chargers-near-me-by-city
- `#block-map` — live map card
