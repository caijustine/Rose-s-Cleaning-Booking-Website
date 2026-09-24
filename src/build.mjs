// Static site generator for roses-cleaning.com. No dependencies.
// Run `npm run build` to regenerate public/ from src/.
import { mkdirSync, rmSync, writeFileSync, cpSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, photos, results, reviews, services, areas, faqs } from './data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');
const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();

// Cache-busting hashes so returning visitors get fresh CSS/JS after a deploy.
const hashOf = (p) => createHash('md5').update(readFileSync(join(ROOT, 'src/assets', p))).digest('hex').slice(0, 8);
const CSS_V = hashOf('css/site.css');
const JS_V = hashOf('js/site.js');

// ---------- helpers ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (path) => site.url + path;
const tel = `tel:${site.phoneE164}`;
const sms = `sms:${site.phoneE164}`;
const mailto = `mailto:${site.email}`;
const svcUrl = (s) => `/services/${s.slug}/`;
const areaUrl = (a) => `/areas/${a.slug}/`;

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  sparkle: '<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 20 3m-3 3 3 3m-6 0 2 2"/>',
  building: '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16m0-10h2a2 2 0 0 1 2 2v8M3 21h18M8 7h4M8 11h4M8 15h4"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  phone: '<path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  chat: '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 7 8.5-7"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  pause: '<path d="M9 6v12M15 6v12"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"${name === 'star' ? ' fill="currentColor" stroke="none"' : ''}>${ICONS[name]}</svg>`;
const stars = `<span class="stars" role="img" aria-label="5 out of 5 stars">${icon('star').repeat(5)}</span>`;

// Responsive <img>. `sizes` describes how wide the image renders.
function img(p, { sizes = '(min-width: 1024px) 50vw, 100vw', eager = false, cls = '', alt } = {}) {
  const src = typeof p === 'string' ? { src: p, w: 3, h: 4, alt: alt || '' } : p;
  return `<img class="${cls}" src="/assets/img/${src.src}-800.webp" srcset="/assets/img/${src.src}-800.webp 800w, /assets/img/${src.src}-1600.webp 1600w" sizes="${sizes}" width="${src.w * 400}" height="${src.h * 400}" alt="${esc(alt ?? src.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
}

// ---------- structured data ----------
const businessId = `${site.url}/#business`;
const businessSchema = {
  '@type': ['HouseCleaning', 'LocalBusiness'],
  '@id': businessId,
  name: site.name,
  url: site.url + '/',
  image: abs(site.ogImage),
  logo: abs('/assets/favicon.png'),
  telephone: site.phoneE164,
  email: site.email,
  priceRange: '$$',
  description: 'Licensed and insured family-owned house cleaning and janitorial service in St. George, Utah.',
  founder: [{ '@type': 'Person', name: 'Rose' }, { '@type': 'Person', name: 'Maria' }],
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: 'US' },
  geo: { '@type': 'GeoCoordinates', latitude: 37.0965, longitude: -113.5684 },
  areaServed: [...areas.map((a) => ({ '@type': 'City', name: `${a.name}, ${site.region}` })), { '@type': 'AdministrativeArea', name: `${site.county}, ${site.regionName}` }],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: site.hours.days, opens: site.hours.opens, closes: site.hours.closes }],
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Cleaning services',
    itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: abs(svcUrl(s)) } })),
  },
};
const websiteSchema = { '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url + '/', name: site.name, publisher: { '@id': businessId } };
const breadcrumbSchema = (crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.url) })),
});
const faqSchema = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

// ---------- layout ----------
function header(path) {
  const cur = (p) => (path === p || (p !== '/' && path.startsWith(p)) ? ' aria-current="page"' : '');
  const dropdown = (label, base, items) => `
        <li class="has-menu">
          <button class="nav-link menu-toggle" aria-expanded="false" aria-controls="menu-${base}">${label} ${icon('chevron', 'chev')}</button>
          <div class="menu" id="menu-${base}">
            ${items.map((i) => `<a href="${i.url}"${cur(i.url)}><span><strong>${esc(i.name)}</strong>${i.sub ? `<small>${esc(i.sub)}</small>` : ''}</span></a>`).join('')}
            <a class="menu-all" href="/${base}/">View all ${label.toLowerCase()} ${icon('arrow')}</a>
          </div>
        </li>`;
  const svcItems = services.map((s) => ({ url: svcUrl(s), name: s.short, sub: s.price, icon: s.icon }));
  const areaItems = areas.map((a) => ({ url: areaUrl(a), name: `${a.name}, ${site.region}`, icon: 'pin' }));
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="/" aria-label="${esc(site.name)} home">
        <span class="logo-script">Rose’s</span>
        <span class="logo-sub">Cleaning &amp; Janitorial</span>
      </a>
      <nav class="primary-nav" id="primary-nav" aria-label="Main">
        <ul>
          ${dropdown('Services', 'services', svcItems)}
          ${dropdown('Areas', 'areas', areaItems)}
          <li><a class="nav-link" href="/pricing/"${cur('/pricing/')}>Pricing</a></li>
          <li><a class="nav-link" href="/about/"${cur('/about/')}>About</a></li>
          <li><a class="nav-link" href="/faq/"${cur('/faq/')}>FAQ</a></li>
          <li><a class="nav-link" href="/contact/"${cur('/contact/')}>Contact</a></li>
        </ul>
        <div class="nav-mobile-cta">
          <a class="btn btn-primary btn-block" href="/contact/">Get a free estimate</a>
          <a class="btn btn-outline btn-block" href="${tel}">${icon('phone')} Call ${site.phone}</a>
        </div>
      </nav>
      <div class="header-cta">
        <a class="header-phone" href="${tel}">${icon('phone')}<span>${site.phone}</span></a>
        <a class="btn btn-primary btn-sm" href="/contact/">Free estimate</a>
      </div>
      <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">${icon('menu', 'i-open')}${icon('close', 'i-close')}</button>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="logo logo-light" href="/"><span class="logo-script">Rose’s</span><span class="logo-sub">Cleaning &amp; Janitorial</span></a>
        <p>A licensed and insured family cleaning team serving St. George and Washington County. We take care of your home like it’s our own.</p>
        <a class="btn btn-primary btn-sm" href="/contact/">Get a free estimate</a>
      </div>
      <nav class="footer-col" aria-label="Services">
        <h2>Services</h2>
        <ul>${services.map((s) => `<li><a href="${svcUrl(s)}">${esc(s.short)}</a></li>`).join('')}<li><a href="/pricing/">Cost estimator</a></li></ul>
      </nav>
      <nav class="footer-col" aria-label="Service areas">
        <h2>Service areas</h2>
        <ul>${areas.map((a) => `<li><a href="${areaUrl(a)}">${esc(a.name)}, ${site.region}</a></li>`).join('')}</ul>
      </nav>
      <nav class="footer-col" aria-label="Company">
        <h2>Company</h2>
        <ul><li><a href="/about/">About us</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/contact/">Contact</a></li><li><a href="/privacy-policy/">Privacy policy</a></li></ul>
      </nav>
      <div class="footer-col footer-contact">
        <h2>Contact</h2>
        <ul>
          <li>${icon('phone')}<a href="${tel}">${site.phone}</a></li>
          <li>${icon('mail')}<a href="${mailto}">${site.email}</a></li>
          <li>${icon('pin')}<span>${site.city}, ${site.regionName}</span></li>
          <li>${icon('clock')}<span>${site.hours.label}</span></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© ${YEAR} ${esc(site.name)}. All rights reserved.</p>
      <p>Licensed &amp; insured · <a href="/privacy-policy/">Privacy policy</a></p>
    </div>
  </footer>
  <div class="mobile-actions" aria-label="Quick contact">
    <a href="${tel}">${icon('phone')}<span>Call</span></a>
    <a href="${sms}">${icon('chat')}<span>Text</span></a>
    <a class="is-primary" href="/contact/">${icon('calc')}<span>Free estimate</span></a>
  </div>`;
}

function layout({ path, title, description, body, schema = [], preload, noindex = false, ogType = 'website' }) {
  const graph = { '@context': 'https://schema.org', '@graph': [businessSchema, websiteSchema, { '@type': 'WebPage', '@id': abs(path) + '#webpage', url: abs(path), name: title, description, isPartOf: { '@id': `${site.url}/#website` }, about: { '@id': businessId } }, ...schema] };
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${abs(path)}">`}
  <meta name="theme-color" content="#fbfaf7">
  <meta name="format-detection" content="telephone=no">
  <meta name="geo.region" content="US-UT">
  <meta name="geo.placename" content="St. George">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${abs(path)}">
  <meta property="og:image" content="${abs(site.ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Spotless kitchen cleaned by Rose’s Cleaning &amp; Janitorial">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="/assets/favicon.png">
  <link rel="apple-touch-icon" href="/assets/favicon.png">
  <link rel="preload" href="/assets/fonts/instrument-serif-italic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/plus-jakarta-sans.woff2" as="font" type="font/woff2" crossorigin>
  ${preload ? `<link rel="preload" as="image" href="/assets/img/${preload}-800.webp" imagesrcset="/assets/img/${preload}-800.webp 800w, /assets/img/${preload}-1600.webp 1600w" imagesizes="100vw" fetchpriority="high">` : ''}
  <link rel="stylesheet" href="/assets/css/site.css?v=${CSS_V}">
  <script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body>
${header(path)}
  <main id="main">
${body}
  </main>
${footer()}
  <script src="/assets/js/site.js?v=${JS_V}" defer></script>
  <script src="https://browser.sentry-cdn.com/10.56.0/bundle.min.js" integrity="sha384-I1ukPjbxF2xiLR7783CiOdXJQzh3teQkKlQN2c9HHa/d0M2Fflm3cEXhWSbUACZq" crossorigin="anonymous" defer></script>
  <script src="/assets/js/sentry-init.js" defer></script>
</body>
</html>
`;
}

// ---------- components ----------
const crumbsHtml = (crumbs) => `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${crumbs.map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.url}">${esc(c.name)}</a></li>`)).join('')}</ol></nav>`;

function pageHero({ crumbs, eyebrow, h1, lead, actions = true, aside = '' }) {
  return `
    <section class="page-hero">
      <div class="container ${aside ? 'page-hero-grid' : ''}">
        <div>
          ${crumbs ? crumbsHtml(crumbs) : ''}
          ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
          <h1>${h1}</h1>
          ${lead ? `<p class="lead">${lead}</p>` : ''}
          ${actions ? `<div class="actions"><a class="btn btn-primary" href="/contact/">Get a free estimate</a><a class="btn btn-outline" href="${tel}">${icon('phone')} ${site.phone}</a></div>` : ''}
        </div>
        ${aside}
      </div>
    </section>`;
}

const sectionHead = (eyebrow, h2, lead = '', center = false) => `
        <div class="section-head${center ? ' center' : ''}">
          ${eyebrow ? `<p class="kicker">${eyebrow}</p>` : ''}
          <h2>${h2}</h2>
          ${lead ? `<p class="lead">${lead}</p>` : ''}
        </div>`;

const checklist = (items) => `<ul class="checklist">${items.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('')}</ul>`;

const serviceCards = (list = services, headingTag = 'h3', compact = false) => `
        <div class="card-grid cols-${list.length === 3 ? 3 : 4}">
          ${list.map((s) => `
          <article class="card service-card">
            <${headingTag}><a class="stretched" href="${svcUrl(s)}">${esc(s.name)}</a></${headingTag}>
            <p>${esc(compact ? s.blurb : s.summary)}</p>
            <p class="card-meta"><span class="price">${esc(s.price)}</span><span class="more">Details ${icon('arrow')}</span></p>
          </article>`).join('')}
        </div>`;

const reviewCard = (r) => `
          <figure class="card review-card">
            ${stars}
            <blockquote><p>“${esc(r.quote)}”</p></blockquote>
            <figcaption><span class="avatar" aria-hidden="true">${r.name.split(' ').map((w) => w[0]).join('').replace('.', '')}</span><span><strong>${esc(r.name)}</strong><small>${esc(r.detail)}</small></span></figcaption>
          </figure>`;
const reviewGrid = (list = reviews) => `<div class="card-grid cols-${Math.min(list.length, 3)}">${list.map(reviewCard).join('')}</div>`;

const faqList = (items) => `
        <div class="faq-list">
          ${items.map((f) => `
          <details class="faq">
            <summary><span>${esc(f.q)}</span>${icon('chevron')}</summary>
            <div class="faq-body"><p>${esc(f.a)}</p></div>
          </details>`).join('')}
        </div>`;

const areaChips = (exclude) => `<ul class="chips">${areas.filter((a) => a.slug !== exclude).map((a) => `<li><a href="${areaUrl(a)}">${icon('pin')} ${esc(a.name)}, ${site.region}</a></li>`).join('')}</ul>`;

const ctaBand = (heading = 'Ready for a cleaner home?', text = 'Call, text, or send a request. Rose or Maria will get back to you the same day with a free, no-pressure estimate.') => `
    <section class="cta-section">
      <div class="container">
        <div class="cta-band">
          <div>
            <h2>${heading}</h2>
            <p>${text}</p>
          </div>
          <div class="actions">
            <a class="btn btn-light" href="/contact/">Get a free estimate</a>
            <a class="btn btn-ghost-light" href="${tel}">${icon('phone')} ${site.phone}</a>
          </div>
        </div>
      </div>
    </section>`;

const estimator = () => `
        <div class="estimator card" data-estimator>
          <form class="estimator-form" onsubmit="return false">
            <div class="field">
              <label for="est-service">Type of cleaning</label>
              <select id="est-service" name="service">
                <option value="standard">Standard cleaning</option>
                <option value="deep">Deep cleaning</option>
                <option value="move-out">Move-in / move-out</option>
              </select>
            </div>
            <div class="field">
              <label for="est-size">Home size <output id="est-size-out" for="est-size">1,600 sq ft</output></label>
              <input type="range" id="est-size" name="size" min="500" max="5000" step="100" value="1600">
            </div>
            <div class="field-row">
              <div class="field">
                <label for="est-beds">Bedrooms</label>
                <select id="est-beds" name="beds">${[1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}"${n === 3 ? ' selected' : ''}>${n}${n === 6 ? '+' : ''}</option>`).join('')}</select>
              </div>
              <div class="field">
                <label for="est-baths">Bathrooms</label>
                <select id="est-baths" name="baths">${[1, 1.5, 2, 2.5, 3, 4].map((n) => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n}${n === 4 ? '+' : ''}</option>`).join('')}</select>
              </div>
            </div>
          </form>
          <div class="estimator-result" aria-live="polite">
            <p class="result-label">Estimated range</p>
            <p class="result-price" id="est-price">$195 – $225</p>
            <p class="result-note">A starting point, not a final quote. We’ll confirm an exact price after a quick conversation about your home.</p>
            <a class="btn btn-light btn-block" id="est-cta" href="/contact/">Request this quote ${icon('arrow')}</a>
          </div>
        </div>`;

const photoMosaic = () => `
        <div class="mosaic">
          <figure class="m-a">${img(photos.kitchen, { sizes: '(min-width: 1024px) 50vw, 100vw' })}<figcaption>Kitchen &amp; dining</figcaption></figure>
          <figure class="m-b">${img(photos.masterBath, { sizes: '(min-width: 1024px) 25vw, 50vw' })}<figcaption>Master bathroom</figcaption></figure>
          <figure class="m-c">${img(photos.masterBed, { sizes: '(min-width: 1024px) 25vw, 50vw' })}<figcaption>Master bedroom</figcaption></figure>
          <figure class="m-d">${img(photos.suite, { sizes: '(min-width: 1024px) 25vw, 50vw' })}<figcaption>Guest suite</figcaption></figure>
        </div>`;

const heroSlides = [
  { ...photos.kitchen, caption: 'Kitchen and dining area' },
  { ...photos.masterBed, caption: 'Master bedroom' },
  { ...photos.masterBath, caption: 'Master bathroom' },
  { ...photos.suite, caption: 'Guest suite' },
];

// ---------- pages ----------
const pages = [];
const page = (p) => pages.push(p);

// Home: kept deliberately short. Every section either helps a visitor decide
// or carries SEO weight (service and area links, reviews).
page({
  path: '/',
  title: 'House Cleaning in St. George, UT | Rose’s Cleaning & Janitorial',
  description: 'Licensed & insured house cleaning in St. George, UT. Standard, deep, move-in/out & office cleaning by a local family team. Free estimates. Call (435) 301-4337.',
  preload: photos.kitchen.src,
  body: `
    <section class="hero" aria-label="Rose’s Cleaning &amp; Janitorial" data-hero>
      <div class="hero-slides">
        ${heroSlides.map((p, i) => `<div class="hero-slide${i === 0 ? ' is-active' : ''}" aria-hidden="${i !== 0}">${img(p, { eager: i === 0, sizes: '100vw', cls: 'hero-slide-img' })}</div>`).join('')}
      </div>
      <div class="hero-scrim" aria-hidden="true"></div>
      <div class="container hero-inner">
        <h1 class="hero-brand">
          <span class="hero-logo">Rose’s</span>
          <span class="hero-name">Cleaning &amp; Janitorial</span>
        </h1>
        <p class="hero-location">${icon('pin')} St. George, Utah</p>
        <div class="actions">
          <a class="btn btn-light btn-lg" href="/contact/">Get a free estimate</a>
          <a class="btn btn-ghost-light btn-lg" href="${tel}">${icon('phone')} ${site.phone}</a>
        </div>
        <ul class="hero-proof">
          <li>${stars}<span>5-star reviews</span></li>
          <li>${icon('shield')}<span>Licensed &amp; insured</span></li>
          <li>${icon('heart')}<span>Family owned</span></li>
        </ul>
      </div>
      <button type="button" class="hero-pause" aria-label="Pause slideshow" aria-pressed="false">${icon('pause', 'i-pause')}${icon('play', 'i-play')}</button>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head row-head">
          <div><p class="kicker">What we offer</p><h2>Our services</h2></div>
          <a class="link-arrow" href="/services/">Compare services ${icon('arrow')}</a>
        </div>
${serviceCards(services, 'h3', true)}
      </div>
    </section>

    <section class="section section-rose section-compact">
      <div class="container meet-rose">
        <figure class="owner-photo">
          ${img(photos.owner, { sizes: '(min-width: 760px) 300px, 70vw' })}
        </figure>
        <div class="meet-rose-copy">
          <p class="kicker">About us</p>
          <h2>Meet Rose</h2>
          <p class="role">Owner, Rose’s Cleaning &amp; Janitorial</p>
          <p>Rose treats every home like it’s her own. She’s friendly, detail-focused, and genuinely proud of the work she does, so you can relax knowing your space is in good hands.</p>
          <p>When you book with Rose’s, you work directly with Rose and Maria, never a call center or a rotating crew of strangers.</p>
          <ul class="meta-row"><li>Licensed &amp; insured</li><li>Family owned</li><li>St. George, Utah</li></ul>
          <a class="btn btn-light" href="/about/">More about us</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head row-head">
          <div>
            <p class="kicker">Real results</p>
            <h2>Our work</h2>
            <p class="lead">Real before-and-after results from homes we clean in St. George.</p>
          </div>
          <a class="link-arrow" href="/contact/">Book your cleaning ${icon('arrow')}</a>
        </div>
        <div class="results">
          ${results.map((r) => `
          <figure class="result">
            <div class="result-pair">
              <div class="result-img">${img(r.before, { sizes: '(min-width: 1080px) 190px, (min-width: 760px) 30vw, 50vw', alt: `${r.label} before cleaning` })}<span class="result-tag">Before</span></div>
              <div class="result-img">${img(r.after, { sizes: '(min-width: 1080px) 190px, (min-width: 760px) 30vw, 50vw', alt: `${r.label} after cleaning` })}<span class="result-tag result-tag-after">After</span></div>
            </div>
            <figcaption>${esc(r.label)}</figcaption>
          </figure>`).join('')}
        </div>
        <p class="subhead rooms-head">Finished rooms</p>
        <div class="rooms">
          ${[photos.kitchen, photos.masterBath, photos.masterBed, photos.suite].map((p, i) => `<figure class="room">${img(p, { sizes: '(min-width: 1080px) 290px, 50vw' })}<figcaption>${['Kitchen &amp; dining', 'Master bathroom', 'Master bedroom', 'Guest suite'][i]}</figcaption></figure>`).join('')}
        </div>
      </div>
    </section>

    <section class="section section-tint">
      <div class="container">
        <div class="section-head"><p class="kicker">Reviews</p><h2>What our clients say</h2></div>
${reviewGrid()}
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-band">
          <div>
            <h2>Get your free estimate</h2>
            <p>Serving ${areas.map((a) => `<a href="${areaUrl(a)}">${esc(a.name)}</a>`).join(', ').replace(/, ([^,]+)$/, ', and $1')} and the rest of ${site.county}.</p>
          </div>
          <div class="actions">
            <a class="btn btn-light" href="/contact/">Get a free estimate</a>
            <a class="btn btn-ghost-light" href="${tel}">${icon('phone')} ${site.phone}</a>
          </div>
        </div>
      </div>
    </section>`,
});

// Services hub
page({
  path: '/services/',
  title: 'Cleaning Services in St. George, UT | Rose’s Cleaning & Janitorial',
  description: 'Standard house cleaning, deep cleaning, move-in/move-out cleaning, and commercial janitorial services in St. George & Washington County, UT.',
  schema: [breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services/' }])],
  body: `
${pageHero({ crumbs: [{ name: 'Home', url: '/' }, { name: 'Services', url: '/services/' }], eyebrow: 'Our services', h1: 'Cleaning services in St. George, UT', lead: 'Four services, one standard: thorough, on time, and done with care. Pick the one that fits, or ask us and we’ll help you decide.' })}
    <section class="section">
      <div class="container">
${serviceCards(services, 'h2')}
      </div>
    </section>
    <section class="section section-tint">
      <div class="container">
${sectionHead('Compare', 'What’s included in each service')}
        <div class="table-wrap">
          <table class="compare">
            <thead><tr><th scope="col">Service</th><th scope="col">Starting price</th><th scope="col">Best for</th><th scope="col"><span class="sr-only">Link</span></th></tr></thead>
            <tbody>${services.map((s) => `<tr><th scope="row">${esc(s.name)}</th><td>${esc(s.price)}</td><td>${esc(s.bestFor[0])}</td><td><a class="link-arrow" href="${svcUrl(s)}">Details<span class="sr-only"> about ${esc(s.name)}</span> ${icon('arrow')}</a></td></tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    </section>
${ctaBand('Not sure which service you need?', 'Tell us about your home or business and we’ll recommend the right fit, with a free estimate.')}`,
});

// Service pages
for (const s of services) {
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Services', url: '/services/' }, { name: s.short, url: svcUrl(s) }];
  const review = reviews.find((r) => r.service === s.slug);
  const minPrice = (s.price.match(/\d+/) || [])[0];
  page({
    path: svcUrl(s),
    title: s.title,
    description: s.description,
    schema: [
      breadcrumbSchema(crumbs),
      {
        '@type': 'Service', name: s.name, serviceType: s.name, description: s.summary, url: abs(svcUrl(s)),
        provider: { '@id': businessId },
        areaServed: areas.map((a) => ({ '@type': 'City', name: `${a.name}, ${site.region}` })),
        ...(minPrice ? { offers: { '@type': 'Offer', priceCurrency: 'USD', priceSpecification: { '@type': 'PriceSpecification', minPrice: Number(minPrice), priceCurrency: 'USD' } } } : {}),
      },
      faqSchema(s.faqs),
    ],
    body: `
${pageHero({
  crumbs, eyebrow: esc(s.price), h1: `${esc(s.name)} in St. George, UT`, lead: esc(s.summary),
  aside: `<div class="page-hero-media">${img(s.slug === 'commercial-janitorial' ? photos.kitchen : s.slug === 'deep-cleaning' ? photos.masterBath : s.slug === 'move-in-move-out-cleaning' ? photos.suite : photos.masterBed, { eager: true, sizes: '(min-width: 1024px) 45vw, 100vw' })}</div>`,
})}
    <section class="section">
      <div class="container split split-top">
        <div class="prose">
          <h2>${esc(s.headline)}</h2>
          ${s.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
          <h3>Great for</h3>
          ${checklist(s.bestFor)}
        </div>
        <aside class="card included">
          <h2 class="h3">What’s included</h2>
          ${checklist(s.included)}
          <div class="price-box">
            <p><span class="price-lg">${esc(s.price)}</span></p>
            <p class="muted">${esc(s.priceNote)}</p>
            <div class="actions"><a class="btn btn-primary" href="/contact/?service=${s.slug}">Request ${esc(s.short.toLowerCase())}</a>${minPrice || s.slug === 'move-in-move-out-cleaning' ? `<a class="btn btn-outline" href="/pricing/">Estimate my price</a>` : ''}</div>
          </div>
        </aside>
      </div>
    </section>
    <section class="section section-flush-top">
      <div class="container narrow">
        ${review ? `<div class="solo-review">${reviewCard(review)}</div>` : ''}
${sectionHead('FAQ', `${esc(s.short)} FAQ`)}
${faqList(s.faqs)}
      </div>
    </section>
    <section class="section section-tint">
      <div class="container">
${sectionHead('More services', 'Other services')}
${serviceCards(services.filter((o) => o.slug !== s.slug), 'h3', true)}
        <p class="areas-line">${icon('pin')} ${esc(s.short)} available in ${areas.map((a) => `<a href="${areaUrl(a)}">${esc(a.name)}</a>`).join(', ')}.</p>
      </div>
    </section>
${ctaBand(`Book ${esc(s.short.toLowerCase())} in St. George`)}`,
  });
}

// Areas hub
page({
  path: '/areas/',
  title: 'Service Areas | House Cleaning in Washington County, UT',
  description: 'Rose’s Cleaning & Janitorial serves St. George, Washington, Santa Clara, Ivins, and Hurricane, UT. Licensed & insured local house and office cleaning.',
  schema: [breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Service areas', url: '/areas/' }])],
  body: `
${pageHero({ crumbs: [{ name: 'Home', url: '/' }, { name: 'Service areas', url: '/areas/' }], eyebrow: 'Service areas', h1: 'House cleaning across Washington County, Utah', lead: 'We’re based in St. George and clean homes and businesses throughout the surrounding communities.' })}
    <section class="section">
      <div class="container">
        <div class="card-grid cols-3">
          ${areas.map((a) => `
          <article class="card area-card">
            <h2 class="h3"><a class="stretched" href="${areaUrl(a)}">${esc(a.name)}, ${site.region}</a></h2>
            <p>${esc(a.headline)}.</p>
            <p class="card-meta"><span class="muted">${a.neighborhoods.slice(0, 3).map(esc).join(' · ')}</span><span class="more">View ${icon('arrow')}</span></p>
          </article>`).join('')}
          <article class="card area-card area-card-ask">
            <h2 class="h3">Don’t see your town?</h2>
            <p>If you’re elsewhere in ${site.county}, just ask. We may still be able to help.</p>
            <a class="btn btn-outline btn-sm" href="${tel}">${icon('phone')} ${site.phone}</a>
          </article>
        </div>
      </div>
    </section>
${ctaBand()}`,
});

// Area pages
for (const a of areas) {
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Service areas', url: '/areas/' }, { name: `${a.name}, ${site.region}`, url: areaUrl(a) }];
  const areaReviews = reviews.filter((r) => r.area === a.slug);
  const areaFaqs = [
    { q: `Do you offer house cleaning in ${a.name}, UT?`, a: `Yes. We offer standard, deep, move-in/move-out, and commercial cleaning in ${a.name} and the surrounding area. Call or text ${site.phone} for a free estimate.` },
    { q: `How much does house cleaning cost in ${a.name}?`, a: 'Standard cleaning starts at $120 and deep cleaning at $200, depending on the size of your home. Move-out and commercial cleaning are quoted individually. Our online estimator gives you an instant range.' },
    faqs[3].items[0],
  ];
  page({
    path: areaUrl(a),
    title: a.title,
    description: a.description,
    schema: [
      breadcrumbSchema(crumbs),
      { '@type': 'Service', name: `House cleaning in ${a.name}, ${site.region}`, serviceType: 'House cleaning', provider: { '@id': businessId }, areaServed: { '@type': 'City', name: `${a.name}, ${site.region}`, geo: { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng } } },
      faqSchema(areaFaqs),
    ],
    body: `
${pageHero({ crumbs, eyebrow: `${esc(a.name)}, Utah`, h1: `House cleaning in ${esc(a.name)}, UT`, lead: `Licensed and insured standard, deep, move-out, and office cleaning for ${esc(a.name)} homes and businesses, from a local family team.` })}
    <section class="section">
      <div class="container split split-top">
        <div class="prose">
          <h2>${esc(a.headline)}</h2>
          ${a.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
          <div class="callout">${icon('sparkle')}<p>${esc(a.localTip)}</p></div>
        </div>
        <aside class="card">
          <h2 class="h3">Areas we cover in and around ${esc(a.name)}</h2>
          ${checklist(a.neighborhoods)}
          <p class="muted small">Not on the list? Call and ask. If you’re nearby, we can likely help.</p>
          <a class="btn btn-primary btn-block" href="/contact/">Get a free estimate</a>
          <h3 class="subhead">Nearby areas</h3>
          ${areaChips(a.slug)}
        </aside>
      </div>
    </section>
    <section class="section section-tint">
      <div class="container">
${sectionHead('Services', `Cleaning services in ${esc(a.name)}`)}
${serviceCards(services, 'h3', true)}
      </div>
    </section>
    <section class="section">
      <div class="container narrow">
        ${areaReviews.length ? `<div class="solo-review">${reviewCard(areaReviews[0])}</div>` : ''}
${sectionHead('FAQ', `House cleaning in ${esc(a.name)}: common questions`)}
${faqList(areaFaqs)}
      </div>
    </section>
${ctaBand(`Book a cleaning in ${esc(a.name)}`)}`,
  });
}

// Pricing
const pricingFaqs = faqs.find((g) => g.group === 'Pricing').items;
page({
  path: '/pricing/',
  title: 'House Cleaning Prices & Cost Estimator | St. George, UT',
  description: 'How much does house cleaning cost in St. George? Standard cleaning from $120, deep cleaning from $200. Get an instant estimate for your home.',
  schema: [breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Pricing', url: '/pricing/' }]), faqSchema(pricingFaqs)],
  body: `
${pageHero({ crumbs: [{ name: 'Home', url: '/' }, { name: 'Pricing', url: '/pricing/' }], eyebrow: 'Transparent pricing', h1: 'House cleaning prices in St. George', lead: 'Get an instant range for your home below. Every estimate is free, and we’ll confirm your exact price before we ever start.', actions: false })}
    <section class="section section-flush">
      <div class="container">
${estimator()}
      </div>
    </section>
    <section class="section">
      <div class="container">
${sectionHead('Starting prices', 'What each service costs')}
        <div class="card-grid cols-4">
          ${services.map((s) => `<article class="card price-card"><h3><a class="stretched" href="${svcUrl(s)}">${esc(s.name)}</a></h3><p class="price-lg">${esc(s.price)}</p><p class="muted small">${esc(s.priceNote)}</p></article>`).join('')}
        </div>
      </div>
    </section>
    <section class="section section-tint">
      <div class="container split split-top">
        <div class="prose">
          <h2>What affects the price?</h2>
          <p>Every home is different, so we price by the work involved, not a one-size-fits-all rate. The biggest factors are:</p>
          ${checklist(['Square footage of the home', 'Number of bedrooms and bathrooms', 'The type of cleaning (standard, deep, or move-out)', 'The current condition of the home', 'How often you schedule service'])}
        </div>
        <div>
          <h2 class="h3">Pricing questions</h2>
${faqList(pricingFaqs)}
        </div>
      </div>
    </section>
${ctaBand('Want an exact price?', 'Call or text us with a few details about your home and we’ll give you a firm, free quote the same day.')}`,
});

// About
page({
  path: '/about/',
  title: 'About Rose & Maria | Rose’s Cleaning & Janitorial, St. George UT',
  description: 'Meet Rose and Maria, the owners of Rose’s Cleaning & Janitorial: a licensed and insured family cleaning business in St. George, Utah.',
  schema: [breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About', url: '/about/' }])],
  body: `
${pageHero({ crumbs: [{ name: 'Home', url: '/' }, { name: 'About', url: '/about/' }], eyebrow: 'About us', h1: 'Meet Rose &amp; Maria', lead: 'A local, family-owned cleaning business in St. George, Utah, built on showing up, doing it right, and treating every home like our own.' })}
    <section class="section">
      <div class="container split">
        <div class="prose">
          <h2>Cleaning you can actually count on</h2>
          <p>Rose’s Cleaning &amp; Janitorial is owned and operated by Rose and Maria. We’re a local family business that genuinely loves what we do. We show up on time, we’re thorough, and we care about getting it right.</p>
          <p>Rose built this business on hard work and a real love for what she does. She takes pride in every job, whether it’s a weekly clean or a top-to-bottom move-out, and she won’t call it done until it’s right.</p>
          <p>When you book with us, you’re not getting a rotating crew. You’re getting the two of us, in your home, every visit. We learn how you like things done and we keep it that way.</p>
          <p>St. George is our home too, and it shows in the work. From weekly upkeep for busy families to move-out cleans and office janitorial service, we bring the same attention to detail to every job.</p>
        </div>
        <figure class="owner-photo owner-photo-lg">
          ${img(photos.owner, { sizes: '(min-width: 960px) 380px, 80vw' })}
          <figcaption><strong>Rose</strong> Owner, Rose’s Cleaning &amp; Janitorial</figcaption>
        </figure>
      </div>
    </section>
    <section class="section section-tint">
      <div class="container">
${sectionHead('Our standards', 'What you can expect from us')}
        <div class="card-grid cols-4">
          ${[
            { icon: 'shield', t: 'Licensed & insured', d: 'We’re fully covered so you never have to worry about a thing.' },
            { icon: 'tag', t: 'Honest estimates', d: 'We give you a real number upfront. No surprises, no pressure.' },
            { icon: 'clock', t: 'Reliable scheduling', d: 'We show up when we say we will. Every single time.' },
            { icon: 'sparkle', t: 'Attention to detail', d: 'We get into the corners other cleaners skip: baseboards, vents, handles, and all.' },
          ].map((v) => `<article class="card"><h3>${v.t}</h3><p>${v.d}</p></article>`).join('')}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
${sectionHead('Our work', 'A few of the homes we care for')}
${photoMosaic()}
      </div>
    </section>
${ctaBand('We’d love to clean for you')}`,
});

// FAQ
const allFaqs = faqs.flatMap((g) => g.items);
page({
  path: '/faq/',
  title: 'House Cleaning FAQ | Rose’s Cleaning & Janitorial, St. George UT',
  description: 'Answers to common questions about our house cleaning, deep cleaning, move-out and commercial services in St. George, UT: pricing, booking, areas and more.',
  schema: [breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'FAQ', url: '/faq/' }]), faqSchema(allFaqs)],
  body: `
${pageHero({ crumbs: [{ name: 'Home', url: '/' }, { name: 'FAQ', url: '/faq/' }], eyebrow: 'FAQ', h1: 'Frequently asked questions', lead: `Can’t find what you’re looking for? Call or text us at <a href="${tel}">${site.phone}</a>. We’re happy to help.`, actions: false })}
    <section class="section section-flush">
      <div class="container faq-layout">
        <nav class="faq-toc" aria-label="FAQ topics">
          <p class="eyebrow">Topics</p>
          <ul>${faqs.map((g) => `<li><a href="#${g.group.toLowerCase().replace(/[^a-z]+/g, '-')}">${esc(g.group)}</a></li>`).join('')}</ul>
        </nav>
        <div>
          ${faqs.map((g) => `
          <section class="faq-group" id="${g.group.toLowerCase().replace(/[^a-z]+/g, '-')}">
            <h2 class="h3">${esc(g.group)}</h2>
${faqList(g.items)}
          </section>`).join('')}
        </div>
      </div>
    </section>
${ctaBand('Still have a question?', 'Rose and Maria answer every call and text themselves, usually the same day.')}`,
});

// Contact
page({
  path: '/contact/',
  title: 'Contact Us for a Free Cleaning Estimate | Rose’s Cleaning, St. George',
  description: `Get a free house or office cleaning estimate in St. George, UT. Call or text Rose & Maria at ${site.phone} or send a request online. Same-day replies.`,
  schema: [breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact/' }]), { '@type': 'ContactPage', url: abs('/contact/'), about: { '@id': businessId } }],
  body: `
${pageHero({ crumbs: [{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact/' }], eyebrow: 'Free estimates', h1: 'Get your free cleaning estimate', lead: 'Call, text, or fill out the form. You’ll hear back from Rose or Maria the same day.', actions: false })}
    <section class="section section-flush">
      <div class="container contact-grid">
        <div class="card contact-form-card">
          <h2 class="h3">Request an estimate</h2>
          <form id="quote-form" class="quote-form" novalidate>
            <div class="field-row">
              <div class="field"><label for="q-name">Your name <span class="req" aria-hidden="true">*</span></label><input id="q-name" name="name" autocomplete="name" required></div>
              <div class="field"><label for="q-phone">Phone <span class="req" aria-hidden="true">*</span></label><input id="q-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></div>
            </div>
            <div class="field-row">
              <div class="field"><label for="q-service">Service</label>
                <select id="q-service" name="service">
                  ${services.map((s) => `<option value="${s.slug}">${esc(s.name)}</option>`).join('')}
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>
              <div class="field"><label for="q-area">City</label>
                <select id="q-area" name="area">
                  ${areas.map((a) => `<option>${esc(a.name)}</option>`).join('')}
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div class="field"><label for="q-notes">Tell us about your space <span class="optional">(optional)</span></label><textarea id="q-notes" name="notes" rows="4" placeholder="Square footage, bedrooms and bathrooms, preferred days, anything we should know"></textarea></div>
            <p class="form-error" id="q-error" role="alert" hidden>Please add your name and phone number so we can reach you.</p>
            <div class="form-actions">
              <button class="btn btn-primary" type="submit" name="via" value="sms">${icon('chat')} Send by text</button>
              <button class="btn btn-outline" type="submit" name="via" value="email">${icon('mail')} Send by email</button>
            </div>
            <p class="muted small">This opens your phone’s texting app or your email app with your request filled in, so you can review it before you send. See our <a href="/privacy-policy/">privacy policy</a>.</p>
          </form>
        </div>
        <aside class="contact-side">
          <a class="contact-method" href="${tel}"><span><small>Call</small><strong>${site.phone}</strong></span></a>
          <a class="contact-method" href="${sms}"><span><small>Text</small><strong>${site.phone}</strong></span></a>
          <a class="contact-method" href="${mailto}"><span><small>Email</small><strong>${site.email}</strong></span></a>
          <div class="card">
            <h2 class="h4">Hours</h2>
            <p>${site.hours.label}</p>
            <h2 class="h4">Service area</h2>
            <p>${site.city} and ${site.county}: ${areas.map((a) => `<a href="${areaUrl(a)}">${esc(a.name)}</a>`).join(', ')}.</p>
          </div>
        </aside>
      </div>
    </section>`,
});

// Privacy policy
page({
  path: '/privacy-policy/',
  title: 'Privacy Policy | Rose’s Cleaning & Janitorial',
  description: 'How Rose’s Cleaning & Janitorial handles information on roses-cleaning.com and when you contact us.',
  schema: [breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Privacy policy', url: '/privacy-policy/' }])],
  body: `
${pageHero({ crumbs: [{ name: 'Home', url: '/' }, { name: 'Privacy policy', url: '/privacy-policy/' }], h1: 'Privacy policy', actions: false })}
    <section class="section section-flush">
      <div class="container narrow prose legal">
        <p>This policy explains what information ${esc(site.name)} (“we,” “us”) collects through roses-cleaning.com and when you contact us, and how we use it. We’re a small local business and we keep this simple: we only use your information to respond to you and provide the cleaning services you ask for.</p>

        <h2>Information you give us</h2>
        <p>When you call, text, or email us, or use the request form on our contact page, you may share your name, phone number, email address, city, and details about your home or business.</p>
        <p>Our request form does not send your information to a server. It opens your phone’s texting app or your email app with your message pre-filled, and nothing is sent until you choose to send it. After that, your message is handled by your phone carrier or email provider and ours, like any other text or email.</p>

        <h2>Information collected automatically</h2>
        <ul>
          <li><strong>Hosting and security.</strong> Our website is hosted by Railway and delivered through Cloudflare. Like most websites, these providers process technical information such as your IP address, browser type, and the pages requested, to deliver the site and protect it from abuse.</li>
          <li><strong>Error monitoring.</strong> We use Sentry to find and fix problems on the site. If an error happens while you’re browsing, Sentry receives technical details such as the page, browser, device type, and the error itself. We have configured it not to collect personal information such as your IP address.</li>
          <li><strong>Price estimator.</strong> The estimator runs entirely in your browser. The details you enter are not sent to us unless you choose to include them in a request.</li>
        </ul>
        <p>We do not use advertising trackers, and we do not set cookies for marketing or analytics.</p>

        <h2>How we use your information</h2>
        <ul>
          <li>To answer your questions and give you an estimate</li>
          <li>To schedule, provide, and follow up on cleaning services</li>
          <li>To keep the website working and secure</li>
        </ul>

        <h2>How we share it</h2>
        <p>We do not sell or rent your personal information. We only share it with the service providers described above, as needed to run our website and communicate with you, or when required by law.</p>

        <h2>How long we keep it</h2>
        <p>We keep your contact details and service notes for as long as you’re a client, or as long as needed to respond to your request, and then delete them when they’re no longer needed.</p>

        <h2>Your choices</h2>
        <p>You can ask us at any time what information we have about you, ask us to correct it, or ask us to delete it. Just call, text, or email us using the details below.</p>

        <h2>Children</h2>
        <p>Our website is not directed to children under 13, and we do not knowingly collect information from them.</p>

        <h2>Changes to this policy</h2>
        <p>If we update this policy, we’ll post the new version on this page.</p>

        <h2>Contact us</h2>
        <p>${esc(site.name)}<br>${site.city}, ${site.regionName}<br>Phone: <a href="${tel}">${site.phone}</a><br>Email: <a href="${mailto}">${site.email}</a></p>
        <p class="site-credit">Love this site and want one like it? Visit <a href="https://cailinjustine.dev" target="_blank" rel="noopener">cailinjustine.dev</a>!</p>
      </div>
    </section>`,
});

// 404
page({
  path: '/404.html',
  file: '404.html',
  noindex: true,
  sitemap: false,
  title: 'Page not found | Rose’s Cleaning & Janitorial',
  description: 'The page you were looking for could not be found.',
  body: `
${pageHero({ eyebrow: '404', h1: 'We couldn’t find that page', lead: 'It may have moved when we updated our site. Try one of these instead:', actions: false })}
    <section class="section section-flush">
      <div class="container">
${serviceCards()}
        <p class="center-link"><a class="btn btn-primary" href="/">Back to the homepage</a></p>
      </div>
    </section>`,
});

// ---------- write output ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'src/assets'), join(OUT, 'assets'), { recursive: true });
cpSync(join(ROOT, 'src/assets/favicon.png'), join(OUT, 'favicon.ico'));
cpSync(join(ROOT, 'src/assets/favicon.png'), join(OUT, 'favicon.png'));

for (const p of pages) {
  const file = p.file ? join(OUT, p.file) : join(OUT, p.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, layout(p));
}

const sitemapPages = pages.filter((p) => p.sitemap !== false);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

// serve (https://github.com/vercel/serve-handler) config: clean URLs, caching,
// security headers, and redirects from the old single-page anchors.
writeFileSync(join(OUT, 'serve.json'), JSON.stringify({
  cleanUrls: true,
  trailingSlash: true,
  redirects: [
    { source: '/index.html', destination: '/', type: 301 },
    { source: '/style.css', destination: '/assets/css/site.css', type: 301 },
  ],
  headers: [
    { source: 'assets/**', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '**/*.html', headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }] },
    { source: '**', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] },
  ],
}, null, 2));

console.log(`Built ${pages.length} pages into public/`);
