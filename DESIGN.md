---
name: Kyle Piontek Portfolio
description: An editorial, work-first engineer portfolio on warm paper and near-black, with large light Manrope type, monospace labels, and real product recordings.
colors:
  paper: '#ecebe6'
  ink: '#141516'
  muted: '#55585c'
  line: '#d4d2cb'
  evergreen: '#1f5a43'
  evergreen-deep: '#143b2c'
  charcoal: '#17191b'
  pale-mint: '#a6d1bb'
  media-frame: '#dfded8'
  night: '#0f1011'
  night-ink: '#ecebe7'
  night-muted: '#a3a5a8'
  night-line: '#2a2c2f'
  night-rule: '#5a5d61'
  night-header: '#25282c'
  night-band: '#17181a'
typography:
  display:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: 'clamp(4.5rem, 10.5vw, 9.5rem)'
    fontWeight: 500
    lineHeight: 0.85
    letterSpacing: '-0.05em'
  contact:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: 'clamp(1.5rem, 7.4vw, 6.75rem)'
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: '-0.045em'
  title:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: 'clamp(2.5rem, 4.4vw, 4rem)'
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: '-0.045em'
  lead:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: 'clamp(1.15rem, 1.55vw, 1.375rem)'
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: '-0.015em'
  body:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 'normal'
  label:
    fontFamily: 'ui-monospace, SF Mono, Menlo, Consolas, monospace'
    fontSize: '0.8125rem'
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: '0.08em'
rounded:
  none: '0'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    rounded: '{rounded.none}'
    padding: '0 22px'
    height: '48px'
  text-link:
    backgroundColor: 'transparent'
    textColor: '{colors.evergreen}'
    rounded: '{rounded.none}'
    padding: '0 0 3px'
  section-label:
    textColor: '{colors.ink}'
    typography: '{typography.label}'
  project-media:
    backgroundColor: '{colors.media-frame}'
    rounded: '{rounded.none}'
    width: '100%'
---

# Design System: Kyle Piontek Portfolio

## Overview

**Work first, set like a printed page.** The portfolio earns attention through shipped work, a plain career history, and direct writing. It is a senior engineer's portfolio, never a product or company page.

The look comes from type, not decoration: one very large light headline, smaller light headings, monospace labels for anything that is metadata, and one-pixel rules that organize the page. The one decoration is a faint contour map of the real hills around Montpelier behind the hero. There are no other patterns, and no gradients, glass, or rounded cards. Real product recordings are the only imagery besides the portrait.

**Key characteristics:**

- Size contrast carries the hierarchy: the greeting and the email address are huge, labels are small, and nothing in between competes with them.
- Big type is light (weight 500) with tight tracking. Heavy weights at large sizes read as shouting.
- Metadata is monospace: section labels, the hero location row, dates, employer labels, stack lists, and the footer.
- Everything sits on one three-column grid, so the hero, the projects, Work History, and About share edges.
- Square edges everywhere.
- The hero's contour lines are the signature: real terrain, quiet at rest, lit green around the pointer.

## Colors

Light scheme: warm paper (#ecebe6) with near-black ink (#141516), muted text #55585c, hairlines #d4d2cb, and ink-colored section rules. Dark scheme: near-black (#0f1011) with off-white ink (#ecebe7), muted #a3a5a8, hairlines #2a2c2f, and gray section rules (#5a5d61).

- **Evergreen** (#1f5a43, Pale Mint #a6d1bb in dark): links, focus, selection, the media frame's hover border, and the contour lines under the pointer. Nothing else is green.
- **Charcoal** (#17191b, #25282c in dark): the header band, which stands apart from the page in both schemes.
- **The dark band** (ink in light, #17181a in dark): the contact section and footer, the one place the page changes background.

**The Accent Is a Signal Rule.** Green means "you can act on this." Backgrounds, headings, and buttons stay neutral; the primary button is ink on paper (paper on ink in dark).

## Typography

**Display and text:** Manrope, self-hosted with a metric-matched Arial fallback so the swap never moves text.

**Labels:** the system monospace stack (`ui-monospace`, SF Mono, Menlo, Consolas), so it costs no download.

- **Display** (500, `clamp(4.5rem, 10.5vw, 9.5rem)`, 0.85 line-height, -0.05em): the greeting only.
- **Contact** (500, `clamp(1.5rem, 7.4vw, 6.75rem)`, -0.045em): the email address. It wraps anywhere rather than overflow at 320px.
- **Title** (500, `clamp(2.5rem, 4.4vw, 4rem)`, -0.045em): the flagship project name. Other project names use `clamp(1.5rem, 2.1vw, 1.875rem)`; the About lead uses `clamp(1.625rem, 3vw, 2.5rem)`.
- **Lead** (500, `clamp(1.15rem, 1.55vw, 1.375rem)`): the hero intro and the Work History summary.
- **Body** (400, 1rem to 1.0625rem, 1.65 to 1.7 line-height): muted, held to about 39rem.
- **Label** (mono, 0.75rem to 0.8125rem): uppercase with 0.08em tracking for short labels; stack lists and dates keep their normal case.

**The Light Type Rule.** No heading on the page is heavier than 600. Large sizes use 500.

## Layout

A centered shell capped at 1280px with 32px gutters on desktop, 20px on tablet, and 16px on phones. Sections are padded `clamp(48px, 5vw, 72px)` top and bottom, and each one opens with a section label.

The page uses three equal columns with a `clamp(28px, 3vw, 44px)` gap:

- **Hero:** the greeting spans all three; the intro and resume button take two; the current and previous employers take the third.
- **Selected work:** the flagship (the first card) spans the row on a subgrid, recording across two columns and copy in the third. The other projects fill one column each.
- **Work History and About:** the summary or portrait in the first column, the list or copy across the other two.

Below 1080px each project becomes a row with the recording beside its copy. Below 820px the hero and Work History stack to one column, About narrows to a one-to-two split, and the header shows the name and role stacked beside the menu button. Below 620px everything stacks and the primary button fills the width.

**The Reading Order Rule.** Responsive layouts may simplify their columns, but they keep the document's reading order and never scroll sideways.

## Components

### Header

A fully opaque charcoal band, 80px on desktop and 72px on mobile, with the name, the role, the nav, and a Resume link set off by a thin vertical rule. It slides away while scrolling down and returns on any scroll up; it never hides near the top, while the mobile menu is open, or while keyboard focus is inside it. Below 820px a 44px menu button opens a full-height sheet with a clip-path transition, closes on Escape, and returns focus to the button.

### Hero

A mono row of location, working arrangement, and the local time in Vermont. The time is filled in after hydration (the prerendered page says "Eastern Time") and refreshes when the tab comes back into view instead of ticking, since a ticking clock is auto-updating content under WCAG 2.2.2. Under the greeting, the intro and resume button sit beside a ruled list of the current and previous employers.

### Hero contours

Contour lines every 40 m, with heavier index lines every 200 m, for about 32 by 20 km of the hills around Montpelier, traced from USGS 3DEP elevation data by `scripts/contours.mjs` into `public/montpelier-contours.svg` (about 15 KB gzipped). Montpelier sits at the center, where the Winooski and North Branch valleys meet.

The file is used as a CSS mask over a solid color, so the theme sets the line color and the lines stay one pixel wide at any size (`vector-effect: non-scaling-stroke`). It renders at least 1600px wide and centered, so phones show a slice of the map at the same density instead of a scaled-up one. The resting layer is ink at 22% (off-white at 14% in dark) and fades out from 30% to 95% of the hero's height, so the intro sits on near-plain ground. A second layer in Evergreen (Pale Mint in dark) shows only within a 240px circle around a fine pointer, with the same fade. The position reaches CSS through custom properties set from script, since the CSP allows no inline styles. The lit layer is absent on touch screens and under reduced motion, and browsers without mask support skip both layers rather than paint a solid block.

### Section labels

A muted index, the section's h2 in mono, and a one-pixel rule running to the edge of the shell. The index is `aria-hidden` so headings read as their words alone.

### Projects

Every project frame holds a short, silent, looping recording of the product (WebM with an MP4 fallback and a 1200x750 poster) at 16:10, with square corners and a one-pixel hairline. Recordings play muted only while in view, never under reduced motion, and each has a pause and play button. Hovering the frame draws a two-pixel evergreen border inside it. Copy sits outside the frame: the name, two short paragraphs, a mono stack line, and a "Visit {Name}" link.

### Work History

A ruled list of the whole career, one row per job on desktop: mono dates, the role, and the company right-aligned. The full detail lives in the resume. A full-width endorsement follows, with a hanging opening quote and a mono caption.

### About

A square portrait with square corners and no shadow. A large lead sentence, two muted paragraphs, and a mono "Day to day" line under a hairline.

### Contact and footer

The dark band. A short note, the email address set at contact size with a soft underline, and icon links for LinkedIn and GitHub. The footer is mono: the copyright, the role line, and links to the source on GitHub and back to the top.

### Buttons, links, and focus

Hover never moves anything: links strengthen their underline and shift color, buttons deepen and gain an underline, all over 200ms. Keyboard focus is a 1px dashed outline offset 3px, evergreen on paper and pale mint on the header, the dark band, and the video controls.

## Motion

The hero fades and rises into place once on load, and its contour lines light up around a fine pointer. The header slides, the mobile sheet clips open, and the recordings play in view. Everything else is still. Reduced motion removes the entrance, the pointer light, the transitions, and autoplay.

## Color Scheme

The site follows `prefers-color-scheme` with the same identity in both: paper and ink in light, near-black and off-white in dark. There is no manual toggle.

## Do's and Don'ts

### Do:

- **Do** lead with real product recordings, factual outcomes, and readable evidence.
- **Do** get hierarchy from size contrast and spacing, with light weights at large sizes.
- **Do** put metadata in the mono label style and everything else in Manrope.
- **Do** keep elements on the three-column grid and use one-pixel rules to organize them.
- **Do** keep visible focus, semantic reading order, and reduced-motion behavior at every breakpoint.

### Don't:

- **Don't** recast the portfolio as a product or company marketing page: no taglines, logo walls, impact metrics, or testimonial carousels.
- **Don't** add background patterns beyond the hero contours, or gradients, glass, glows, rounded cards, or shadows beyond the header's.
- **Don't** add preloaders, custom cursors, smooth-scroll libraries, scroll-driven text, or marquees.
- **Don't** turn skills or technologies into badges or pills.
- **Don't** make motion necessary for comprehension or ignore reduced-motion preferences.
