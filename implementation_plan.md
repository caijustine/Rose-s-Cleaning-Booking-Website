# Elevated Botanical Design & Motion Implementation Plan

This plan updates **Rose's Cleaning and Janitorial** website to feel elevated, airy, and nature-inspired. We are shifting from an overly pink theme to a premium boutique spa, luxury Airbnb aesthetic. We'll use a balanced palette of soft sage greens, muted dusty blues, creamy whites, and warm blush nudes, with rose tones restricted to subtle accents. We'll also implement a custom scroll-motion system.

---

## User Review Required

### 1. The New Color Palette
- **Primary Sage Green**: `--color-sage-primary: #8fa190`
- **Dark Sage (emphasis)**: `--color-sage-dark: #586959`
- **Soft Sage Light**: `--color-sage-light: #f2f5f2`
- **Muted Dusty Blue**: `--color-blue-primary: #7ea0a6`
- **Blush Nude (secondary/neutral)**: `--color-blush-nude: #f7ede8`
- **Muted Rose Accent (restricted use)**: `--color-rose-accent: #c98e91`
- **Base Warm Cream**: `--color-cream-bg: #faf8f5`
- **Main Text (deep slate olive)**: `--color-text-main: #2f3430`

### 2. Motion and Interactive Effects
- **Floating Petals/Leaves (Parallax)**: We will add absolute-positioned floating botanical line SVGs that shift coordinates based on scroll offset.
- **Scroll Reveal (Intersection Observer)**: Elements will fade in and slide up gracefully as they enter the screen.
- **Hero Reveal**: The main headline will have a soft character or line fade reveal on initial page load.

---

## Proposed Changes

We will modify the core files in the workspace:

### Component Refactoring

#### [MODIFY] [style.css](file:///Users/cai/personal_projects/roses_cleaning/style.css)
- Replace color tokens with the new spa-inspired variables.
- Add animation keyframes for floating elements, subtle fade-ins, and curtain-like text overlays.
- Increase padding and margin scales (e.g. from `100px` to `140px` section padding) to create a premium, open, airy feel.
- Restyle the service cards, before/after slider, and calculator panels with clean glassmorphic borders and soft drop shadows instead of solid pink boxes.

#### [MODIFY] [index.html](file:///Users/cai/personal_projects/roses_cleaning/index.html)
- Add SVG floating petal containers in the background markup.
- Insert hand-drawn inline SVG botanical illustrations to replace any heavy rose icons, keeping them minimal and elegant.
- Update headlines and copy to match the premium "Luxury-Level Cleaning" messaging.
- Structure elements with animation class tags (e.g. `class="reveal-item"`).

#### [MODIFY] [app.js](file:///Users/cai/personal_projects/roses_cleaning/app.js)
- Add **Intersection Observer** loops to trigger scroll-reveal animation classes.
- Add a mouse-move/scroll listener to generate a gentle parallax shifting effect on the floating SVG elements.
- Maintain existing slider and calculator functions, but tie them to the new CSS classes and layout structures.

---

## Verification Plan

### Manual Verification
1. **Motion Performance Check**: Run the site on mobile/tablet viewports to ensure the parallax scroll offsets do not cause stutter or layout shifts.
2. **Contrast & Legibility**: Verify that the dark slate-olive text has strong accessibility contrast ratios against the cream and soft sage backgrounds.
3. **Visual Aesthetic Review**: Confirm that the overall tone feels botanical and luxury-spa rather than overly girly or vintage.
