require('dotenv').config()
const express=require('express')
const cors=require('cors')
const router=require('./Routes/router')
require('./DB/connection')

const tkServer=express()

tkServer.use(cors({
    origin: 'https://ticket-book-ajith.vercel.app', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
tkServer.use(express.json())
tkServer.use(router)
tkServer.use('/uploads',express.static('./uploads'))
const PORT=4000 || process.env.PORT
tkServer.listen(PORT,()=>{console.log(`server started at ${PORT}  and waiting for client request !!!!` );})
  
tkServer.get('/',(req,res)=>{
    res.send(`<h1>SERVER STARTED</h1>`)
})