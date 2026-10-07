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
  message = 'Готово до перевірки новішої версії інтерфейсу.';

  get environmentLabel(): string {
    const labels: Record<string, string> = {
      local: 'Локальне',
      development: 'Розробка',
      staging: 'Тестове',
      production: 'Робоче',
    };
    return this.runtimeInfo ? labels[this.runtimeInfo.environment] ?? this.runtimeInfo.environment : 'Завантаження';
  }

  get sourceLabel(): string {
    if (!this.runtimeInfo) return 'Завантаження';
    return this.runtimeInfo.source === 'remote' ? 'Віддалене' : 'Локальне';
  }

  async ngOnInit(): Promise<void> {
    if (!window.updateDemo) {
      this.message = 'Відкрийте цей інтерфейс у застосунку Electron.';
      return;
    }

    try {
      this.runtimeInfo = await window.updateDemo.getRuntimeInfo();
      await this.checkForUpdate();
    } catch (error) {
      this.checkState = 'error';
      this.message = error instanceof Error ? error.message : 'Не вдалося отримати інформацію про середовище.';
    }
  }

  async checkForUpdate(): Promise<void> {
    if (!window.updateDemo || this.checkState === 'checking') return;

    this.checkState = 'checking';
    this.message = 'Перевіряємо наявність оновлення…';

    try {
      const result = await window.updateDemo.checkForUpdate(this.webVersion);
      this.latestVersion = result.latestVersion;
      this.checkState = result.updateAvailable ? 'available' : 'current';
      this.message = result.updateAvailable
        ? `Доступна версія ${result.latestVersion}. Застосуйте оновлення.`
        : 'Встановлено актуальну версію інтерфейсу.';
    } catch (error) {
      this.checkState = 'error';
      this.message = error instanceof Error ? error.message : 'Не вдалося перевірити наявність оновлення.';
    }
  }

  async reloadInterface(): Promise<void> {
    await window.updateDemo?.reloadInterface();
  }
}
