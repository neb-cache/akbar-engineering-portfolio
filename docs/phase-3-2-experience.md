# Phase 3.2 — Experience

Phase 3.2 preserves the Phase 2/3.1 editorial identity while adding a restrained interaction system, accessible state changes, fluid typography, and narrow-screen safeguards. It does not change the database, public-data policy, confidential-content handling, or admin CRUD architecture.

## 1. Existing interaction issues discovered

- Motion had no shared timing/easing tokens or progressive reveal primitive.
- The mobile navigation lacked focus containment, Escape handling, focus return, body scroll lock, and automatic route-change closure.
- Architecture diagrams and project galleries were static.
- Project cards, timeline records, metrics, and dossier panels had inconsistent hover/focus affordances.
- Contact errors were not wired to their controls with `aria-invalid` and `aria-describedby`.
- Metadata text and long display titles needed more consistent readable sizing and wrapping.
- Loading treatment was a generic pulse; admin controls had uneven focus/loading states.

The full pre-change record is in `docs/phase-3-2-baseline.md`.

## 2. Motion system implemented

- Global fast, standard, slow, and reveal durations plus standard, enter, and exit easing variables.
- A reusable progressive `Reveal` component with fade, directional fade, subtle scale, and line-expand variants.
- Shared Intersection Observer instances by threshold, once-by-default behavior, configurable delay/threshold, and no layout shift.
- Server-rendered content remains visible before hydration and when JavaScript is unavailable.
- A short CSS-only hero sequence completes within approximately 700ms.

## 3. Components changed

- Public shell: navigation, footer, skip-link target, hero, section headings, CTA, featured work, project cards, case-study sections, metrics, timeline, diagrams, gallery, contact form, loading, empty, and error states.
- Public routes: home, projects, project detail, experience, about, and contact.
- Admin safety polish: shell, active sidebar state, shared inputs/results, submit/logout/delete controls.

## 4. New and changed client boundaries

- New: `Reveal` for Intersection Observer behavior.
- Converted to client: `ArchitectureDiagram` and `ProjectGallery` for meaningful local interaction.
- Enhanced existing clients: `Navbar` and `ContactForm`.
- Admin sidebar is now a small client boundary for accurate active-route indication.
- Pages and data-fetching layouts remain Server Components.

## 5. Typography changes

- Fluid `clamp()` sizing for hero, page titles, project titles, timeline roles, metrics, and major CTAs.
- A shared 68-character reading measure for long copy.
- Metadata labels standardized at practical 12px sizing with reduced letter spacing.
- Explicit overflow wrapping for titles, values, diagram labels, metadata, and long organization names.

## 6. Responsive fixes

- 320px container and action-group safeguards, including full-width non-icon actions.
- Grid columns use `minmax(0, 1fr)` where long text could force overflow.
- Project cards use a smaller mobile minimum height and fluid titles.
- Timeline spacing and title wrapping were tightened for narrow screens.
- Diagram groups stack on mobile and relationship labels wrap safely.
- Project-detail sidebar becomes sticky only at large breakpoints.
- Gallery keeps stable 16:9 thumbnails and a viewport-bounded expanded view.

## 7. Navigation improvements

- Stable animated desktop active indicator without layout shift.
- Mobile menu maintains `aria-expanded`/`aria-controls`, locks body scrolling, traps Tab navigation, closes with Escape, returns focus to its trigger, closes on route change, and keeps closed content out of the accessibility tree.
- Public and admin active routes expose `aria-current="page"`.

## 8. Diagram interaction improvements

- Nodes with meaningful descriptions or relationships are keyboard-focusable buttons.
- Hover/focus previews and click-selected states emphasize connected nodes and edges.
- Selection uses `aria-pressed` and an accessible status message.
- A consistent legend and collapsible complete text alternative remain available.
- Essential labels, descriptions, and relationships never depend on hover.

## 9. Gallery improvements

- Responsive stable-ratio image grid using `next/image`.
- Restrained warm/desaturated image treatment with a subtle hover zoom.
- Native accessible dialog with Escape close, browser focus containment, focus return, body scroll lock, previous/next controls, captions, and a viewport-bounded image stage.
- No carousel/lightbox dependency was added.

## 10. Accessibility fixes

- Visible global focus patterns and 44px public touch targets.
- Focusable skip-link destination.
- Mobile menu keyboard lifecycle and route state.
- Contact-control error associations, focus-on-first-invalid control, live result status, and stable submitting label.
- Diagram selection semantics and non-hover text alternative.
- Loading states expose a screen-reader status; decorative timeline markers/icons are hidden from assistive technology where appropriate.

## 11. Reduced-motion implementation

- Smooth scrolling, reveal transforms, hero delays, image zoom, panel lift, dialog motion, and skeleton sweep are removed or reduced under `prefers-reduced-motion: reduce`.
- All content remains immediately visible and state changes remain understandable.

## 12. Browser and runtime QA

- Local runtime smoke tests returned HTTP 200 for `/`, `/projects`, `/projects/smart-courier-ai`, `/experience`, `/about`, `/contact`, and `/admin/login`.
- Rendered markup contains the skip link, closed navigation state, visible pre-hydration reveal content, diagram buttons/text alternative, and contact form accessibility state.
- Automated visual/interaction checks in Chrome, Edge, Firefox, and Safari were not available because the in-app browser surface was unavailable in this session. They are intentionally not marked as passed.
- The live data currently has no public gallery record suitable for exercising the expanded-view path end to end.

## 13. Validation results

- `npm install`: pass; no package changes required.
- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm run build`: pass on Next.js 16.2.10; 18 routes generated.
- Existing tests: no test script is defined in `package.json`.
- `npm install` reports two high-severity dependency advisories. No force upgrade was applied because it may introduce breaking changes.

## 14. Known limitations

- Cross-browser visual baselines, real pointer/touch behavior, and exact 320–1920px screenshots still require manual browser QA.
- Native `<dialog>` is used intentionally; current evergreen browsers support it, but Safari should still receive a manual focus/scroll check.
- Gallery dialog runtime behavior needs a published media record for end-to-end verification.
- The phase does not add visual-regression or end-to-end test infrastructure.

## 15. Recommended Phase 3.3 scope

- Production deployment and domain configuration.
- Analytics and privacy review.
- Error monitoring and operational observability.
- Lighthouse/Web Vitals and image-delivery measurement.
- Cross-browser/device matrix and automated Playwright coverage.
- Dependency advisory review and controlled upgrades.
- Final SEO, social-card, structured-data, and production contact-delivery hardening.
