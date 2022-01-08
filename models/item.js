const mongoose=require('mongoose');

const itemSchema=new mongoose.Schema({
   inventoryId:String,
   category:String,
   itemCode:String,
   itemName:String,
   unitPrice:Number,
   presentQuantity:Number,
   idealQuantity:Number,
   datePurchased:String
})

const Item=mongoose.model('Item',itemSchema)

module.exports={Item};