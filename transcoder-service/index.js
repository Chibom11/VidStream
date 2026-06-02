import express from 'express'
import cors from 'cors'
import KafkaConfig from './kafka/kafka.js'

const app=express()
app.use(cors(
    {allowedHeaders:["*"],
     origin:"*"}))
app.use(express.json())

app.listen(3032,()=>{console.log("Server running on port 3032")})