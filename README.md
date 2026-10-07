# Центр оновлення Electron

Самодостатній демонстраційний проєкт механізму оновлення вебінтерфейсу Electron-застосунку. Початкова версія інтерфейсу зберігається в коді застосунку, а нові вебверсії — у каталозі `updates/` цього ж репозиторію.

## Як працює демонстрація

1. Electron запускає локальну версію `1.0.0`.
2. `npm start` перевіряє `version.json`, опублікований через GitHub Pages.
3. Для автономного режиму `npm run start:offline` читає той самий `updates/version.json` через локальний сервер.
4. Якщо в `updates/version.json` вказана новіша версія, інтерфейс показує кнопку «Застосувати оновлення».
5. Після натискання Electron очищає кеш і завантажує новий інтерфейс із `updates/`.
6. Electron-оболонку перевстановлювати не потрібно.

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

## Основна демонстрація через GitHub Pages

Запустіть:

```bash
npm start
```

Команда автоматично:

1. збирає локальний інтерфейс версії `1.0.0`;
2. встановлює початковий режим `local`;
3. запускає Electron;
4. перевіряє `version.json` на GitHub Pages;
5. знаходить опубліковану версію `1.1.0`.

У вікні Electron:

1. дочекайтеся повідомлення про доступну версію `1.1.0`;
2. натисніть «Застосувати оновлення»;
3. Electron завантажить вебінтерфейс із GitHub Pages;
4. у полі «Джерело інтерфейсу» значення «Локальне» зміниться на «Віддалене».

До застосування оновлення значення «Локальне» є правильним: воно описує джерело поточного інтерфейсу `1.0.0`. Маніфест оновлення в цей момент уже перевіряється через GitHub Pages.

Еквівалентна команда:

```bash
npm run start:github
```

Для цього режиму GitHub Pages має бути увімкнений, а workflow публікації — успішно завершений.

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

## Запуск одразу з віддаленої версії

Після налаштування GitHub Pages можна пропустити локальну версію й відразу відкрити останнє опубліковане оновлення:

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

`npm start` автоматично встановлює `local`, але використовує GitHub Pages як сервер оновлень. `npm run start:offline` тимчасово підміняє адреси локальним сервером, а `npm run start:remote` установлює `production`.

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
