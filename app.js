const express = require('express');
const morgan  = require('morgan');
const mongoose = require('mongoose');
var favicon = require('serve-favicon');


const app = express();

app.set('view engine','ejs');

app.listen(3000);

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

app.use((req,res)=>
{
    res.status(404).render('404');
})