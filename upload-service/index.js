import express from 'express'
import cors from 'cors'
import uploadRoute from './routes/upload.route.js'
import kafkaPublishRouter from './routes/kafka.publisher.route.js'

const app=express()
app.use(cors(
    {allowedHeaders:["*"],
     origin:"*"}))
app.use(express.json())
app.use('/upload',uploadRoute)
app.use('/publish',kafkaPublishRouter)
app.listen(3030,()=>{console.log("Server running on port 3030")})