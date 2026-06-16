# Feedback Bot

**Бот:** `TG_BOT_REQUEST_ARTMENXXX`

**Язык / Language / Jazyk:** [Русский](#русский) · [English](#english) · [Čeština](#čeština)

---

## Русский

Бот обратной связи с двумя входами: люди пишут через **Telegram** или через **форму на сайте**, а все сообщения сходятся в одну точку и пересылаются владельцу в личку. Интерфейс полностью переведён на три языка: английский, русский и чешский.

### Как это работает

Архитектура строится вокруг одной идеи: и Telegram, и веб-форма вызывают **общую функцию `forwardToOwner`**. Логика «как отправить сообщение мне» написана один раз и не дублируется.

```
Telegram ──▶ grammy (диалог, состояние) ─┐
                                          ├──▶ forwardToOwner() ──▶ личка владельца
Веб-форма ──▶ Express (POST /feedback) ───┘
```

В Telegram пользователь проходит короткий диалог: выбирает язык → выбирает категорию (вопрос / предложение / сообщение об ошибке) → пишет сообщение. Состояние диалога хранится через `session`. Веб-форма шлёт те же данные одним POST-запросом.

### Стек

- **Node.js** (ES-модули)
- **grammy** — Telegram-бот
- **Express** — HTTP-эндпоинт для формы
- **dotenv** — переменные окружения
- **cors** — разрешить запросы с домена сайта

### Структура

```
feedback-bot/
├── index.js          # точка входа: поднимает бота и Express
├── core/
│   └── forward.js    # forwardToOwner — общая логика пересылки
├── bot/
│   └── handlers.js   # команды и колбэки Telegram
├── web/
│   └── server.js     # Express: эндпоинт POST /feedback
├── i18n/
│   └── locales.js    # переводы en / ru / cs
├── .env              # секреты (в .gitignore)
├── .env.example      # шаблон переменных без значений
└── README.md
```

### Переменные окружения

Скопируй `.env.example` в `.env` и заполни:

| Переменная      | Что это                                                        |
|-----------------|----------------------------------------------------------------|
| `BOT_TOKEN`     | Токен бота от @BotFather                                        |
| `OWNER_ID`      | Личный chat_id владельца (числом) — куда пересылать сообщения   |
| `FORM_SECRET`   | Общий секрет: форма шлёт его в заголовке, сервер проверяет      |
| `PORT`          | Порт Express-сервера (по умолчанию 3000)                       |

`OWNER_ID` можно узнать так: написать боту любое сообщение и посмотреть `ctx.from.id` в логах.

### Запуск

```bash
npm install
cp .env.example .env   # затем заполнить .env
node index.js
```

### Деплой

Запускается на Raspberry Pi. Express проксируется через nginx как поддомен
(например `bot.example.com` → `localhost:3000`). Бот работает в long-polling,
отдельный вебхук не нужен.

[↑ Наверх / к выбору языка](#feedback-bot)

---

## English

A feedback bot with two entry points: people write either through **Telegram** or through a **form on the website**, and all messages converge into a single place and get forwarded to the owner's direct messages. The interface is fully translated into three languages: English, Russian and Czech.

### How it works

The architecture is built around one idea: both Telegram and the web form call a **shared `forwardToOwner` function**. The logic of "how to send a message to me" is written once and never duplicated.

```
Telegram ──▶ grammy (dialog, state) ─┐
                                     ├──▶ forwardToOwner() ──▶ owner's DM
Web form ──▶ Express (POST /feedback)┘
```

In Telegram the user goes through a short dialog: pick a language → pick a category (question / suggestion / bug report) → write a message. The dialog state is kept via `session`. The web form sends the same data in a single POST request.

### Stack

- **Node.js** (ES modules)
- **grammy** — Telegram bot
- **Express** — HTTP endpoint for the form
- **dotenv** — environment variables
- **cors** — allow requests from the website's domain

### Structure

```
feedback-bot/
├── index.js          # entry point: starts the bot and Express
├── core/
│   └── forward.js    # forwardToOwner — shared forwarding logic
├── bot/
│   └── handlers.js   # Telegram commands and callbacks
├── web/
│   └── server.js     # Express: POST /feedback endpoint
├── i18n/
│   └── locales.js    # en / ru / cs translations
├── .env              # secrets (in .gitignore)
├── .env.example      # template with no values
└── README.md
```

### Environment variables

Copy `.env.example` to `.env` and fill it in:

| Variable        | What it is                                                     |
|-----------------|----------------------------------------------------------------|
| `BOT_TOKEN`     | Bot token from @BotFather                                       |
| `OWNER_ID`      | Owner's personal chat_id (a number) — where messages are sent  |
| `FORM_SECRET`   | Shared secret: the form sends it in a header, the server checks |
| `PORT`          | Express server port (default 3000)                             |

You can find `OWNER_ID` like this: send any message to the bot and check `ctx.from.id` in the logs.

### Running

```bash
npm install
cp .env.example .env   # then fill in .env
node index.js
```

### Deployment

Runs on a Raspberry Pi. Express is proxied through nginx as a subdomain
(for example `bot.example.com` → `localhost:3000`). The bot uses long polling,
so no separate webhook is needed.

[↑ Top / language switch](#feedback-bot)

---

## Čeština

Bot pro zpětnou vazbu se dvěma vstupy: lidé píší buď přes **Telegram**, nebo přes **formulář na webu**, a všechny zprávy se sbíhají do jednoho místa a přeposílají se majiteli do soukromé zprávy. Rozhraní je plně přeloženo do tří jazyků: angličtiny, ruštiny a češtiny.

### Jak to funguje

Architektura stojí na jedné myšlence: Telegram i webový formulář volají **společnou funkci `forwardToOwner`**. Logika „jak mi poslat zprávu" je napsaná jednou a nikde se neduplikuje.

```
Telegram ──▶ grammy (dialog, stav) ─┐
                                    ├──▶ forwardToOwner() ──▶ soukromá zpráva majiteli
Formulář ──▶ Express (POST /feedback)┘
```

V Telegramu projde uživatel krátkým dialogem: vybere jazyk → vybere kategorii (dotaz / návrh / nahlášení chyby) → napíše zprávu. Stav dialogu se ukládá přes `session`. Webový formulář posílá stejná data jedním POST požadavkem.

### Technologie

- **Node.js** (ES moduly)
- **grammy** — Telegram bot
- **Express** — HTTP endpoint pro formulář
- **dotenv** — proměnné prostředí
- **cors** — povolení požadavků z domény webu

### Struktura

```
feedback-bot/
├── index.js          # vstupní bod: spouští bota a Express
├── core/
│   └── forward.js    # forwardToOwner — společná logika přeposílání
├── bot/
│   └── handlers.js   # příkazy a callbacky Telegramu
├── web/
│   └── server.js     # Express: endpoint POST /feedback
├── i18n/
│   └── locales.js    # překlady en / ru / cs
├── .env              # tajné údaje (v .gitignore)
├── .env.example      # šablona bez hodnot
└── README.md
```

### Proměnné prostředí

Zkopíruj `.env.example` do `.env` a vyplň:

| Proměnná        | Co to je                                                       |
|-----------------|----------------------------------------------------------------|
| `BOT_TOKEN`     | Token bota od @BotFather                                       |
| `OWNER_ID`      | Osobní chat_id majitele (číslo) — kam se zprávy přeposílají     |
| `FORM_SECRET`   | Sdílené tajemství: formulář ho posílá v hlavičce, server ověří |
| `PORT`          | Port Express serveru (výchozí 3000)                            |

`OWNER_ID` zjistíš takto: pošli botovi libovolnou zprávu a podívej se na `ctx.from.id` v logu.

### Spuštění

```bash
npm install
cp .env.example .env   # poté vyplň .env
node index.js
```

### Nasazení

Běží na Raspberry Pi. Express je proxován přes nginx jako subdoména
(například `bot.example.com` → `localhost:3000`). Bot používá long polling,
takže samostatný webhook není potřeba.

[↑ Nahoru / přepnout jazyk](#feedback-bot)