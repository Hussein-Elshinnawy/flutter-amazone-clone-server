const express = require("express");
const productRouter = express.Router();
const auth = require("../middlewares/auth");
const { Product } = require("../models/product");


//get category's product
productRouter.get("/api/products", auth, async(req, res)=>{
    try{
  
      const products= await Product.find({category: req.query.category});
      res.json(products);
  
    }
    catch(e){
      res.status(500).json({error:e.message});
    }
  })

  productRouter.get("/api/products/search/:name", auth, async(req, res)=>{
    try{
  
      const products= await Product.find({
        name: {$regex: req.params.name, $options:'i'},// seacrh pattern to get the products that start with charater to enter
      });
      res.json(products);
  
    }
    catch(e){
      res.status(500).json({error:e.message});
    }
  })
  productRouter.post("/api/products/rate:productId", auth, async(req, res)=>{
    try{
      const {id, rating} = req.body;
      let products= await Product.findById(id);
      for(let i=0; i<products.rating.length; i++){
        if(products.rating[i].userId==req.userId){
          product.rating.splice(i,1); // this allows us to add or delete any thing in the array if i have the index //it like setting a point to delete and then how much to delete
        }
      }
      res.json(products);
  
    }
    catch(e){
      res.status(500).json({error:e.message});
    }
  })
  
module.exports = productRouter;