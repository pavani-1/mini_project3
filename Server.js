const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const MongoClient=require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb://localhost:27017/Supermarket',(err,database) =>{
    if(err) return console.log(err);
    db=database.db('Supermarket');
    app.listen(4000,()=>{
        console.log("Server is running on port number 4000");
    })
})

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/',(req,res)=>{
    db.collection('products').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('homepage.ejs',{data:result});
    })
})

app.get('/add_data',(req,res)=>{
    db.collection('products').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('add.ejs',{data:result});
    })
})
app.post('/formadd_data',(req,res)=>{
    var k=0;
    db.collection('products').save(req.body,(err,result)=>{
            if(err) return console.log(err);
            res.redirect('/');
    })
})
app.get('/displayhome',(req,res)=>{
    res.redirect('/');
})
app.get('/update_page',(req,res)=>{
    res.render('update.ejs');
})
app.post('/update_data',(req,res)=>{
    var obj=req.body;
    console.log(obj);
    var pr=0;
    Object.keys(obj).forEach(key => {
        if(key=="price" && obj[key]!=""){
            pr=obj[key];
        }
        if(obj[key]===""){
            delete obj[key];
        }
    });
    if(pr!=0){
        db.collection('sales').update({title:obj.title},{$set:{"price": obj.price}});
    }
    db.collection('products').update({title:obj.title},{$set:obj});
    res.redirect('/');
    
})
app.post('/delete_data',(req,res)=>{
    db.collection("products").remove({title:req.body.title},(err,result)=>{
        if(err) console.log(err);
        res.redirect('/');
    });
})

app.get('/sales',(req,res)=>{
    db.collection('sales').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('sales_homepage.ejs',{data:result});
    })
})

app.get('/addsales',(req,res)=>{
    res.render('add_sales.ejs',{});
})

app.post('/formadd_sales',(req,res)=>{
        db.collection('sales').save(req.body,(err,result)=>{
            if(err) return console.log(err);
            res.redirect('/sales');
        })
})

app.get('/updatesales',(req,res)=>{
    res.render('updatesales.ejs');
})

app.post('/update_form_sales',(req,res)=>{
    var obj=req.body;
    console.log(obj);
    var pr=0;
    Object.keys(obj).forEach(key => {
        if(key=="price" && obj[key]!=""){
            pr=obj[key];
        }
        if(obj[key]===""){
            delete obj[key];
        }
    });
    if(pr!=0){
        db.collection('products').update({title:obj.title},{$set:{"price": obj.price}});
    }
    db.collection('sales').update({title:obj.title},{$set:obj});
    res.redirect('/sales');
    
})

app.post('/delete_sales',(req,res)=>{
    db.collection("sales").deleteOne({title:req.body.title,date:req.body.date},(err,result)=>{
        if(err) console.log(err);
        res.redirect('/sales');
    });
})
