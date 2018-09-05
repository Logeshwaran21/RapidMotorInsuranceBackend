'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TpaSchema = mongoose.Schema({
   patientData:Object,
    submitID: String,
    claimAmount: String,
    status: String,
    message: String,
    Expenses: Number,
    AmountPayerWouldPay: Number,
    AmountuserHavetopay: Number,
    created_at: Date

});
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://bahirathy:bahirathy20@ds127851.mlab.com:27851/kare4u', {
    useMongoClient: true
});


module.exports = mongoose.model('Tpa', TpaSchema);