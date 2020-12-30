const express = require('express');
const morgan  = require('morgan');
const mongoose = require('mongoose');
var favicon = require('serve-favicon');
const Booking = require(__dirname+'/models/booking');
const User = require(__dirname+'/models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


const app = express();

const port = process.env.PORT || 3000;

const dbURI = "***REMOVED***";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {app.listen(port, () => {
    console.log(`Some shit is going down on port ${ port }`);
});})
.catch(err => console.log(err));

app.set('view engine','ejs');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { uname: '', password: '' };
  
    // incorrect uname
    if (err.message === 'incorrect username') {
      errors.uname = 'That username is not registered';
    }
  
    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    // duplicate email error
    if (err.code === 11000) {
      errors.uname = 'that username is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
}

    const createToken = (id) => {
        return jwt.sign({ id }, '***REMOVED***');
      };

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(favicon(__dirname + '/public/content/favicon.ico'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('*', checkUser);

app.get('/',(req,res)=>{
    res.redirect('/Home')
});

app.get('/login',(req,res)=>{
    res.render('login')
});

app.get('/signup',(req,res)=>{
    res.render('signup')
});

app.post('/signup',async (req, res) => {
    const { uname, password } = req.body;
  
    try {
      const user = await User.create({ uname, password });
      res.status(201).json({ user: user._id });
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
  }
)

app.post('/login',async (req,res)=>{
    const { uname, password } = req.body;

  try {
    const user = await User.login(uname, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true});
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

})

app.get('/Home',(req,res)=>{
    res.render('index');
})

app.get('/booking',(req,res)=>{
    res.render('booking');
})

app.get('/err',(req,res)=>{
    res.render('err');
})

app.get('/confirm',(req,res)=>{
    res.render('confirm')
})

app.get('/Admin',requireAuth,(req,res)=>{
    Booking.find().sort({ createdAt: -1})
    .then(result=>{
        res.render('Admin',{booking: result});
    })
    .catch(err=>{
        console.log(err);
    })
    
})



app.get('/admin/:id&:s',requireAuth,(req,res)=>{
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

app.get('/admin/:id',requireAuth,(req,res)=>{
    const id = req.params.id;
    Booking.findOne({_id:id})
    .then(result=>{
        res.render('Details',{booking: result});
    })
    .catch(err=>{
        console.log(err);
    })
})

app.post('/booking',(req,res)=>{
    const booking = new Booking(req.body);
    
    booking.save()
        .then(result=>{
            res.redirect('/confirm');
        })
        .catch(err=>{
            console.log(err);
            res.redirect('/err');
        })
})

app.delete('/admin/:id',requireAuth,(req,res)=>{
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