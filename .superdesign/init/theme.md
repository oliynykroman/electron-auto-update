# Theme

## Compact token summary

- Font: Inter with system sans-serif fallbacks.
- Text: `#17212b`; secondary `#5f6b7a`; muted `#697789`.
- Surface: white `#ffffff`; page background `#f5f7fb`; subtle panel `#f3f6fa`.
- Accent inherited as inspiration from the source application: `#498ccc`; use only as a neutral blue accent without old branding.
- Semantic states: success `#218650`; warning `#d88416`; error `#c53939`.
- Borders: `#dce3ec` and `#c9d2dd`.
- Radius: 10–12px controls/panels, 20px main card, fully round status indicators.
- Shadow: `0 24px 64px rgba(31, 45, 61, 0.12)`.
- Spacing: 8px base rhythm; 12, 18, 24, 32, 48px primary steps.
- Responsive breakpoint: 620px.

## Raw global source

```scss
* { box-sizing: border-box; }
html, body { min-height: 100%; margin: 0; }
body {
  color: #17212b;
  background: radial-gradient(circle at top left, rgba(49, 120, 198, 0.12), transparent 34%), #f5f7fb;
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

## Raw component source

```scss
:host { display: block; min-height: 100vh; }
.page-shell { min-height: 100vh; display: grid; place-items: center; padding: 32px; }
.version-card { width: min(100%, 560px); padding: 48px; border: 1px solid #dce3ec; border-radius: 20px; background: #fff; box-shadow: 0 24px 64px rgba(31,45,61,.12); }
.eyebrow { margin: 0 0 10px; color: #5f6b7a; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
h1 { margin: 0; color: #17212b; font-size: clamp(42px,8vw,64px); line-height: 1; letter-spacing: -.045em; }
.runtime-details { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 36px 0 24px; }
.runtime-details div { min-width: 0; padding: 14px; border-radius: 12px; background: #f3f6fa; }
.status { display: flex; align-items: center; gap: 10px; min-height: 48px; color: #4c5a69; font-size: 14px; }
.actions { display: flex; gap: 12px; margin-top: 22px; }
button { min-height: 44px; padding: 0 18px; border-radius: 10px; font: inherit; font-weight: 700; cursor: pointer; }
.primary { border: 1px solid #17212b; color: #fff; background: #17212b; }
.secondary { border: 1px solid #c9d2dd; color: #25313d; background: #fff; }
@media (max-width: 620px) { .page-shell { padding: 18px; } .version-card { padding: 30px 24px; } .runtime-details { grid-template-columns: 1fr; } .actions { flex-direction: column; } }
```

