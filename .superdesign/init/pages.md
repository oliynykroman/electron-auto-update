# Pages

## `/` — Update status screen

Entry: `src/app/app.component.html`

Dependencies:

- `src/app/app.component.ts`
  - `src/environments/environment.ts` (replaced per build configuration)
  - `src/app/electron-bridge.d.ts`
- `src/app/app.component.html`
- `src/app/app.component.scss`
- `src/styles.scss`
- `src/app/app.module.ts`
- `src/main.ts`

The screen shows only update-relevant information: web version, shell version, interface source, environment, status message, check action, and conditional reload action.

