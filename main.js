import db from "./db/db.js";
import "./db/init_db.js"
import { Bot, InlineKeyboard, session } from "grammy";
import dotenv from "dotenv"
import t from './i18n/locales.js'

dotenv.config() 

const ID_ADMIN = process.env.ID_ADMIN
const bot = new Bot(process.env.BOT_TOKEN)

const keyboard = new InlineKeyboard()
        .text("English", "lang:en")
        .text("Русский", "lang:ru")
        .text("Čeština", "lang:cs")

function getKb(lang) {
  return new InlineKeyboard()
    .text(t[lang].question, "cat:question").row()
    .text(t[lang].suggestion, "cat:suggestion").row()
    .text(t[lang].bug, "cat:bug").row()
    .text(t[lang].projects, "cat:projects")
}
const links = {
    'git' : 'https://github.com/Artmenxxx',
    'web' : 'https://artmenxxx.github.io/Portfolio_site-Bio-Link/',
}
await bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show help text" },
  { command: "projects", description: "Show my projects" },
]);
const projectKb = new InlineKeyboard()
    .url("GitHub", links.git)
    .row()
    .url("Website", links.web)

if (!process.env.BOT_TOKEN) {
    console.log("ERROR BOT_TOKEN IS EMPTY")
    process.exit(1)
}
if (!process.env.ID_ADMIN) {
    console.log("ERROR EMPTY ADMIN_ID")
     process.exit(1)
}
bot.use(session({
    initial: () => ({ lang: null, category: null, step:"idle"}),
}))


bot.command("start", async (ctx)=> {
    ctx.session = {lang: null , category: null , step:"idle"}
    await ctx.reply("Choose language / Выбери язык / Vyber jazyk:", { reply_markup: keyboard });
})
bot.command("projects", async(ctx) => {
    ctx.reply(`
    My Git: ${links.git} \nMy Web: ${links.web}`)
})

bot.callbackQuery(/^lang:(.+)$/, async (ctx) => {
  const lang = ctx.match[1]
  ctx.session.lang = lang

  await ctx.editMessageText(
    t[lang].chooseCat,
    { reply_markup: getKb(lang) }
  );

  await ctx.answerCallbackQuery()
});
bot.callbackQuery(/^cat:(question|suggestion|bug)$/, async (ctx) => {
    const category = ctx.match[1]
    const lang = ctx.session.lang

    ctx.session.category = category;
    ctx.session.step = "email"

    await ctx.reply(t[lang][`${category}Info`])
    await ctx.answerCallbackQuery()
})
bot.on("message:text", async (ctx) => {

    if (ctx.session.step === "email") {

        ctx.session.email = ctx.message.text
        ctx.session.step = "message"

        await ctx.reply(t[ctx.session.lang].write);

        return;
    }

    if (ctx.session.step === "message") {

        const text = ctx.message.text;
        const lang = ctx.session.lang

        db.prepare(`
        INSERT INTO messages (category, email, message, telegram_id, username) VALUES (?, ?, ?, ?, ?)`).run(
        ctx.session.category,
        ctx.session.email,
        text,
        ctx.from.id,
        ctx.from.username || null
    )
        await bot.api.sendMessage(ID_ADMIN,`Category: ${ctx.session.category} Email: ${ctx.session.email} Message: ${text}`)


        await ctx.reply(t[lang].thanks)

        ctx.session.step = "idle";
        ctx.session.category = null;
        ctx.session.email = null;
    }
});
bot.callbackQuery("cat:projects", async (ctx) => {
    const lang = ctx.session.lang

    await ctx.reply(
        t[lang].projects,
        {
            reply_markup: projectKb
        }
    )

    await ctx.answerCallbackQuery()
})
bot.command("info", async (ctx) => {
    if (ctx.from.id !== Number(process.env.ID_ADMIN)) {
        return ctx.reply("Нет доступа")
    }

    const rows = db.prepare(`
        SELECT * FROM messages
        ORDER BY id DESC
        LIMIT 10
    `).all()

    if (!rows.length) {
        return ctx.reply("База пуста")
    }

    let text = "Последние записи:\n\n"

    for (const row of rows) {
        text += `
ID: ${row.id}
Категория: ${row.category}
Email: ${row.email}
Сообщение: ${row.message}
User: ${row.username || "unknown"}
-------------------
`
    }

    await ctx.reply(text)
})
bot.catch((err) => {
    console.error(err)
})
bot.start()