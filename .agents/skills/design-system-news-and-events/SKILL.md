---
name: design-system-news-and-events
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation for News and Events.
---

# News and Events Design System & UI Guidance Specification

## Mission
Deliver implementation-ready design-system guidance for News and Events that can be applied consistently across marketing site interfaces.

## Brand Context
- **Product/Brand**: News and Events
- **Target URL**: `https://www.cinehome.in/news-and-events/`
- **Audience**: Readers and knowledge seekers
- **Product Surface**: Marketing site

---

## 1. Guideline Authoring Workflow

Follow this 6-step workflow when generating or updating design system rules:

1. **Restate Design Intent**: Single-sentence focus statement.
2. **Define Foundations & Tokens**: Specify typography, colors, spacing, radius, shadow, and motion tokens.
3. **Define Component Anatomy & Behavior**: Document variants, responsive behavior, edge cases, and all mandatory states (default, hover, focus-visible, active, disabled, loading, error).
4. **Define Accessibility Criteria**: WCAG 2.2 AA testable acceptance rules with explicit pass/fail checks.
5. **Add Anti-Patterns & Prohibited Code**: Highlight incorrect implementations and migration notes.
6. **Execute QA Checklist**: Verification table for quality control.

---

## 2. Style Foundations & Design Tokens

### Typography Tokens
- `font.family.primary` = `PT Serif`
- `font.family.stack` = `PT Serif, serif`
- `font.size.base` = `14px` (`font.size.lg`)
- `font.weight.base` = `400`
- `font.weight.bold` = `700`
- `font.lineHeight.base` = `normal`

#### Typography Scale
| Token | Size | Application |
|---|---|---|
| `font.size.xs` | `0px` | Visually hidden / screen reader labels |
| `font.size.sm` | `12px` | Timestamps, metadata, micro captions |
| `font.size.md` | `13px` | Subtext, badge labels, secondary links |
| `font.size.lg` | `14px` | Standard body copy, button labels, inputs |
| `font.size.xl` | `16px` | Section headers, card titles (compact) |
| `font.size.2xl` | `18px` | Modal titles, article headers |
| `font.size.3xl` | `20px` | Primary page heading (`<h1>`) |

### Color Palette Tokens
All components **must** use semantic color tokens instead of raw hex values:

- `color.text.primary` = `#ffd734` (Brand gold accent, active links)
- `color.text.secondary` = `#ffffff` (Primary text on dark surfaces)
- `color.text.tertiary` = `#313131` (Dark text on light surfaces)
- `color.text.inverse` = `#888888` (Disabled text, placeholders, muted metadata)
- `color.surface.base` = `#000000` (Main page canvas background)
- `color.surface.muted` = `#f5f5f5` (Light cards, input fills)
- `color.surface.raised` = `#111111` (Elevated headers, dark container background)

### Spacing Scale Tokens
Every margin, padding, and gap **must** strictly use a value from this scale:

- `space.1` = `2px` (Focus ring offset)
- `space.2` = `5px` (Tag inline gaps)
- `space.3` = `8px` (Icon to text gaps)
- `space.4` = `10px` (Input vertical padding, card inner margins)
- `space.5` = `13px` (Section gutters)
- `space.6` = `15px` (Standard padding)
- `space.7` = `17px` (Grid column gaps)
- `space.8` = `20px` (Section gutters & container padding)

### Motion Tokens
- `motion.duration.instant` = `200ms` (`ease-out`)
- `motion.duration.fast` = `300ms` (`ease-in-out`)

---

## 3. Required Component State Matrix

Every component definition **must** specify visual, keyboard, and ARIA attributes for all 7 mandatory states:

1. **Default**: Standard layout and token assignment.
2. **Hover**: Visual change (`motion.duration.instant`), `cursor: pointer`.
3. **Focus-Visible**: 2px solid ring using `color.text.primary` (`#ffd734`), offset `space.1` (2px). `outline: none` without a visual replacement is strictly prohibited.
4. **Active**: Instant scale transform (`scale(0.98)`) or pressed state feedback.
5. **Disabled**: Opacity reduced, background `color.surface.muted`, text `color.text.inverse`, `aria-disabled="true"`, `cursor: not-allowed`.
6. **Loading**: Content replaced or overlaid with non-blocking spinner, `aria-busy="true"`.
7. **Error**: Border set to error accent, error text linked via `aria-describedby`, `aria-invalid="true"`.

---

## 4. Accessibility Requirements (WCAG 2.2 AA)

- **Keyboard Control**: All interactive elements **must** be reachable and operable using standard keyboard keys (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
- **Focus Rings**: Focus rings **must** be visible with at least 3:1 contrast ratio against adjacent colors.
- **Color Contrast**: Normal text **must** maintain a contrast ratio of at least 4.5:1 against its surface background. Accent text (`color.text.primary` `#ffd734` on `#000000`) provides 15.8:1 contrast.
- **Touch Targets**: Mobile touch targets **must** measure at least 44x44px.

---

## 5. Writing Tone Standards
Writing style **must** be **concise, confident, and implementation-focused**.

- **Do**: `Register for Film Festival`
- **Don't**: `Click Here to Sign Up Now!`

---

## 6. Prohibited Implementations & Anti-Patterns
- **Do not** use raw hex colors in component styles; always reference semantic design tokens.
- **Do not** suppress focus indicators (`outline: none` or `outline: 0`).
- **Do not** use ambiguous button or link labels ("Read More", "Click Here").
- **Do not** introduce custom spacing or font size overrides outside the token scale.

---

## 7. QA Checklist

Before shipping UI updates for News and Events, complete this checklist:

- [ ] All colors reference semantic tokens (`color.text.primary`, `color.surface.base`, etc.).
- [ ] All margins and paddings map to `space.1` through `space.8`.
- [ ] Every button and link displays a distinct 2px `:focus-visible` ring during keyboard tabbing.
- [ ] Visual contrast meets or exceeds WCAG 2.2 AA (4.5:1 for body copy).
- [ ] Component states (Default, Hover, Focus-Visible, Active, Disabled, Loading, Error) are fully implemented.
- [ ] Target size is at least 44x44px on touch viewports.
