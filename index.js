const express = require('express');
const db =require('./src/util/db');
const application= require('./src/app');
const cors = require('cors');


const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials:true
}));

app.use(application);

app.get("/",(req,res)=>{
      res.send("Backend working");
})


app.listen(3000,()=>{
    console.log("server is running on port 3000");
});