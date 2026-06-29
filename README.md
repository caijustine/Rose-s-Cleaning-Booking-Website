# Rose's Cleaning & Janitorial — Business Website

A static business website for **Rose's Cleaning & Janitorial**, a licensed and insured family cleaning service based in St. George, Utah. Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step.

## Live Site

Hosted on GitHub Pages:
**https://caijustine.github.io/Rose-s-Cleaning-Booking-Website/**

> If GitHub Pages isn't enabled yet: go to the repo **Settings → Pages → Source**, set it to `main` branch and `/ (root)`, then save. The site will be live within a minute.

## What the Site Does

- **Hero section** — brand intro, CTA buttons to call or request a quote
- **Work showcase** — real photos of spaces maintained by Rose and Maria
- **Services** — four service cards (Standard Upkeep, Deep Clean, Move-In/Out, Commercial) with detailed checklists and starting prices
- **Price estimator** — interactive calculator where visitors input square footage, bedrooms, and bathrooms to get an instant price range
- **Before & After gallery** — auto-advancing slideshow and static comparison pairs showing real cleaning results
- **Testimonials** — three 5-star client reviews
- **Contact section** — one-tap call, text (SMS link), and email buttons
- **Mobile navigation** — hamburger drawer that works on all screen sizes
- **Sentry error monitoring** — client-side JS errors are captured automatically

## Project Structure

```
roses_cleaning/
├── index.html        # Entire site (single-page)
├── style.css         # All styling
├── app.js            # Calculator logic, slideshow, mobile nav, scroll reveals
├── favicon.png       # Browser tab icon (business logo)
├── images/           # Before/after and showcase photos
├── videos/           # Optional background video (cleaning.mp4)
└── package.json      # Local dev server (npm start)
```

## Running Locally

```bash
npm install
npm start
# Opens at http://localhost:3000
```

No build process — you can also just open `index.html` directly in a browser.

## Making Changes

All content lives in `index.html`. To update:
- **Phone/email** — search for `4352659950` or `brambilarosie773@gmail.com`
- **Prices** — search for `Starting at $` in the services section
- **Photos** — drop new images into `/images/` and update the `src` attributes
- **Background video** — add `videos/cleaning.mp4` to activate the video banner section

After editing, commit and push to `main` — GitHub Pages deploys automatically.

## Contact

Rose & Maria — (435) 265-9950 · brambilarosie773@gmail.com · St. George, UT
