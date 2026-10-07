# Shared UI components

The demo has one self-contained Angular component and no external component library.

## AppComponent

- Path: `src/app/app.component.ts`
- Description: Displays the web version, runtime metadata, update state, and update actions.

```ts
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { RuntimeInfo } from './electron-bridge';

type CheckState = 'idle' | 'checking' | 'current' | 'available' | 'error';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly webVersion = environment.appVersion;
  runtimeInfo: RuntimeInfo | null = null;
  latestVersion: string | null = null;
  checkState: CheckState = 'idle';
  message = 'Ready to check for a newer interface.';

  async ngOnInit(): Promise<void> {
    if (!window.updateDemo) {
      this.message = 'Open this interface inside the Electron shell.';
      return;
    }

    try {
      this.runtimeInfo = await window.updateDemo.getRuntimeInfo();
      await this.checkForUpdate();
    } catch (error) {
      this.checkState = 'error';
      this.message = error instanceof Error ? error.message : 'Could not read the runtime information.';
    }
  }

  async checkForUpdate(): Promise<void> {
    if (!window.updateDemo || this.checkState === 'checking') return;
    this.checkState = 'checking';
    this.message = 'Checking the update manifest…';

    try {
      const result = await window.updateDemo.checkForUpdate(this.webVersion);
      this.latestVersion = result.latestVersion;
      this.checkState = result.updateAvailable ? 'available' : 'current';
      this.message = result.updateAvailable
        ? `Version ${result.latestVersion} is ready. Reload to apply it.`
        : 'The interface is up to date.';
    } catch (error) {
      this.checkState = 'error';
      this.message = error instanceof Error ? error.message : 'The update check failed.';
    }
  }

  async reloadInterface(): Promise<void> {
    await window.updateDemo?.reloadInterface();
  }
}
```

```html
<main class="page-shell">
  <section class="version-card" aria-labelledby="version-heading">
    <p class="eyebrow">Electron update demonstration</p>
    <h1 id="version-heading">Version {{ webVersion }}</h1>

    <dl class="runtime-details" *ngIf="runtimeInfo">
      <div><dt>Interface source</dt><dd>{{ runtimeInfo.source }}</dd></div>
      <div><dt>Environment</dt><dd>{{ runtimeInfo.environment }}</dd></div>
      <div><dt>Shell</dt><dd>{{ runtimeInfo.shellVersion }}</dd></div>
    </dl>

    <div class="status" [attr.data-state]="checkState" role="status">
      <span class="status-dot" aria-hidden="true"></span>
      <span>{{ message }}</span>
    </div>

    <div class="actions">
      <button type="button" class="primary" (click)="checkForUpdate()" [disabled]="checkState === 'checking'">
        {{ checkState === 'checking' ? 'Checking…' : 'Check again' }}
      </button>
      <button *ngIf="checkState === 'available'" type="button" class="secondary" (click)="reloadInterface()">
        Reload interface
      </button>
    </div>
  </section>
</main>
```

