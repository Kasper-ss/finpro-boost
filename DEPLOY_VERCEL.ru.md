# Как выложить FinPro Boost на Vercel (для новичков)

Vercel — бесплатный хостинг для сайтов. После деплоя вы получите ссылку вида  
`https://finpro-boost-xxxx.vercel.app` — её можно открыть в браузере и указать в BotFather для Telegram.

---

## Что понадобится

1. Аккаунт **GitHub** — [github.com/signup](https://github.com/signup)
2. Аккаунт **Vercel** — [vercel.com/signup](https://vercel.com/signup) (удобно войти через GitHub)
3. Проект на компьютере в папке `TG APP`

---

## Способ 1: Через сайт Vercel (рекомендуется)

### Шаг 1. Загрузите код на GitHub

**1.1.** Откройте [github.com/new](https://github.com/new)

- Repository name: `finpro-boost`
- Public
- **Не** ставьте галочки README / .gitignore (проект уже есть локально)
- Create repository

**1.2.** В терминале на Mac:

```bash
cd "/Users/alexfox/TG APP"

git init
git add .
git commit -m "FinPro Boost: initial release"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/finpro-boost.git
git push -u origin main
```

Замените `ВАШ_ЛОГИН` на свой логин GitHub. При `git push` браузер или терминал попросит войти в GitHub.

---

### Шаг 2. Подключите репозиторий к Vercel

**2.1.** Зайдите на [vercel.com](https://vercel.com) → **Add New…** → **Project**

**2.2.** **Import** репозиторий `finpro-boost` (если не видно — **Adjust GitHub App Permissions** и дайте доступ к репозиторию).

**2.3.** Настройки сборки (обычно подставляются сами):

| Поле | Значение |
|------|----------|
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

**2.4.** Нажмите **Deploy** и подождите 1–3 минуты.

---

### Шаг 3. Получите публичную ссылку

После зелёной галочки **Congratulations**:

- Вверху будет **Visit** — это ваш сайт
- Адрес вида: `https://finpro-boost.vercel.app` или `https://finpro-boost-xxx.vercel.app`

Скопируйте URL — это **публичная ссылка** для браузера и для Telegram Mini App.

---

### Шаг 4. (Опционально) Telegram BotFather

1. [@BotFather](https://t.me/BotFather) → `/myapps` или `/newapp`
2. Выберите бота → **Edit Web App URL**
3. Вставьте HTTPS-ссылку с Vercel (без слэша в конце или с `/` — оба варианта обычно работают)

---

## Способ 2: Через терминал (Vercel CLI)

Если уже установлен Node.js и npm:

```bash
cd "/Users/alexfox/TG APP"
npm install
npx vercel login
npx vercel --prod
```

CLI спросит имя проекта и создаст URL. `login` откроет браузер для входа в Vercel.

---

## Обновление сайта после изменений

Если использовали GitHub (способ 1):

```bash
cd "/Users/alexfox/TG APP"
git add .
git commit -m "Описание изменений"
git push
```

Vercel **сам** пересоберёт сайт за 1–2 минуты.

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| Белый экран | Проверьте в Vercel → Deployments → **Building** без ошибок; локально: `npm run build` |
| 404 на подстраницах | В проекте есть `vercel.json` с rewrite на `index.html` |
| Telegram не открывает | URL должен быть **https://** и доступен в браузере с телефона |
| `npm: command not found` | Установите Node.js с [nodejs.org](https://nodejs.org) |

---

## Проверка сборки у себя (до деплоя)

```bash
cd "/Users/alexfox/TG APP"
npm install
npm run build
npm run preview
```

Откройте адрес из терминала (обычно `http://localhost:4173`).
