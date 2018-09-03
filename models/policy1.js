'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const policydetailSchema = mongoose.Schema({
    policyID:String,
    userId:String,
    policys:Array,
    created_at: String
    
});


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://bahirathy:bahirathy20@ds127851.mlab.com:27851/kare4u', { useMongoClient: true });


module.exports = mongoose.model('policydetails1', policydetailSchema);