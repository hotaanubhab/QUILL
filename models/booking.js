const mongoose = require('mongoose');
const mongoose_em = require('mongoose-type-email');


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

const Booking = mongoose.model('Booking',bookSchema);
module.exports = Booking;