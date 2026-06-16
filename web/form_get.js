import dotenv from "dotenv"
import mariadb from "mariadb"
import pool from '../db/db'
import express from 'express'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

if (!pool) {
    console.log("ERROR NOT INIT DB")
    process.exit(1)
}
app.post("/feedback", async (req,res) => {
    const { name , category  , message ,contact } = req.body;
    if (!message) return res.status(400).json({error: "message required"})
    await forwardToAdmin ({
        source: "Веб-Форма",
        name: name || "-",
        category: category || "-",
        message,
        from: contact || "аноним"
    })
    res.json({ok:true})
})

app.listen(port, () => console.log(port))

