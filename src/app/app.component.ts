import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

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
    } finally {
      this.changeDetector.detectChanges();
    }
  }

  async checkForUpdate(): Promise<void> {
    if (!window.updateDemo || this.checkState === 'checking') return;

    this.checkState = 'checking';
    this.message = 'Перевіряємо наявність оновлення…';

    try {
      const result = await this.withTimeout(
        window.updateDemo.checkForUpdate(this.webVersion),
        12_000,
        'Сервер оновлень не відповів вчасно.',
      );
      this.latestVersion = result.latestVersion;
      this.checkState = result.updateAvailable ? 'available' : 'current';
      this.message = result.updateAvailable
        ? `Доступна версія ${result.latestVersion}. Застосуйте оновлення.`
        : 'Встановлено актуальну версію інтерфейсу.';
    } catch (error) {
      this.checkState = 'error';
      this.message = error instanceof Error ? error.message : 'Не вдалося перевірити наявність оновлення.';
    } finally {
      this.changeDetector.detectChanges();
    }
  }

  async reloadInterface(): Promise<void> {
    await window.updateDemo?.reloadInterface();
  }

  private withTimeout<T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error(message)), milliseconds);
      promise.then(
        (value) => {
          window.clearTimeout(timeout);
          resolve(value);
        },
        (error) => {
          window.clearTimeout(timeout);
          reject(error);
        },
      );
    });
  }
}
