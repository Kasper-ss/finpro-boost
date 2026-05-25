# FinPro Boost

Telegram Mini App для управления финансами, продуктивностью и инвестициями.

## Стек

- React 18 + TypeScript + Vite
- Tailwind CSS + Headless UI + Lucide Icons
- Zustand + persist (localStorage)
- @twa-dev/sdk, Recharts, React Hook Form + Zod, Framer Motion, date-fns

## Быстрый старт

```bash
cd "/Users/alexfox/TG APP"
npm install
npm run dev
```

Dev-сервер: `http://localhost:5173` (с `--host` для доступа с телефона в локальной сети).

## Подключение к Telegram (BotFather)

### 1. Создайте бота

1. Откройте [@BotFather](https://t.me/BotFather)
2. `/newbot` → имя и username бота
3. Сохраните **токен** бота

### 2. Создайте Mini App

```
/newapp
```

Выберите бота → укажите название **FinPro Boost** → загрузите иконку (опционально) → укажите **Web App URL**.

### 3. URL для разработки (HTTPS обязателен)

Telegram открывает Mini App только по **HTTPS**. Варианты:

**A. ngrok (рекомендуется для локальной разработки)**

```bash
npm run dev
# в другом терминале:
ngrok http 5173
```

Скопируйте `https://xxxx.ngrok-free.app` в BotFather → Mini App URL.

**B. Cloudflare Tunnel**

```bash
cloudflared tunnel --url http://localhost:5173
```

**C. Продакшен**

```bash
npm run build
npm run preview
# или деплой dist/ на Vercel / Netlify / GitHub Pages
```

### 4. Настройка Menu Button

В BotFather:

```
/mybots → ваш бот → Bot Settings → Menu Button → Configure menu button
```

Укажите тот же HTTPS URL Mini App.

### 5. Тест в Telegram

- Откройте бота → кнопка меню / «Открыть приложение»
- Либо прямая ссылка: `https://t.me/<bot_username>/<app_short_name>`

## Оффлайн

После первой загрузки данные хранятся в `localStorage` (`finpro-boost-storage`). Приложение работает без сети с сохранёнными данными.

## Сброс onboarding / данных

В консоли браузера или DevTools Telegram WebView:

```js
localStorage.removeItem('finpro-boost-storage')
location.reload()
```

## Структура

```
src/
├── app/store.ts
├── features/ (auth, transactions, ai-advisor, profile, …)
├── components/ui, layout, common
├── lib/mockData.ts, telegram.ts, utils.ts
├── pages/
├── hooks/
└── types/
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с доступом по сети |
| `npm run build` | Production-сборка |
| `npm run preview` | Превью сборки |
