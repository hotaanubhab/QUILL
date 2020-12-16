const express = require('express');
const morgan  = require('morgan');
const mongoose = require('mongoose');
var favicon = require('serve-favicon');
const Booking = require(__dirname+'/models/booking');


const app = express();

const dbURI = "***REMOVED***"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

app.set('view engine','ejs');



app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(favicon(__dirname + '/public/content/favicon.ico'));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/',(req,res)=>{
    res.redirect('/Home')
});

app.get('/Home',(req,res)=>{
    res.render('index');
})

app.get('/booking',(req,res)=>{
    res.render('booking');
})

app.get('/Admin',(req,res)=>{
    Booking.find().sort({ createdAt: -1})
    .then(result=>{
        res.render('Admin',{booking: result});
    })
    .catch(err=>{
        console.log(err);
    })
    
})

app.get('/admin/:id',(req,res)=>{
    const id = req.params.id;
    Booking.updateOne({_id:id},{status:1})
    .then(result=>{
        res.redirect('/Admin')
    })
    .catch(err=>{
        console.log(err);
    });
})

app.post('/booking',(req,res)=>{
    const booking = new Booking(req.body);
    console.log(booking.check_in);
    console.log(booking.check_out);
    booking.status = 0;
    booking.save()
        .then(result=>{
            res.redirect('/Home');
        })
        .catch(err=>{
            console.log(err);
        })
})

app.use((req,res)=>
{
    res.status(404).render('404');
})