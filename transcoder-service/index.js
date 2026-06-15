import express from 'express'
import cors from 'cors'
import KafkaConfig from './kafka/kafka.js'

const app=express()
const kafkaConfig=new KafkaConfig()
kafkaConfig.consume('transcode',(value)=>{console.log(value)})
app.use(cors(
    {allowedHeaders:["*"],
     origin:"*"}))
app.use(express.json())


app.listen(3032,()=>{console.log("Server running on port 3032")})