const mongoose = require('mongoose');
const mongooseTypePhone = require('mongoose-type-phone');
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
        type: mongoose.SchemaTypes.Phone,
        required: 'Phone number should be set correctly',
        allowBlank: false,
        allowedNumberTypes: [mongooseTypePhone.PhoneNumberType.MOBILE, mongooseTypePhone.PhoneNumberType.FIXED_LINE_OR_MOBILE],
        phoneNumberFormat: mongooseTypePhone.PhoneNumberFormat.INTERNATIONAL, // can be omitted to keep raw input
        defaultRegion: 'IN',
        parseOnGet: false
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
        type: Number,
    }
},{timestamps: true})

const Booking = mongoose.model('Booking',bookSchema);
module.exports = Booking;