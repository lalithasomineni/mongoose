const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product')

router.get("/", (req, res, next) => {
    Order.find()
      .exec()
      .then(docs => {
        const result = {
          count: docs.length,
         orders: docs.map(doc => {
            return {
              quantity: doc.quantity,
              product: doc.product,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + doc._id
              }
            };
          })
        };
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.get('/:orderId',(req,res,next)=>{
    const _id = req.body.orderId;
    Order.find({id:_id},(err,result)=>{
        if(err){
            res.status(500).json({message:'request failed',error: err})
        }
        else{
            res.status(500).json({message:'requested order',result,response:{
                type:'GET',
                url:'http://localhost:3000/orders/:orderId'
            }})
        }
    })
})
router.post('/',(req,res,next)=> {
    const valid = Product.findById(req.body.productId);
    if(valid){
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order
    .save().then(result=>{
        res.status(200).json({message: "order created",result,response:{
            type: 'GET',
            url:'http://localhost:3000/orders' + result._id
        }});
    }).catch(err=>{
        res.status(500).json({error: err});
    })}
    else{
          res.json({message: "error occured"});
    }
});
router.delete('/:orderId',(req,res,next)=>{
      const _id = req.body.orderId;
      Order.remove({id:_id},(err,result)=>{
          if(err){

            res.status(500).json({error: err,message: "try again"});

          }
          else{
                 res.status(200).json({message: "order deleted",response:{
                     type:'POST',
                     url:'http://localhost:3000/orders',
                     data: {quantity: "Number",productId: "id"},
                 }})
          }
      })
});

module.exports = router;