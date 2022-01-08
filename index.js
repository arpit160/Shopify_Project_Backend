const express= require("express");
const mongoose=require('mongoose');
const path=require('path');
const app=express();
const bodyParser = require('body-parser');
const { connectDb } = require("./connectDb");
const {Item}=require('./models/item')
const fs = require('fs');
const moment = require('moment');
const mdq = require('mongo-date-query');
const json2csv = require('json2csv').parse;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

connectDb();
var msg="home";

app.get('/',(req,res)=>
{
    res.render('home')
})

app.get('/addItem',(req,res)=>
{
     res.render("addItem.ejs")
})

app.post('/addItem',async(req,res)=>
{
    item=new Item(req.body);
    await item.save();
    res.redirect('/viewAll')
})

app.get('/viewAll',async(req,res)=>
{
 items=await Item.find({});
 res.render('viewAll',{items})
})

app.get('/viewSingle/:itemCode',async(req,res)=>
{
    item=await Item.findOne({"itemCode":req.params.itemCode})
    res.render('viewSingle.ejs',{item})
})

app.get('/deleteItem/:itemCode',async(req,res)=>
{
    await Item.deleteOne({"itemCode":req.params.itemCode})
    res.redirect('/viewAll')
})

app.get('/editItem/:itemCode',async(req,res)=>
{
    item=await Item.findOne({"itemCode":req.params.itemCode})

    res.render('editItem',{item})
})

app.post('/editItem/:itemCode',async(req,res)=>
{
    await Item.deleteOne({"itemCode":req.params.itemCode})
    item=new Item(req.body);
    await item.save();

    res.redirect('/viewAll')
})

app.get('/csv',async(req,res)=>
{
    var items=await Item.find({});
    console.log(items)
    for(let i=0;i<items.length;i++)
    {
        console.log(items[i]);
    }
    var fields=["inventoryId"  , "category"  , "itemCode"  , "itemName" , "unitPrice" , "presentQuantity" , "idealQuantity" , "datePurchased"]
    csv = json2csv(items, { fields });
    const dateTime = moment().format('YYYYMMDDhhmmss');
    const filePath = path.join(__dirname,"public", dateTime + ".csv")
    fs.writeFile(filePath,csv,(err)=>
    {
        if(err)console.log(err);
    });
    setTimeout(() => {
        res.download(filePath)
    }, 3000);
     
   // res.redirect('/')
})

app.listen(3000,()=>
{
    console.log("Listening on port 3000");
})