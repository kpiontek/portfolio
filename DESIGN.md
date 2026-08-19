---
name: Kyle Piontek Portfolio
description: A clean, work-first senior developer portfolio built on sage white, forest charcoal, deep evergreen, and real product evidence.
colors:
  sage-canvas: "#f1f4f1"
  paper: "#fbfcfb"
  white: "#ffffff"
  forest-charcoal: "#111814"
  moss-slate: "#56615b"
  quiet-moss: "#56615b"
  sage-rule: "#cfd7d1"
  sage-rule-strong: "#9eaaa2"
  evergreen: "#1f5a43"
  evergreen-hover: "#164532"
  deep-forest: "#0d261c"
  inverse-muted: "#bdccc4"
  focus-fern: "#3f765c"
  pale-mint: "#a6d1bb"
  burnt-orange: "#b5471f"
  inverse-orange: "#ffb58a"
  media-frame: "#e2e9e4"
  portrait-frame: "#dfe7e1"
typography:
  display:
    fontFamily: "Manrope, Helvetica Neue, sans-serif"
    fontSize: "clamp(4rem, 7vw, 5.75rem)"
    fontWeight: 730
    lineHeight: 0.98
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Manrope, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.7rem, 5vw, 4.4rem)"
    fontWeight: 710
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.3rem, 4vw, 3.5rem)"
    fontWeight: 710
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Manrope, Helvetica Neue, sans-serif"
    fontSize: "clamp(1.2rem, 1.8vw, 1.42rem)"
    fontWeight: 540
    lineHeight: 1.48
    letterSpacing: "-0.018em"
  body:
    fontFamily: "Manrope, Helvetica Neue, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, Helvetica Neue, sans-serif"
    fontSize: "0.89rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  none: "0"
  control: "2px"
  round: "50%"
components:
  button-primary:
    backgroundColor: "{colors.evergreen}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.evergreen-hover}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.evergreen}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 0 4px"
  text-link-hover:
    backgroundColor: "transparent"
    textColor: "{colors.burnt-orange}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 0 4px"
  navigation-link:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
  navigation-link-hover:
    backgroundColor: "transparent"
    textColor: "{colors.inverse-orange}"
    rounded: "{rounded.none}"
  project-media:
    backgroundColor: "{colors.media-frame}"
    rounded: "{rounded.none}"
    width: "100%"
  experience-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.forest-charcoal}"
    rounded: "{rounded.none}"
    padding: "36px 0"
---

# Design System: Kyle Piontek Portfolio

## Overview

**Creative North Star: "Work First"**

Work First means the portfolio earns attention through shipped work, career evidence, and direct writing. It is clean, modern, professional, precise, credible, restrained, and editorial. The interface behaves like a senior developer portfolio, never a product or company page.

The visual system pairs sage-white and paper fields with forest-charcoal text, a solid evergreen header, confident Manrope typography, and thin structural rules. Large type establishes seniority without bravado. Spacious grids give product screens and concrete outcomes room to lead.

Real product screens and authored content are the expressive material. Low-contrast dot, line, and concentric-circle fields add depth at section edges without becoming content. Motion is quiet and optional. The system rejects generic tech-template styling, product-marketing framing, novelty navigation, faux technical diagrams, gradient washes, glass, badge clouds, and decorative metaphors.

**Key Characteristics:**

- Work and evidence lead before decoration.
- Manrope carries a direct, sentence-case hierarchy.
- Sage-white and paper sections create quiet editorial pacing, with nearly tonal geometric patterns preventing large fields from feeling vacant.
- A solid evergreen header provides a stable wayfinding anchor.
- Evergreen anchors primary actions, interactive text, full-width section-title underlines, and the concluding contact field; burnt orange makes hover state changes unmistakable without motion.
- Thin rules and square frames organize content, with restrained elevation reserved for the sticky header and circular portrait.
- Real product imagery supplies specificity and visual character.
- Responsive reflow preserves reading order, and reduced motion preserves meaning.

## Colors

The palette is grounded, restrained, and high-contrast. Deep evergreen owns primary actions, wayfinding, and the conclusion, while sage-tinted neutrals carry the long reading experience.

### Primary

- **Evergreen Action** (#1f5a43): The header field, primary action fill, light-surface links, full-width section-title underlines, text selection, contribution markers, and low-opacity structural patterns.
- **Evergreen Pressed** (#164532): The darker hover state for primary buttons.
- **Focus Fern** (#3f765c): The globally visible keyboard-focus outline, chosen to clear 3:1 against both light surfaces and Deep Forest.
- **Pale Mint** (#a6d1bb): The accessible default for links and title rules on the inverse contact field.
- **Burnt Orange** (#b5471f): The stationary hover color for links on Paper and Sage White surfaces.
- **Inverse Orange** (#ffb58a): The stationary hover color for links on Evergreen Action and the Deep Forest field.

### Neutral

- **Sage White Canvas** (#f1f4f1): The page background and the work and about section fields.
- **Paper** (#fbfcfb): The hero and experience section.
- **Pure White** (#ffffff): Header navigation, inverse text, and primary-button text.
- **Forest Charcoal** (#111814): Primary headings and body emphasis.
- **Deep Forest** (#0d261c): The contact and footer field.
- **Moss Slate** (#56615b): Supporting copy, navigation, roles, and secondary information.
- **Quiet Moss** (#56615b): Compact dates and stack metadata. It shares Moss Slate's measured contrast while retaining a quieter semantic role.
- **Sage Rule** (#cfd7d1): Repeated separators, row borders, and media outlines.
- **Strong Sage Rule** (#9eaaa2): Capability dividers that need slightly more authority.
- **Inverse Sage** (#bdccc4): Supporting copy and footer text on the Deep Forest field.
- **Media Frame** (#e2e9e4): The muted sage backing behind real product screens.
- **Portrait Frame** (#dfe7e1): The quiet backing within the circular headshot.

### Named Rules

**The Evergreen Wayfinding Rule.** Evergreen owns the header, primary actions, default interactive text, full-width section-title underlines, focus, selection, evidence markers, the concluding field, and nearly tonal structural patterns. Burnt Orange and Inverse Orange are reserved for stationary link hover feedback.

## Typography

**Display Font:** Manrope (with Helvetica Neue and sans-serif fallbacks)

**Body Font:** Manrope (with Helvetica Neue and sans-serif fallbacks)

**Character:** One contemporary grotesk does all the work. Tight tracking and substantial weight make headings confident; open line-height and moderate weights keep long-form evidence calm and readable.

### Hierarchy

- **Display** (730, 4-5.75rem responsive, 0.98 line-height, -0.038em tracking): The opening statement only. Its exact size is `clamp(4rem, 7vw, 5.75rem)` and its measure stays short.
- **Headline** (710, 2.7-4.4rem responsive, 1 line-height, -0.035em tracking): Major section titles and the inverse contact heading use `clamp(2.7rem, 5vw, 4.4rem)`.
- **Title** (710, 2.3-3.5rem responsive, 1.04 line-height, -0.035em tracking): Featured project names use `clamp(2.3rem, 4vw, 3.5rem)`, with supporting project titles stepping down from the same family.
- **Lead** (540, 1.2-1.42rem responsive, 1.48 line-height, -0.018em tracking): Opening context and project summaries use `clamp(1.2rem, 1.8vw, 1.42rem)` to bridge headings and body evidence.
- **Body** (400, `1rem`, 1.75): Long-form explanation, generally held to a 62-68 character measure.
- **Label** (700, `0.89rem`, 1.2): Buttons and strong text links. Navigation and metadata use nearby compact sizes with weights from 620 to 730.

### Named Rules

**The Type Carries Authority Rule.** Establish hierarchy through scale, weight, measure, and spacing. Do not add ornamental type treatments, code styling, or all-caps badge language.

## Layout

The page uses a centered shell capped at 1280px. Desktop gutters are 32px per side, tablet gutters are 20px, and mobile gutters are 16px. Section padding expands fluidly from 96px to 152px, with the contact band reaching 160px at its widest.

The opening viewport uses a 7:5 grid with a fluid 56-120px gap and an 800px maximum visual height. Section headings use two equal columns. The flagship project copy uses a 4:8 split, supporting projects use two equal columns, experience rows use a 2:3:6 split, the about section uses a 4:8 split, and the contact band uses two equal columns. This repeated asymmetry makes hierarchy legible without card chrome.

At 1080px the header role disappears and the capability grid reduces to two columns. At 820px the hero, section headings, and contact layout become single-column; project and experience grids simplify while retaining comparison structure. At 620px all content stacks, the primary button fills the available width, section spacing tightens, and semantic reading order becomes the visual order.

**The Reading Order Rule.** Responsive layouts may simplify their columns, but they must preserve the document's semantic order and never require horizontal scrolling.

## Elevation & Depth

The system uses no glass effects and keeps content surfaces flat. Depth comes from alternating Sage White Canvas and Paper fields, the Deep Forest contact band, low-contrast geometric background fields, one-pixel rules, high-contrast type, and real product imagery inside outlined frames. The sticky header uses a shallow downward `0 10px 24px rgba(13, 38, 28, 0.16)` shadow to separate fixed navigation from scrolling content. The circular portrait uses a soft `0 12px 32px rgba(31, 90, 67, 0.14)` evergreen cast. Project imagery stays stationary while its frame gains a three-pixel Evergreen Action border on hover.

### Named Rules

**The Flat-by-Default Rule.** Surfaces remain flat at rest and in interaction. Use tonal shifts, rules, and restrained image scale instead of shadows or blur. Reserve directional depth for the sticky header's layer separation and the portrait's photographic framing.

## Shapes

The form language is square and exact. Project frames, section bands, navigation, and content containers have no visible rounding. Primary buttons use a restrained 2px radius. The portrait uses a full circular crop, echoed by the 6px project-contribution markers and low-contrast concentric background lines. One-pixel dividers, square-stroked arrows, dot fields, and directional line fields reinforce the precise geometry.

**The Square-Edge Rule.** Keep content surfaces square. Reserve slight rounding for controls and full rounding for the portrait and small status or evidence dots.

## Components

### Buttons

Buttons are direct and compact rather than oversized or promotional.

- **Shape:** Nearly square corners with a 2px radius and a 48px minimum height.
- **Primary:** Evergreen Action with Pure White text, 20px horizontal padding, compact label type, and no shadow.
- **Hover / Focus:** Hover moves the control up 2px while shifting to Evergreen Pressed over 180ms. Keyboard focus uses a 3px Focus Fern outline with a 4px offset.
- **Mobile:** The primary button becomes full width below 620px.

### Text Links

Text links are the secondary action language. They use Evergreen Action, bold compact type, a one-pixel underline, a fixed 8px arrow gap, and 4px bottom padding. Hover removes the underline without moving the label or arrow and shifts to Burnt Orange over 180ms. Inverse contact links use Pale Mint and shift to Inverse Orange while dropping their underline.

### Cards / Containers

Projects are not boxed into decorative cards. A project media frame uses Media Frame backing, a one-pixel Sage Rule outline inset by 1px, square corners, and overflow clipping. Featured media preserves its source aspect ratio at every width; supporting media uses 16:10, changing to 4:3 on narrow screens. Text sits outside the frame in the page grid. Hover keeps the image stationary and adds a three-pixel Evergreen Action border inside the frame over 180ms.

### Navigation

The sticky header is a fully opaque Evergreen Action band, 80px on desktop and 72px on mobile, with Pure White identity and navigation, a translucent divider, a quieter pale role label, and a shallow downward shadow. Desktop navigation remains stationary and shifts to Inverse Orange on hover; the resume link is separated by a translucent vertical rule. Below 820px a 44px two-line menu button reveals a full-height evergreen navigation sheet using a solid clip-path transition, never an opacity fade. The sheet opens over 320ms and closes over 220ms, stays mounted so exit motion can complete, and becomes inert through visibility and pointer state while closed. Scrollbar compensation preserves the header, content shell, and menu width when body scrolling locks. Escape closes the sheet and restores focus to the menu button; crossing the desktop breakpoint also clears the lock. White links become large direct rows separated by translucent rules, and hovered rows shift to Inverse Orange without changing layout.

### Section Headings

Each major section opens with a large headline marked by an Evergreen Action underline spanning the full title width. A concise muted summary sits to the right without a second divider below the heading group. On mobile the pair stacks with a 24px gap. The inverse contact heading uses Pale Mint for its full-width underline.

### Featured Project Evidence

The flagship project pairs a large real product screen with a 4:8 evidence grid. Whitespace separates the media from the title and evidence, with no divider above the title. The left column holds the project title and role. The right column holds the summary, ruled contribution rows with evergreen dots, stack metadata, and text links. At 620px the grid becomes one reading column while retaining the same evidence order.

### Experience Rows

Experience is a ruled list, not a timeline illustration. Each row uses 36px vertical padding and three desktop columns for dates, role and company, and evidence. It simplifies to two columns at tablet width and one column on mobile.

### Contact and Footer

The contact band and footer form one Deep Forest conclusion. Large Pure White type anchors the invitation, Inverse Sage supports the message, and underlined Pale Mint links shift to Inverse Orange while dropping their underline on hover. A translucent white rule separates the compact three-column footer, which stacks on mobile.

**The State, Not Spectacle Rule.** Motion may clarify hover, focus, menu state, or initial hierarchy. It must remain restrained, disappear under reduced-motion preferences, and never carry essential meaning.

## Do's and Don'ts

### Do:

- **Do** lead with real product screens, factual outcomes, and readable evidence.
- **Do** use large Manrope headings, measured line lengths, and generous whitespace to establish confidence.
- **Do** alternate Sage White Canvas, Paper, and Deep Forest fields to pace long pages.
- **Do** use nearly tonal dot, directional-line, and concentric-line patterns at section edges to give large fields quiet depth.
- **Do** use one-pixel rules to organize sections, lists, and media without adding card chrome.
- **Do** preserve visible focus, semantic reading order, and reduced-motion behavior at every breakpoint.
- **Do** use evergreen consistently for actions, links, full-width title underlines, evidence, and the conclusion.

### Don't:

- **Don't** recast the portfolio as a product or company marketing page.
- **Don't** add gradient washes, glass, zero-offset decorative glows, floating panels, broadly rounded cards, or shadows beyond the header and portrait's restrained directional treatments.
- **Don't** introduce novelty navigation, decorative metaphors, faux technical diagrams, or blueprint treatments.
- **Don't** turn skills or technologies into badge clouds or pill collections.
- **Don't** replace product evidence with stock illustration, abstract decoration, or generic interface mockups.
- **Don't** make motion necessary for comprehension or ignore reduced-motion preferences.
