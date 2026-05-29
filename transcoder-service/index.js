import express from 'express'
import cors from 'cors'
import KafkaConfig from './kafka/kafka'

const app=express()
app.use(cors(
    {allowedHeaders:["*"],
     origin:"*"}))
app.use(express.json())

const kafkaconfig=new KafkaConfig();

kafkaconfig.consume("transcode",(value)=>{console.log("Got data from kafka",value)})
app.listen(3031,()=>{console.log("Server running on port 3031")})