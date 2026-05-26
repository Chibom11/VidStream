import express from 'express'
import cors from 'cors'
import uploadRoute from './routes/upload.route.js'

const app=express()
app.use(cors(
    {allowedHeaders:["*"],
     origin:"*"}))
app.use(express.json())
app.use('/api',uploadRoute)
app.use('/',(req,res)=>{res.send("Hello from upload server")})
app.listen(3030,()=>{console.log("Server running on port 3030")})