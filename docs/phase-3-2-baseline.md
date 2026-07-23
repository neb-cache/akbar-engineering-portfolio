# Phase 3.2 Baseline

Recorded before the Phase 3.2 implementation on 2026-07-22.

## Existing strengths

- The public application already uses a restrained editorial token palette, local `next/font` variables, semantic landmarks, a skip link, route loading states, error boundaries, and empty-state components.
- Public pages remain Server Components. Existing client boundaries are limited to navigation, forms, error recovery, and admin editors.
- Project media already uses `next/image` with stable aspect-ratio containers.
- A global reduced-motion rule already shortens transitions and disables smooth scrolling.
- The initial `npm install`, `npm run lint`, `npm run typecheck`, and `npm run build` commands all pass.

## Interaction and consistency issues

- Motion durations and easing are not tokenized, and there is no reusable progressive scroll-reveal system.
- The mobile menu closes on link activation but has no Escape handling, focus trap, focus return, route-change cleanup, or body scroll lock.
- Interactive links and buttons use repeated one-off classes, producing inconsistent hover, active, loading, disabled, and focus behavior.
- Project cards have little hover/focus affordance and use a fixed mobile minimum height.
- Architecture diagrams are static; nodes cannot emphasize connected relationships.
- The gallery has no expanded keyboard-accessible view.
- Contact-form errors are visually associated but lack per-control `aria-invalid` and `aria-describedby` wiring.
- Several metadata labels are below a comfortable practical size, and some large headings rely on fixed breakpoint sizes instead of fluid type.
- Responsive layouts generally collapse correctly, but long titles, diagram relationships, action groups, sticky sidebars, and narrow 320px spacing need explicit safeguards.
- Loading placeholders use a generic pulse rather than the editorial design language.
- Admin controls have uneven focus, loading, and disabled states; safe shared-state styling can improve them without redesigning the CMS.

## Baseline validation

- `npm install`: pass; npm reports two high-severity dependency advisories, not automatically modified because the suggested force fix may be breaking.
- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm run build`: pass (Next.js 16.2.10, 18 generated routes).
- No test script exists in `package.json`.

## QA limitation

The in-app browser surface was unavailable during the initial audit. Browser and viewport checks must not be reported as completed unless that surface becomes available later in the phase.
