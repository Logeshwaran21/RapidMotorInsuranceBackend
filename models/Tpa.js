'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TpaSchema = mongoose.Schema({
    // userId:Number,
    patientData: Array,
    status:String,
    submitID:String,
    HospitalName:String,
    AmountPayerWouldPay:Number,
    AmountuserHavetopay:Number,
    Expenses:Number,
    message:String,
    rapidID:String,
    txHash:String,
    previousHashes:Array,
    created_at: Date
    
});


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://bahirathy:bahirathy20@ds127851.mlab.com:27851/kare4u', { useMongoClient: true });


module.exports = mongoose.model('Tpa', TpaSchema);