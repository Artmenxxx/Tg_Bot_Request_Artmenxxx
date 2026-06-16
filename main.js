import { Bot, InlineKeyboard, session } from "grammy";
import dotenv from "dotenv"

dotenv.config() 

const ID_ADMIN = process.env.ID_ADMIN
const bot = new Bot(process.env.BOT_TOKEN)

const keyboard = new InlineKeyboard()
        .text("English", "lang:en")
        .text("Русский", "lang:ru")
        .text("Čeština", "lang:cs")

const kb = new InlineKeyboard()
        .text(t[lang].question, "cat:question").row()
        .text(t[lang].suggestion, "cat:suggestion").row()
        .text(t[lang].bug, "cat:bug");

const command = {

}

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

bot.callbackQuery(/^lang:(.+)$/, async (ctx) => {
    const lang = ctx.match[1];
    ctx.session.lang = lang;
  
    await ctx.editMessageText(t[lang].chooseCat, { reply_markup: kb });
    await ctx.answerCallbackQuery();
});
bot.start()