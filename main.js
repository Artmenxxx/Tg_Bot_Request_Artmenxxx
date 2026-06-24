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
    .text(t[lang].bug, "cat:bug");
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

if (!process.env.BOT_TOKEN) {
    console.log("ERROR BOT_TOKEN IS EMPTY")
    process.exit(1)
}
// if (!process.env.ID_ADMIN) {
//     console.log("ERROR EMPTY ADMIN_ID")
//     process.exit(1)
// }
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
  const lang = ctx.match[1];
  ctx.session.lang = lang;

  await ctx.editMessageText(
    t[lang].chooseCat,
    { reply_markup: getKb(lang) }
  );

  await ctx.answerCallbackQuery();
});
bot.start()