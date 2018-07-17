'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientDataSchema = mongoose.Schema({

    patientData:Array,
    HospitalName:String,
    submitID:String,
    userId:String,
    status:String,
    TotalClaimedAmount:Number,
    created_at: String
    
});


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://bahirathy:bahirathy20@ds127851.mlab.com:27851/kare4u', { useMongoClient: true });


module.exports = mongoose.model('patientData', patientDataSchema);