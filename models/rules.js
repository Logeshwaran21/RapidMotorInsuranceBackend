'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rulesSchema = mongoose.Schema({
    
    policyId:String,
    policydate_date:String,
    provider:String,
    rules:Array
});


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });
//mongodb://<dbuser>:<dbpassword>@ds127851.mlab.com:27851/kare4u
mongoose.connect('mongodb://bahirathy:bahirathy20@ds127851.mlab.com:27851/kare4u', {
    useMongoClient: true
});
module.exports = mongoose.model('rules', rulesSchema);