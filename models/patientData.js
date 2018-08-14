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

mongoose.connect('mongodb://EHRTeam:EHRTeam1@ds139920.mlab.com:39920/ehr', { useMongoClient: true });


module.exports = mongoose.model('patientData', patientDataSchema);