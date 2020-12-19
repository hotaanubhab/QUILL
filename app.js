const express = require('express');
const morgan  = require('morgan');
const mongoose = require('mongoose');
var favicon = require('serve-favicon');
const Booking = require(__dirname+'/models/booking');


const app = express();

const port = process.env.PORT || 3000;

const dbURI = "***REMOVED***"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {app.listen(port, () => {
    console.log(`Our app is running on port ${ port }`);
});})
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

app.get('/admin/:id&:s',(req,res)=>{
    const id = req.params.id;
    const s = req.params.s;
    Booking.updateOne({_id:id},{status:s})
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
    booking.save()
        .then(result=>{
            res.redirect('/Home');
        })
        .catch(err=>{
            console.log(err);
        })
})

app.delete('/admin/:id',(req,res)=>{
    console.log("delete");
    const id = req.params.id;
    Booking.findByIdAndDelete(id)
    .then(result => {
        res.json({ redirect: '/admin' });
    })
    .catch(err => {
        console.log(err);
    });
})

app.use((req,res)=>
{
    res.status(404).render('404');
})