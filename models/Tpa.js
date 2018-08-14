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

mongoose.connect('mongodb://EHRTeam:EHRTeam1@ds139920.mlab.com:39920/ehr', { useMongoClient: true });


module.exports = mongoose.model('Tpa', TpaSchema);