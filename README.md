# VibeCoder Resource Center

A responsive, searchable resource center built from Rodrigo Cazuza's 154-item Notion database.

## Project inputs

- **Goal:** Help designers, creative developers, businesses, brands, and collaborators discover the right production resource quickly and reach its official page.
- **Deliverable:** Responsive website.
- **Audience:** Designers, front-end developers, creative collaborators, and the observed Rodrigo Cazuza client audience. The client persona remains an inference.
- **Dimensions / breakpoints:** Fluid desktop, tablet, and mobile layouts; key layout changes at 1180 px, 820 px, and 600 px.
- **Technology:** Next.js 16, React 19, TypeScript, CSS, and the OpenAI Sites/Vinext runtime.
- **Content supplied:** 154 Notion database records, a dashboard reference screenshot, and the confirmed Rodrigo Cazuza design-system specification.
- **Accessibility / compliance:** Keyboard navigation, semantic landmarks, visible focus, reduced-motion support, descriptive external-link labels, and responsive overflow protection.

## Requirement-to-token mapping

| Requirement | Confirmed token / rule |
| --- | --- |
| Dominant canvas | #000000 |
| Navigation and cards | #0D0D0D with #1A1A1A borders / raised states |
| Primary / secondary copy | #FFFFFF / #B6B6BD |
| Calls to action and focus | #6026EC, hover #7A45FF, focus/accent #9B5CFF |
| Usefulness signal | #66D487 on black only |
| Display / editorial / UI type | Poppins / Playfair Display Italic / Inter |
| Spacing | 4, 8, 12, 16, 24, 40, 64, 96 px; section clamp rule |
| Corners | 8, 16, 24 px; 999 px pills |

## Behavior

- Search scans names, descriptions, use cases, platform names, and keywords.
- Category, type, and access filters compose together.
- Cards open official destinations in a new tab when confirmed.
- Entries without a confirmed destination are clearly labeled **Find official page** and open an exact official-page lookup rather than silently using an unverified link.
- Twenty-four cards render initially; the remaining matching records load in batches.

## Accessibility and contrast

- Text/background combinations use the confirmed high-contrast white or secondary gray on near-black surfaces.
- Violet is reserved for interactive actions and focus; green appears only as a signal on black surfaces.
- Green and violet do not touch directly.
- Controls have visible labels (including screen-reader-only labels), keyboard focus, minimum 44 px targets, and reduced-motion fallbacks.
- The layout has no intentional horizontal page overflow; category cards become a contained horizontal scroller on smaller screens.

## [NEEDS DECISION]

1. Supply the approved transparent Rodrigo Cazuza logo asset. Until then, the interface uses a text lockup and an RC identifier, not a fabricated logo.
2. Confirm the final official URL for database entries labeled **Find official page**.
3. Approve or replace the inferred audience persona.
4. Confirm a formal accessibility target if WCAG conformance certification is required.
5. Confirm the deadline; none was supplied.

## Pre-publish checklist

- [x] Positioning and inferred audience are represented.
- [x] Only confirmed UI palette hex values are used.
- [x] Type roles match the system.
- [x] Spacing and radius scales are respected.
- [x] Green and violet are separated by black.
- [x] Responsive layouts prevent page-level horizontal overflow.
- [x] Search, filters, cards, external links, and empty states are implemented.
- [x] Hero image has an attribution link; decorative graphics do not require alt text.
- [ ] Approved logo asset supplied.
- [ ] Unverified destinations approved.
- [ ] Formal accessibility target and deadline confirmed.
