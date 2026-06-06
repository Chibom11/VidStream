import express from 'express'
import cors from 'cors'
import watchRouter from './controllers/watch.controllers.js'
import fetchAllVidsRouter from './routes/fetchAllVids.routes.js'
const app=express()
app.use(cors(
    {allowedHeaders:["*"],
     origin:"*"}))
app.use(express.json())
app.use('/watch',watchRouter)
app.use('/fetchAll',fetchAllVidsRouter)
app.listen(3032,()=>{console.log("Server running on port 3032")})