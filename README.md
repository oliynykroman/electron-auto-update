# Центр оновлення Electron

Самодостатній демонстраційний проєкт механізму оновлення вебінтерфейсу Electron-застосунку. Початкова версія інтерфейсу зберігається в коді застосунку, а нові вебверсії — у каталозі `updates/` цього ж репозиторію.

## Як працює демонстрація

1. Electron запускає локальну версію `1.0.0`.
2. Застосунок читає `version.json`, опублікований через GitHub Pages.
3. Якщо в `updates/version.json` вказана новіша версія, інтерфейс показує кнопку «Застосувати оновлення».
4. Після натискання Electron очищає кеш і завантажує новий інтерфейс із GitHub Pages.
5. Electron-оболонку перевстановлювати не потрібно.

Каталог `updates/` уже містить демонстраційне оновлення `1.1.0`.

## Структура оновлення

```text
updates/
├── .nojekyll
├── index.html
├── version.json
├── main.*.js
├── polyfills.*.js
├── runtime.*.js
└── styles.*.css
```

`updates/` є готовим статичним сайтом. GitHub Actions публікує його як GitHub Pages.

## Системні вимоги

- Node.js 22 LTS або Node.js 24;
- npm, який постачається разом із Node.js;
- macOS, Windows або Linux;
- доступ до інтернету для встановлення залежностей і перевірки оновлення.

Перевірка версій:

```bash
node --version
npm --version
```

## Завантаження та встановлення

Клонуйте репозиторій:

```bash
git clone https://github.com/oliynykroman/electron-auto-update.git
cd electron-auto-update
```

Встановіть залежності:

```bash
npm install
```

Глобально встановлювати Angular CLI або Electron не потрібно.

## Увімкнення GitHub Pages

Цю дію потрібно виконати один раз:

1. Відкрийте репозиторій `electron-auto-update` на GitHub.
2. Перейдіть до `Settings` → `Pages`.
3. У блоці `Build and deployment` виберіть `Source: GitHub Actions`.
4. Відкрийте вкладку `Actions`.
5. Запустіть workflow «Публікація демо-оновлення», якщо він не стартував автоматично після push.

Workflow `.github/workflows/deploy-updates.yml` публікує вміст каталогу `updates/` за адресою:

```text
https://oliynykroman.github.io/electron-auto-update/
```

Маніфест версії буде доступний тут:

```text
https://oliynykroman.github.io/electron-auto-update/version.json
```

## Повна демонстрація оновлення

Після публікації GitHub Pages запустіть:

```bash
npm start
```

Команда:

1. збирає локальну версію `1.0.0`;
2. встановлює режим `local`;
3. запускає Electron;
4. автоматично перевіряє GitHub Pages;
5. знаходить опубліковану версію `1.1.0`.

У вікні Electron:

1. дочекайтеся повідомлення про доступну версію `1.1.0`;
2. натисніть «Застосувати оновлення»;
3. Electron завантажить вебінтерфейс із каталогу `updates/` через GitHub Pages;
4. у полі «Джерело інтерфейсу» з’явиться значення «Віддалене».

Еквівалентна явна команда локального запуску:

```bash
npm run start:local
```

## Запуск одразу з віддаленої версії

Щоб пропустити локальну версію й відразу відкрити останнє опубліковане оновлення:

```bash
npm run start:remote
```

## Запуск лише в браузері

```bash
npm run start:web
```

Після компіляції відкрийте:

```text
http://localhost:4200
```

У браузері Electron IPC недоступний, тому повний механізм оновлення потрібно перевіряти через `npm start`.

## Створення наступного оновлення

Для прикладу, щоб підготувати версію `1.2.0`, виконайте:

```bash
node scripts/prepare-demo-update.js 1.2.0
```

Скрипт автоматично:

1. тимчасово встановить переданий номер вебверсії;
2. створить оптимізовану production-збірку;
3. запише її безпосередньо в `updates/`;
4. додасть `.nojekyll` для GitHub Pages;
5. поверне вихідному коду початковий номер версії.

Після створення оновлення перевірте маніфест:

```bash
cat updates/version.json
```

Потім опублікуйте зміни:

```bash
git add updates
git commit -m "Підготовлено вебоновлення 1.2.0"
git push
```

Push зі змінами в `updates/` автоматично запускає workflow GitHub Pages. Після завершення workflow запущений Electron-застосунок побачить нову версію.

## Конфігурація адрес

Адреси зберігаються в `electron-env.json`:

```json
{
  "environment": "local",
  "remoteUrl": "https://oliynykroman.github.io/electron-auto-update/",
  "manifestUrl": "https://oliynykroman.github.io/electron-auto-update/version.json"
}
```

- `remoteUrl` — адреса опублікованого Angular-інтерфейсу;
- `manifestUrl` — адреса `version.json`;
- `environment` — початковий режим завантаження.

`npm start` автоматично встановлює `local`, а `npm run start:remote` — `production`.

## Запуск тестів

```bash
node --test test/*.test.js
```

## Типові проблеми

### Не вдалося з’єднатися із сервером оновлень

Перевірте, що GitHub Pages увімкнено, workflow успішно завершився, а ця адреса відкривається в браузері:

```text
https://oliynykroman.github.io/electron-auto-update/version.json
```

### GitHub Pages повертає 404

У `Settings` → `Pages` установіть джерело `GitHub Actions`, після чого вручну запустіть workflow «Публікація демо-оновлення» у вкладці `Actions`.

### Порт 4200 зайнятий

```bash
npm run start:web -- --port 4300
```

## Межі механізму

Механізм оновлює лише Angular-вебінтерфейс. Зміни в `electron/main.js`, `electron/preload.js` або нативних залежностях потребують випуску нової Electron-оболонки.
