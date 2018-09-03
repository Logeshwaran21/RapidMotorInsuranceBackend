'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TpaSchema = mongoose.Schema({
    // userId:Number,

    patientData:Object,
    // name: String,
    // AGE: Number,
    // DOA: String,
    // REF_DOC: String,
    // IPD_No: Number,
    // MLC: Number,
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
    status: String,
    message: String,
    Expenses: Number,
   // HospitalName: String,
    AmountPayerWouldPay: Number,
    AmountuserHavetopay: Number,
    
  
    // rapidID:String,
    // txHash:String,
    // previousHashes:Array,
    created_at: Date

});


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://bahirathy:bahirathy20@ds127851.mlab.com:27851/kare4u', {
    useMongoClient: true
});


module.exports = mongoose.model('Tpa', TpaSchema);