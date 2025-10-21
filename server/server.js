import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoosedb from './config/mongo.js'
import { Webhook } from './contollers/webhooks.js'


//express initiallize 

const app = express()

//db connection

await mongoosedb();

// initializie middle ware

app.use(cors())

//api making

app.get('/', (req, res) => { res.send("Working hai bhai") })
app.post('/clerk', express.json(), Webhook)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is runnning ${PORT}`)
})