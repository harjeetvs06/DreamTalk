# DreamTalk — Frontend Design System

Minimal, confident, light-themed, borderless/shadow-based depth. Inspired by Google Antigravity (restraint), Gemini (typography + living UI + accent blue), Apple Store (whitespace + guided flow).

## Colors

| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#FFFFFF` | Page background |
| `bg-secondary` | `#FAFAFA` | Cards, panels |
| `text-primary` | `#111111` | Headings, body text |
| `text-secondary` | `#6B7280` | Muted/helper text |
| `accent-primary` | `#2563EB` | Buttons, links, active nav, focus rings |
| `accent-primary-hover` | `#1D4ED8` | Hover state |
| `accent-emotion` | `#F97316` | Reserved ONLY for PAD/mood/emotion indicators — never used for generic UI actions |
| `success` | `#16A34A` | Confirmations |
| `error` | `#DC2626` | Errors, destructive actions |

Rule: `accent-emotion` must never appear on a button, link, or nav element — it's a dedicated signal color so emotional state visually reads as distinct from UI chrome.

## Depth (borderless, shadow-based)

- No 1px outline borders on cards, inputs, or panels — use soft drop shadows instead to imply elevation
- Card shadow: `0 2px 8px rgba(0,0,0,0.06)` at rest, `0 8px 24px rgba(0,0,0,0.10)` on hover
- Input fields: no border, `bg-secondary` fill, shadow appears only on focus (`0 0 0 3px rgba(37,99,235,0.15)`) instead of a focus ring outline
- Dividers where truly needed (rare): use whitespace/spacing to separate sections instead of a visible line first; only fall back to a very faint `rgba(0,0,0,0.06)` line if spacing alone isn't enough

## Typography

- Font: Inter or Geist (system-ui fallback)
- Headings: bold (700), large scale — H1 ~40–56px, H2 ~28–32px
- Body: regular (400), 16px, line-height 1.6
- Helper/meta text: 14px, `text-secondary`

## Spacing

- Base unit: 4px
- Standard gaps: 8 / 16 / 24 / 32 / 48 / 64px
- Page max-width: 1200px, centered, generous side padding (min 24px mobile, 64px+ desktop)

## Components (baseline behavior)

- **Buttons**: solid `accent-primary` fill for primary actions, outlined for secondary, rounded corners (8px), no shadow by default
- **Cards** (avatar cards, dashboard items): `bg-secondary`, 1px `border`, 12px radius, subtle hover lift (translateY -2px, 150ms ease)
- **Inputs**: 1px `border`, 8px radius, `accent-primary` focus ring, no heavy drop shadows
- **Chat bubbles**: user messages right-aligned `accent-primary` fill w/ white text; avatar messages left-aligned `bg-secondary` w/ `text-primary`
- **Emotion indicator**: small pill or glow using `accent-emotion`, intensity reflected via opacity/size, not color changes (keeps the color language consistent)

## Motion

- Libraries: GSAP for UI transitions/micro-interactions; Vanta.js for a subtle animated background — scoped to login/signup only, NOT the dashboard or chat screens (too distracting behind actual content)
- Minimal, purposeful only — no bounce, no playful easing
- Standard transition: 150–200ms ease-in-out
- Use motion for: message arrival (fade+slide 8px via GSAP), emotion state change (opacity pulse), page transitions (fade only)
- Avoid motion for: static content, hover on non-interactive elements

## Avoiding "AI-generated" look

- No em-dashes in UI copy — use periods or commas instead
- No gratuitous badges/pills/tags unless they carry real state (e.g. emotion indicator is fine, a "NEW ✨" badge is not)
- No decorative gradients applied just to look modern — gradients only if functionally motivated (e.g. emotion intensity)
- No generic AI marketing language ("Powered by AI", "✨ Experience the future of...", excessive rocket/sparkle emoji)
- No stock hero-section clichés (giant centered headline + subheadline + two buttons + abstract blob graphic) — prefer product-forward layouts that show real UI, not marketing copy
- Copy should sound direct and specific, not generic/inspirational

## Layout patterns

- **Dashboard**: grid of avatar cards, generous whitespace, big page heading ("Your Avatars")
- **Avatar creation**: single-column centered flow, one step visible at a time, progress indicator top (config → voice → face)
- **Chat/call screen**: avatar video/face prominent (top or left), chat thread below/beside, single input bar, no per-module buttons — settings/voice/config reachable via a small icon, not primary UI