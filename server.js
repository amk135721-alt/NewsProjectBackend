import express from "express"
import { connectdb } from "./config/database.js";
import projectrouter from "./router/projectrouter.js"
import adminrouter from "./router/adminrouter.js"
import userrouter from "./router/userrouter.js"
import highlightrouter from "./router/highlightrouter.js"
import cors from 'cors'
import { redisConnect } from "./config/redis.js";
import commentrouter from "./router/commentrouter.js"
const app = express()
app.use(express.json())
const PORT = 5001;
connectdb()
redisConnect()
app.use(cors())
app.use("/uploads", express.static("uploads"))
app.use("/highlightimage", express.static("highlightimage"))

app.use("/api", projectrouter)
app.use("/api",adminrouter)
app.use("/api",userrouter)
app.use("/api",highlightrouter)
app.use("/api",commentrouter)
app.listen(PORT, () => {
    console.log("server is running PORT ", PORT)
})