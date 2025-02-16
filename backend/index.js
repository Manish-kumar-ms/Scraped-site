

import bodyParser from 'body-parser';
import express from 'express'
import dotenv from 'dotenv'
import Getrouter from './Routes/Getrouter.js'
import cors from 'cors'
import { scrapeEvents } from './test.js';
import { connectDB } from './config/db.js';

import { refresh } from './utils/refresh.js';

dotenv.config()

const app=express();
const PORT =process.env.PORT || 8080

app.use(cors());
app.use(bodyParser.json());

app.get("/",(req,res)=>{
      res.send("welcome to the website")

})


app.use("/api",Getrouter)


scrapeEvents()

app.listen(PORT,(req,res)=>{
     connectDB()
    refresh()
    console.log( `server is running at ${PORT}`)
}) 