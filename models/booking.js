const mongoose = require('mongoose');
const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');
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
        type: mongooseIntlPhoneNumber// can be omitted to keep raw input
        
        
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

bookSchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'phoneNumber',
    nationalFormatField: 'nationalFormat',
    internationalFormat: 'internationalFormat',
    countryCodeField: 'countryCode',
});

const Booking = mongoose.model('Booking',bookSchema);
module.exports = Booking;