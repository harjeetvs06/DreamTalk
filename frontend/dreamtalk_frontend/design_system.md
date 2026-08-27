# DreamTalk — Frontend Design System

Minimalist, dark-themed, surface-contrast depth, inspired by high-end editorial agency websites.

## Colors

| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#0A0B0A` | Canvas background (near-black) |
| `bg-surface` | `#161715` | Cards, panels, inputs, surface containers |
| `bg-surface-hover` | `#1F211E` | Hover state on cards and surface elements |
| `text-primary` | `#F5F5F0` | Headings, primary body text (off-white) |
| `text-secondary` | `#9CA39A` | Muted/helper text, captions |
| `accent-primary` | `#C8F02D` | Buttons, links, active nav states, focus rings (electric lime-green) |
| `accent-primary-hover` | `#B3D928` | Hover state for primary accent |
| `accent-emotion` | `#F97316` | Reserved ONLY for mood/emotion indicators (vibrant orange) |
| `success` | `#16A34A` | Confirmations |
| `error` | `#EF4444` | Errors, destructive actions |

Rule: `accent-emotion` (`#F97316`) must never appear on a button, link, or nav element — it is a dedicated signal color so emotional state visually reads as distinct from UI chrome.

## Depth (surface-contrast, borderless, shadowless)

- No 1px outline borders and no box shadows (shadows are invisible on near-black canvas).
- Elevation is communicated purely through surface color contrast (`#161715` surface containers on `#0A0B0A` canvas).
- Hover state: smooth shift from `#161715` to `#1F211E` with an optional subtle `translateY(-2px)` lift.

## Typography

- Headings: **Bricolage Grotesque** (font weight 800) loaded via Google Fonts. Large, bold, editorial scale.
- Body: Clean sans-serif (**Inter** or system-ui fallback), regular weight (400) / medium (500).
- Section Markers: Muted editorial label in parentheses `( Section Label )` placed above major section headings.

## Spacing

- Base unit: 4px
- Standard gaps: 8 / 16 / 24 / 32 / 48 / 64px
- Page max-width: 1200px, centered, generous side padding (min 24px mobile, 64px+ desktop)

## Components (baseline behavior)

- **Buttons**: solid `accent-primary` (`#C8F02D`) fill with `#0A0B0A` text for primary actions; `#161715` surface fill for secondary.
- **Cards** (avatar cards, dashboard items): `bg-surface` (`#161715`), rounded-lg (8–12px), subtle hover lift (`translateY(-2px)`, 150ms ease).
- **Inputs**: `bg-primary` (`#0A0B0A`) fill with `#F5F5F0` text, focus ring using `accent-primary` (`#C8F02D`).
- **Chat bubbles**: user messages right-aligned `accent-primary` (`#C8F02D`) fill w/ `#0A0B0A` text; avatar messages left-aligned `bg-primary` (`#0A0B0A`) w/ `text-primary` (`#F5F5F0`).
- **Emotion indicator**: small pill using `accent-emotion` (`#F97316`), intensity reflected via opacity, never mixed with lime UI controls.

## Motion

- GSAP micro-interactions (message fade+slide 8px, emotion pulse, page transition layout).
- Vanta.js dynamic NET background (scoped to login/signup only) with dark canvas (`#0A0B0A`) and lime accent (`#C8F02D`).
- Horizontally scrolling marquee banner on landing page as section transition.

## Avoiding "AI-generated" look

- No em-dashes in UI copy — use periods or commas instead.
- No gratuitous badges/pills/tags unless they carry real state.
- No decorative gradients.
- No generic AI marketing language ("Powered by AI", "✨ Experience the future of...", rocket/sparkle emojis).
- Direct, specific, technical copy.

## Layout patterns

- **Landing page**: bold Bricolage Grotesque H1, one-line direct subheadline, marquee band transition, editorial section markers `( Capabilities )`, 01/02/03 numbered feature list, product UI chat mockup.
- **Dashboard**: grid of avatar cards on `#0A0B0A` canvas, surface headers in `#161715`.
- **Avatar creation**: 3-step wizard (Config → Voice → Face) on dark canvas with lime active indicators and dev skip option.
- **Chat screen**: avatar profile sidebar, chat thread with lime/dark bubbles, orange mood indicator.