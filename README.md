# VibeCoder Resource Center

A responsive, searchable resource center built from Rodrigo Cazuza's 214-item Notion database.

## Project inputs

- **Goal:** Help designers, creative developers, businesses, brands, and collaborators discover the right production resource quickly and reach its official page.
- **Deliverable:** Responsive website.
- **Audience:** Designers, front-end developers, creative collaborators, and the observed Rodrigo Cazuza client audience. The client persona remains an inference.
- **Dimensions / breakpoints:** Fluid desktop, tablet, and mobile layouts; key layout changes at 1180 px, 820 px, and 600 px.
- **Technology:** Next.js 16, React 19, TypeScript, CSS, and the OpenAI Sites/Vinext runtime.
- **Content supplied:** 214 Notion database records, a dashboard reference screenshot, and the confirmed Rodrigo Cazuza design-system specification.
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
- Featured collections provide direct entry points to GitHub repositories, Figma plugins, AI skills, 3D and motion tools, and design libraries.
- Category, type, access, and platform filters compose together.
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

## GitHub hub and AI news (October 2026)

- The **GitHub** parent item in the left sidebar expands into **Open-source Apps & Tools** and **Skills**. Both subcategories use the same resource cards, search terms and filters as the rest of the library.
- A catalog of 28 GitHub repositories is defined in `app/githubResources.ts`; five older GitHub entries are included in the apps subcategory. All linked repositories were checked when added.
- The **AI News** rail collapses from the right, remembers the visitor's preference, and includes weekly headlines or the complete rolling feed. It displays publisher favicons and opens original articles.
- News is a **static public JSON file** in `public/ai-news.json`, not a resource or database table. A standard-library Python script (`scripts/update-ai-news.py`) reads publisher RSS feeds, removes duplicates and keeps at most 50 links, automatically discarding older items.
- The GitHub Pages deployment workflow updates the digest on every push to `main`, via manual dispatch, and daily at **11:23 UTC**. GitHub scheduled jobs can be delayed. If all external feeds fail, the last successful digest is preserved.
- To refresh manually on a machine with Python 3 and internet access, run `python3 scripts/update-ai-news.py`, then rebuild the static site. No third-party news API key is required.
- Publisher feeds and favicon services are external; individual feeds or icons may occasionally be unavailable. Headlines are links to external journalism rather than locally stored article text.

