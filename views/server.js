const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const path = require('path')
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const dbConnect = require('./db/db');
const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(cors());

dbConnect();

app.set('view engine', 'ejs');


app.use('/user', userRoutes);

app.listen(PORT,()=>console.log(`server started at ${PORT}`));