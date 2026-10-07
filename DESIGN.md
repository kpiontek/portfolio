---
name: Kyle Piontek Portfolio
description: A work-first engineer portfolio on warm paper and near-black, with alternating section bands, one type scale, one spacing scale, and a self-drawing contour map of the hills around Montpelier.
colors:
  paper: '#ecebe6'
  surface: '#f6f5f1'
  ink: '#141516'
  muted: '#55585c'
  line: '#d4d2cb'
  evergreen: '#1f5a43'
  evergreen-deep: '#143b2c'
  jade: '#3fae74'
  charcoal: '#17191b'
  media-frame: '#dfded8'
  night: '#0f1011'
  night-surface: '#16171a'
  night-ink: '#ecebe7'
  night-muted: '#a3a5a8'
  night-line: '#2a2c2f'
  night-header: '#25282c'
  night-band: '#1d1f22'
typography:
  display:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: 'clamp(3.25rem, 2rem + 5vw, 5.5rem)'
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: 'normal'
  section:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: 'clamp(1.75rem, 1rem + 2.5vw, 2.25rem)'
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: 'normal'
  title:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: 'clamp(1.5rem, 0.5rem + 4vw, 1.75rem)'
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: 'normal'
  lead:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: 'clamp(1.1875rem, 1rem + 0.6vw, 1.375rem)'
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 'normal'
  body:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 'normal'
  small:
    fontFamily: 'Manrope, Helvetica Neue, sans-serif'
    fontSize: '1rem'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 'normal'
  meta:
    fontFamily: 'ui-monospace, SF Mono, Menlo, Consolas, monospace'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 'normal'
rounded:
  none: '0'
  small: '8px'
  round: '50%'
components:
  text-link:
    backgroundColor: 'transparent'
    textColor: '{colors.evergreen}'
    rounded: '{rounded.none}'
    padding: '0 0 3px'
  project-media:
    backgroundColor: '{colors.media-frame}'
    rounded: '{rounded.small}'
    width: '100%'
---

# Design System: Kyle Piontek Portfolio

## Overview

**Work first, with one scale for everything.** The portfolio earns attention through shipped work, a plain career history, and direct writing. It is an engineer's portfolio, never a product or company page.

Structure comes from bands: the hero, then sections that alternate between the page color and a slightly different surface, then a dark contact band and footer. Inside them, every size comes from one type scale and every gap from one spacing scale, so nothing is oversized or tiny by accident. The signature is a contour map of the real hills around Montpelier, colored by elevation, that draws itself behind the full-height hero on load and sits, still and fainter, behind the contact band.

**Key characteristics:**

- Seven text sizes and an 8px spacing scale, defined once as custom properties at the top of `src/Portfolio.scss`.
- Sections read as separate bands, each opening with a title over a green rule.
- Green marks what you can act on: links, navigation, focus.
- Metadata (dates, stack lists, skill groups, the endorsement caption) is monospace.
- Square edges except 8px corners on the project recordings and the right end of the desktop header bar, and the round portrait.
- Nothing moves on its own except the map drawing itself in once.

## Colors

Light scheme: warm paper (#ecebe6) alternating with a lighter surface (#f6f5f1), near-black ink (#141516), muted text #55585c, and hairlines #d4d2cb. Dark scheme: near-black (#0f1011) alternating with a lifted surface (#16171a), off-white ink (#ecebe7), muted #a3a5a8, and hairlines #2a2c2f.

- **Evergreen** (#1f5a43) in light mode and **Jade** (#3fae74) in dark mode and on the dark bands: links, navigation, section rules, the quote mark, focus, and selection. Outside the contour map, nothing else is green.
- **The dark band** (ink in light, #1d1f22 in dark): the header, the contact section, and the footer, so the header and footer bookend the page.

**The Accent Is a Signal Rule.** Green means "you can act on this" or "a new section starts here." Backgrounds and body text stay neutral.

## Typography

**Display and text:** Manrope, self-hosted with a metric-matched Arial fallback so the swap never moves text. **Metadata:** the system monospace stack, so it costs no download.

Every piece of text uses one of these sizes:

| Token            | Size     | Used for                                                         |
| ---------------- | -------- | ---------------------------------------------------------------- |
| `--text-display` | 52 to 88 | The greeting and the quote mark                                  |
| `--text-2xl`     | 28 to 36 | Section titles, the mobile menu                                  |
| `--text-xl`      | 24 to 28 | Project titles, the endorsement, the email address               |
| `--text-lg`      | 19 to 22 | The hero intro, the Experience and About leads, the contact note |
| `--text-md`      | 18       | Body copy, Experience rows                                       |
| `--text-sm`      | 16       | Navigation, text links, the header role, the footer              |
| `--text-xs`      | 14       | Metadata: dates, stack lists, captions                           |

Large sizes use weight 500. Nothing sets `letter-spacing`; every font uses its own spacing.

## Spacing

An 8px scale: `--space-1` (8) through `--space-7` (80), plus `--gutter` (24 to 40) for every grid gap and `--section` (64 to 96) for every section's top and bottom padding. The rules that follow from it:

- A section title's rule sits `--space-1` below it and `--space-5` above the content.
- Paragraphs in a block are `--space-2` apart; a link or stack line after them is `--space-3` away.
- A project's recording sits `--space-3` above its copy, and project rows are `--space-6` apart.
- List rows are padded `--space-2` top and bottom.

## Layout

A centered shell capped at 1280px with 32px gutters on desktop, 20px on tablet, and 16px on phones. The page uses three equal columns separated by the gutter:

- **Personal Projects:** the flagship (the first card) spans the row on a subgrid, recording across two columns and copy in the third. The other projects fill one column each.
- **Experience:** the lead in the first column, the list across the other two.
- **About:** the portrait in the first column, centered against the copy across the other two, then the skills box across the full width.

Between 821px and 1080px each project becomes a row with the recording beside its copy. At 820px and below, where the mobile menu takes over, projects, Experience, and About all stack (About reads portrait, copy, skills, with the skills in two columns), and the header shows the name and role stacked beside the menu button. Below 620px the skills drop to one column.

**The Reading Order Rule.** Responsive layouts may simplify their columns, but they keep the document's reading order and never scroll sideways.

## Components

### Header

80px tall on desktop and 72px on mobile (`--header-height`), in the footer's tone, with the name, the role, the nav, and a Resume link set off by a thin vertical rule. On desktop (821px and up) it is a floating bar: 16px below the top of the window, starting at the window's left edge, with the name on the content column's left edge, the first link 80px after the name or role, and 8px rounded right corners 32px past the Resume link. The rest of the header is clear and lets clicks through, and the hero runs up underneath it so the map shows around the bar. On mobile it is a full-width band. Nav links are green and turn white on hover. In-page links (the nav, the name, Back to top, the skip link) scroll to their section and move focus there without adding `#id` to the address bar. The header slides away while scrolling down and returns on any scroll up; it never hides near the top, while the mobile menu is open, or while keyboard focus is inside it. Below 820px a 44px menu button opens a full-height sheet with a clip-path transition, closes on Escape, and returns focus to the button.

### Hero

Fills the screen below the header (`100svh` minus `--header-height`), with the greeting, a short intro, and a muted line with the location, centered vertically over the contour map. The resume lives in the header, not in a button here.

### Contour map

Contour lines every 40 m, with heavier index lines every 200 m, for about 32 by 20 km of the hills around Montpelier, traced from USGS 3DEP elevation data by `scripts/contours.mjs`. Montpelier sits at the center, where the Winooski and North Branch valleys meet. Each line is colored by its elevation, from valley green through gold and orange to ridgetop red, on a curve that brings the warm colors further down the slopes.

The script writes two files. `src/assets/hero-contours.svg` gives every line its own path with `pathLength="1"`, grouped by elevation, and the page imports it raw and renders it inline behind the hero, so the stylesheet can draw it: on load each line traces itself from end to end in 2.2 seconds (a dash offset from 1 to 0), each elevation starting 0.18 seconds after the one below it, so the map draws from the valleys to the ridges in about five seconds and then holds still. Because it is CSS on markup that ships in the prerendered page, it starts the moment the page renders, every time. It covers the hero like `background-size: cover` (`preserveAspectRatio="xMidYMid slice"`), sits at 60%, and fades out toward the intro. Under reduced motion it renders finished and still. It adds about 15 KB gzipped to the page.

`public/montpelier-contours.svg` is the same map with one path per elevation, drawn still at 22% behind the contact band as a background, rising from the bottom.

### Section headings

Each section opens with its h2 at `--text-2xl` over a 1px solid green rule that spans 60% of the shell on desktop and the full width at 820px and below.

### Projects

Every project frame holds a short, silent, looping recording of the product (WebM with an MP4 fallback and a 1200x750 poster) at 16:10, with 8px rounded corners and a one-pixel hairline. Recordings stay on their poster, unloaded, until a visitor presses the play button; then they loop silently, and the same button pauses them. Hovering the frame draws a two-pixel green border inside it. Copy sits outside the frame: the name, which links to the product in green and underlines on hover, two short paragraphs, and a mono stack line.

### Experience

A lead sentence and a "View Resume" link in the first column; the whole career across the other two, one row per job on desktop: mono dates, the role, and the company right-aligned, with a hairline between jobs and none above the first or below the last. The first row sits flush with the top so it lines up with the lead. Below a full-width hairline, the endorsement opens with a large green quote mark and closes with a mono caption.

### About

A round portrait, 320px at most (240px and centered on its own row at 820px and below), vertically centered against a lead sentence and two muted paragraphs. Under both, a full-width skills box: a 1px hairline frame on the page color holding "Key skills" and six groups from the resume (Languages, Frontend, Backend & APIs, Data & CMS, Infrastructure & Tooling, AI Engineering) in three columns, each a mono label over its four or five strongest items.

### Contact and footer

The dark band, with the still contour map rising faintly from the bottom. The heading, a one-line invitation, the email address at `--text-xl` with a soft underline, and icon links for LinkedIn and GitHub. Below a hairline that runs edge to edge, one compact footer row: the copyright on the left, links to the source on GitHub and back to the top on the right. Footer links are green and turn white on hover, like the header's.

### Links and focus

Hover never moves anything: links strengthen their underline and shift color over 200ms. Keyboard focus is a 1px dashed outline offset 3px, evergreen on paper and jade on the header, the dark band, and the video controls.

## Motion

The hero map draws itself in once on load, and the hero text rises into place once. The header slides, the mobile sheet clips open, and the recordings play only when a visitor presses play. Everything else is still. Reduced motion shows the map finished and removes the text entrance and the transitions.

## Color Scheme

The site follows `prefers-color-scheme` with the same identity in both: paper and ink in light, near-black and off-white in dark. There is no manual toggle.

## Do's and Don'ts

### Do:

- **Do** take every font size from the type scale and every gap from the spacing scale.
- **Do** separate sections with bands and their green-ruled titles, not ornaments.
- **Do** lead with real product recordings, factual outcomes, and readable evidence.
- **Do** keep visible focus, semantic reading order, and reduced-motion behavior at every breakpoint.

### Don't:

- **Don't** add a one-off size or spacing value; add it to the scale or use the nearest step.
- **Don't** set `letter-spacing`; the fonts' own spacing is used everywhere.
- **Don't** recast the portfolio as a product or company marketing page: no taglines, call-to-action buttons, logo walls, impact metrics, or testimonial carousels.
- **Don't** add background patterns beyond the contour map, or gradients, glass, glows, corners rounder than 8px (the portrait aside), or shadows beyond the header's.
- **Don't** add cursor effects, preloaders, smooth-scroll libraries, scroll-driven text, marquees, or anything that loops on its own.
- **Don't** pull icons from a font kit or icon library; draw any icon as inline SVG.
- **Don't** turn skills or technologies into badges or pills.
