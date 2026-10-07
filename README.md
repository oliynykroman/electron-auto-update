# Центр оновлення Electron

Самодостатній демонстраційний проєкт механізму оновлення вебінтерфейсу Electron-застосунку. Початкова версія інтерфейсу зберігається в коді застосунку, а нові вебверсії — у каталозі `updates/` цього ж репозиторію.

## Як працює демонстрація

1. `npm start` одразу завантажує актуальний інтерфейс із GitHub Pages і показує «Віддалене».
2. `npm run start:local` відкриває локальну версію `1.0.0` і показує «Локальне».
3. Локальний режим перевіряє `version.json` на GitHub Pages та може перейти на новішу віддалену версію.
4. `npm run start:offline` демонструє той самий перехід через локальний сервер без GitHub.
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

`updates/` є готовим статичним сайтом. Для локальної демонстрації його обслуговує вбудований Node.js-сервер, а для віддаленої — GitHub Pages.

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

## Основний запуск — віддалений інтерфейс

Запустіть:

```bash
npm start
```

Команда автоматично:

1. встановлює режим `production`;
2. запускає Electron;
3. завантажує актуальний інтерфейс безпосередньо з GitHub Pages;
4. показує «Віддалене» у полі «Джерело інтерфейсу».

Еквівалентна команда:

```bash
npm run start:remote
```

Для цього режиму GitHub Pages має бути увімкнений, а workflow публікації — успішно завершений.

## Локальний запуск

Щоб завантажити інтерфейс із локальної Angular-збірки, виконайте:

```bash
npm run start:local
```

У цьому режимі поле «Джерело інтерфейсу» показує «Локальне». Застосунок усе одно може перевірити маніфест GitHub Pages і запропонувати перехід на новішу віддалену версію.

## Автономна демонстрація без GitHub

Якщо інтернет або GitHub Pages недоступні, запустіть:

```bash
npm run start:offline
```

Команда підніме локальний сервер `http://127.0.0.1:4173/` для каталогу `updates/`. Сценарій `1.0.0` → `1.1.0` працюватиме так само, але без звернення до GitHub.

## Увімкнення GitHub Pages для віддаленої демонстрації

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

## Запуск лише в браузері

```bash
npm run start:web
```

Після компіляції відкрийте:

```text
http://localhost:4200
```

У браузері Electron IPC недоступний. Перевіряйте віддалений режим через `npm start`, а перехід із локальної версії на віддалену — через `npm run start:local`.

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

`npm start` і `npm run start:remote` встановлюють `production` та завантажують віддалений інтерфейс. `npm run start:local` використовує локальну збірку, а `npm run start:offline` тимчасово підміняє адреси локальним сервером.

## Запуск тестів

```bash
node --test test/*.test.js
```

## Типові проблеми

### Не вдалося з’єднатися із сервером оновлень

Для `npm start` і `npm run start:remote` перевірте, що GitHub Pages увімкнено, workflow успішно завершився, а ця адреса відкривається в браузері:

```text
https://oliynykroman.github.io/electron-auto-update/version.json
```

Якщо GitHub Pages ще не готовий, використайте `npm run start:offline`.

### GitHub Pages повертає 404

У `Settings` → `Pages` установіть джерело `GitHub Actions`, після чого вручну запустіть workflow «Публікація демо-оновлення» у вкладці `Actions`.

### Перевірка не завершується

Перевірка має автоматично завершитися помилкою через 12 секунд. Якщо індикатор продовжує обертатися, закрийте всі старі Electron-процеси та запустіть актуальний код повторно. Для перевірки без мережі використайте `npm run start:offline`.

### Порт 4200 зайнятий

```bash
npm run start:web -- --port 4300
```

## Межі механізму

Механізм оновлює лише Angular-вебінтерфейс. Зміни в `electron/main.js`, `electron/preload.js` або нативних залежностях потребують випуску нової Electron-оболонки.
