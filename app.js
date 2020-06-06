const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const url = 'mongodb://localhost:27017/myshop';
mongoose.connect(url,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  app.use('/public',express.static(path.join(__dirname,'public')));
  app.set('view-engine','ejs');
  app.get('/',(req,res)=>{
     res.sendFile(path.join(__dirname,'public','index.html'));
  });

//permissions 
app.use((req,res,next)=>{
    req.header("Access-Control-Allow-Origin",'*')
    req.header("Access-Control-Allow-Origin","Origin,Content-Type,Accept,Authentication");//header will contain all this.
     if(req.method === 'OPTIONS'){
         req.header('Access-Control-Allow-Origin','PUT,POST,PATCH,DELETE,GET');
         return res.status(200).json({});
     }
     next();
});
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
//err handling middleware
app.use((req,res,next)=>{
    const error = new Error("not found");
    res.status(400);
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
        message: error.message,
        }
    })
})

module.exports = app;