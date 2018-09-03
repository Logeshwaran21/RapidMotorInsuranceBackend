'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tpa1Schema = mongoose.Schema({
    
    submitID: String, 
    status:String,
    message: String,
    AmountPayerWouldPay:String,
    AmountuserHavetopay:String
});


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });
//mongodb://<dbuser>:<dbpassword>@ds127851.mlab.com:27851/kare4u
mongoose.connect('mongodb://EHRTeam:EHRTeam1@ds139920.mlab.com:39920/ehr', {
    useMongoClient: true
});



module.exports = mongoose.model('tpaupdatepage', tpa1Schema);