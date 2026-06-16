import { Bot } from "grammy";
import dotenv from "dotenv"

dotenv.config() 

const bot = new Bot(process.env.BOT_TOKEN)

const command = {

}

if (!process.env.BOT_TOKEN) {
    console.log("ERROR BOT_TOKEN IS EMPTY")
    process.exit(1)
}

bot.command("start", async (ctx)=> {
   await ctx.reply("Привет")
})


bot.start()