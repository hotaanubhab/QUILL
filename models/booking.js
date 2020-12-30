const mongoose = require('mongoose');
const mongoose_em = require('mongoose-type-email');
const nodemailer = require('nodemailer');


const Schema = mongoose.Schema;



const bookSchema = new Schema({
    first_name:
    {
        type: String,
        required: true,
    },
    last_name:
    {
        type: String,
        required : true,
    },
    adults:
    {
        type: Number,
        required: true,
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
    },
    phone: {
        type: String,
        required: true,    
    },
    check_in: {
        type: Date,
        required: true,
    },
    check_out: {
        type: Date,
        required: true,
    },
    status:
    {
        type: Boolean,
        default: false,
    }
},{timestamps: true});

bookSchema.post('save', async function(next) {
                
                var m = this.check_in;
                var n = this.check_out;
                var checkin_String = m.getFullYear() +"/"+ (m.getMonth()+1) +"/"+ m.getDate();
                var checkout_String = n.getFullYear() +"/"+ (n.getMonth()+1) +"/"+ n.getDate() 

        var transporter = nodemailer.createTransport({
         
            host: "***REMOVED***",  
            secure: true,
            secureConnection: false, // TLS requires secureConnection to be false
            tls: {
                ciphers:'SSLv3'
            },
            requireTLS:true,
            port: 465,
            debug: true,
            auth: {
                user: "***REMOVED***",
                pass: "***REMOVED***" 
            }
         
         });
       
       var mailOptions = {
         from: '***REMOVED***',
         to: '***REMOVED***',
         subject: "New Booking",
         text: "New booking recieved , check Admin page.\n\n"
         +"Booking ID: "+this._id
         +"\nName : "+this.first_name+" "+this.last_name
         +"\nPhone : "+this.phone
         +"\nEmail : "+this.email
         +"\nAdults : "+this.adults
         +"\nCheckin : "+checkin_String
         +"\nCheckout : "+checkout_String
       };
       
       transporter.sendMail(mailOptions).then(() => {
        console.log('Email sent successfully');
    }).catch((err) => {
        console.log('Failed to send email');
        console.error(err);
    });
       
  });

const Booking = mongoose.model('Booking',bookSchema);
module.exports = Booking;