'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const holdSchema = mongoose.Schema({
    patientData:Object,
    submitID: String,
    claimAmount: String,
     status: String,
     message: String,
     Expenses: Number,
    AmountPayerWouldPay: String,
    AmountuserHavetopay: String,
    created_at: String
});
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://bahirathy:bahirathy20@ds127851.mlab.com:27851/kare4u',{
useMongoClient: true
});
module.exports = mongoose.model('hold', holdSchema);