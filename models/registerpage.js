'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registerpageSchema = mongoose.Schema({

    firstname: String,
    lastname: String, 
    phonenumber : Number,
    dateofbirth : String,
    email : {
        type: String,
        unique: true
    },
    password: String,
    retypepassword: String,
    usertype:  String,
    // rapidID: String
     
});


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });

mongoose.connect('mongodb://bahirathy:bahirathy20@ds127851.mlab.com:27851/kare4u', {
    useMongoClient: true
});



module.exports = mongoose.model('registerpage', registerpageSchema);