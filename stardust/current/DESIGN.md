<!-- stardust:provenance writtenBy=stardust:extract mode=prep writtenAt=2026-10-13 source=stardust/current/_computed-styles.json,stardust/current/assets/css/style.css -->
---
name: VA.gov
description: U.S. Department of Veterans Affairs — benefits and health care for Veterans and families
colors:
  white: "#ffffff"
  ink: "#212121"
  link-blue: "#005ea2"
  navy-darkest: "#162e51"
  primary-dark: "#1a4480"
  gray-lightest: "#f1f1f1"
  border-gray: "#a9aeb1"
  ink-muted: "#3d4551"
  crisis-red: "#8b0a03"
  info-tint: "#e1f3f8"
typography:
  heading-h1:
    fontFamily: "Bitter, Georgia, Cambria, serif"
    fontSize: "40px"
    fontWeight: 700
  heading-h2:
    fontFamily: "Bitter, Georgia, Cambria, serif"
    fontSize: "32px"
    fontWeight: 700
  heading-h3:
    fontFamily: "Bitter, Georgia, Cambria, serif"
    fontSize: "17px"
    fontWeight: 700
  body:
    fontFamily: "\"Source Sans Pro Web\", \"Helvetica Neue\", Helvetica, Roboto, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "5px"
  pill: "50%"
spacing:
  "1": "8px"
  "2": "16px"
  "3": "24px"
  "4": "32px"
components:
  button-primary:
    backgroundColor: "{colors.link-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  footer:
    backgroundColor: "{colors.navy-darkest}"
    textColor: "{colors.white}"
---

## Overview
VA.gov is built on the VA Design System (a U.S. Web Design System derivative): white pages, navy-darkest
chrome (header and footer, `#162e51`), link-blue (`#005ea2`) for links and primary buttons, Bitter bold for
headings and Source Sans Pro for body copy. It reads as a plain-language, task-first government service.

## Colors
White dominates by area; `#162e51` carries the header and footer; `#1a4480` the home hero; `#f1f1f1` and
`#e1f3f8` are the gray and info-tint panels; `#005ea2` is every link and primary button; `#8b0a03` is the
Veterans Crisis Line accent. Source: `_computed-styles.json#aggregate.colors`.

## Typography
Bitter 700 for h1 (40px), h2 (32px) and h3 (~17–20px); Source Sans Pro Web 400/700 for body (20px on hubs,
16–17px in lists). Both are SIL OFL faces captured as woff2 under `assets/fonts/`.

## Layout
Content shell `vads-grid-container` capped at 1024px on hub pages (cap-probe); the home page uses full-bleed
bands with a 1024px module cap. Dominant breakpoint `min-width: 768px`; others 481, 640, 1024.
Hub pages: 2/3 main column + 1/3 sidebar at desktop, stacked on mobile.

## Elevation & Depth
Flat. The only shadow is the dropdown/menu shadow `0 2px 5px rgb(27,27,27)`.

## Shapes
5px radius on buttons, 4px on alerts and cards, round icon badges (50%) on the home benefit-hub grid.

## Components
Gov banner, crisis-line strip, header with mega menu, breadcrumbs, hub intro with "On this page" list,
link-teaser lists separated by gold star dividers, promo sidebar card, "Ask questions" sidebar, gray
"Other VA benefits and services" box, last-updated + Feedback button, navy footer.

## Do's and Don'ts
- Do keep link-blue underlined links and Bitter headings.
- Don't introduce shadows, gradients or rounded cards beyond the captured ones.
