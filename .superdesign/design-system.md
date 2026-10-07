# Electron Update Demo — design system

## Product context

A deliberately anonymous desktop demonstration of a non-standard Electron web-interface update mechanism. The single screen must help a reviewer immediately understand the current version, runtime environment, interface source, and update state. It must contain no login, business data, company identity, old logo, or domain-specific navigation.

## Visual direction

Use a compact desktop utility/dashboard aesthetic inspired by the source application's restrained operational UI, without copying its identity. Introduce a slim dark navy title bar, a neutral circular update glyph made with CSS, a prominent version number, concise metadata panels, and a clear update-status panel. The result should feel like a real system utility rather than a marketing landing page.

## Tokens

- Font: Inter/system sans-serif only.
- Navy: `#17212b`; dark bar: `#101820`.
- Blue accent: `#498ccc`; blue tint: `#eaf3fb`.
- Page: `#eef2f6`; surface: `#ffffff`; secondary surface: `#f5f7fa`.
- Main text: `#17212b`; secondary: `#5f6b7a`; muted: `#7d8996`.
- Success: `#218650`; warning: `#d88416`; error: `#c53939`.
- Border: `#d9e0e8`.
- Radius: 6px for utility controls, 10px for panels, 14px maximum for the main card.
- Shadow: subtle and functional, never glossy: `0 16px 42px rgba(23, 33, 43, 0.12)`.
- Spacing: 8px rhythm.

## Layout

- Fixed-size desktop utility composition that remains responsive below 620px.
- Slim top application bar with generic product label and one right-aligned environment badge.
- Main centered content, maximum width approximately 720px.
- Version is the primary visual element.
- Runtime metadata remains three compact equal columns on desktop and stacks on mobile.
- Status panel clearly separates state from actions.

## Components

- Buttons: compact, 40–44px high; blue primary and white secondary; visible focus state.
- Status indicator: small round dot plus text, using semantic color only.
- Metadata cards: subtle gray background, uppercase 11px labels, strong 14px values.
- No logos, avatars, illustrations, photos, gradients beyond a very subtle background wash, or decorative charts.

## Motion and accessibility

- Only use a restrained pulse while checking.
- Preserve keyboard focus visibility, semantic headings, `role=status`, sufficient contrast, and disabled states.
- Respect reduced-motion preferences.

## Content constraints

Keep exactly the existing functional content: web version, shell version, interface source, environment, update message, check button, and conditional reload button. Do not invent authentication, settings, menus, release notes, download progress, or business features.

