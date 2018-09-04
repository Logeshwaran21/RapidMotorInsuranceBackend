'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const holdSchema = mongoose.Schema({
    patientData:Object,

    // NAME: String,
    // AGE: String,
    // DOA: String,
    // REF_DOC: String,
    // IPD_No: String,
    // MLC: String,
    // SEX: String,
    // DOD: String,
    // DAIGONIS: String,
    // Cheif_Complaints_On_Admission: String,
    // Past_History_with_Allergy: String,
    // Personal_History: String,
    // Family_History: String,
    // Menstrual_History: String,
    // Obstretric_History: String,
    // Genral_Examination: String,
    // Systematic_Examination: String,
    // Investigations: String,
    // BaBys_Details: String,
    // Course_in_Hospital_And_condition: String,
    // Treatment_Given: String,
    // Treatment_Adviced: String,
    // Follow_Up_Visit: String,
    // Procedure_done: String,
    // policyId: String,
    submitID: String,
    claimAmount: String,
    // HospitalName: String,
   
    // userId: String,
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