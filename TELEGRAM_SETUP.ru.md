# FinPro Boost — запуск в Telegram за 5 минут

## Шаг 1. Установка зависимостей

На вашем Mac в терминале (нужен Node.js 18+ и npm):

```bash
cd "/Users/alexfox/TG APP"
npm install
npm run dev
```

## Шаг 2. HTTPS-туннель

Telegram **не откроет** `http://localhost` — нужен HTTPS.

```bash
# Установите ngrok: https://ngrok.com/download
ngrok http 5173
```

Скопируйте адрес вида `https://abc123.ngrok-free.app`.

## Шаг 3. BotFather

1. `/newbot` — создайте бота (если ещё нет)
2. `/newapp` — выберите бота, название **FinPro Boost**
3. В поле **Web App URL** вставьте HTTPS из ngrok
4. `/mybots` → Bot Settings → **Menu Button** → тот же URL

## Шаг 4. Открытие

Откройте бота в Telegram → кнопка меню внизу → Mini App.

## Продакшен

```bash
npm run build
```

Загрузите папку `dist/` на хостинг (Vercel, Netlify, Cloudflare Pages) и укажите постоянный HTTPS URL в BotFather.

## Демо без Telegram

Откройте `http://localhost:5173` в браузере — приложение работает с демо-пользователем «Алексей Фокс».
