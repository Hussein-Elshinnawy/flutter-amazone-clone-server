const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const dbPass=process.env.dbPass;
const dbUsername=process.env.dbUsername;
const DB = `mongodb+srv://${dbUsername}:${dbPass}@cluster0.wesy67v.mongodb.net/?retryWrites=true&w=majority`;


const authRouter= require("./routes/auth.js");// this to import ath auth.js to use it

const adminRouter = require('./routes/admin.js');
const productRouter= require("./routes/product.js");
const userRouter= require("./routes/user.js");


const PORT = 3001;
const app= express();
// middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

// to connect to data base and since it's future promise we use then() works like await
mongoose.connect(DB).then(()=>{
    console.log('connection successful');
}).catch((e)=>{
    console.log(e);
});


app.listen(PORT, "0.0.0.0", ()=>{
    console.log('connected at port '+ PORT);
});

