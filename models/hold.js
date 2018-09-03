'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const holdSchema = mongoose.Schema({
<<<<<<< HEAD
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




=======
    
    NAME:String,
    AGE:Number,
     DOA:String,
   REF_DOC:String,
   IPD_No:Number,
     MLC:Number,
     SEX:String,
     DOD:String,
    DAIGONIS:String,
    Cheif_Complaints_On_Admission:String,
    Past_History_with_Allergy:String,
    Personal_History:String,
    Family_History:String,
    Menstrual_History:String,
    Obstretric_History:String,
    Genral_Examination:String,
    Systematic_Examination:String,
   Investigations:String,
   BaBys_Details:String,
   Course_in_Hospital_And_condition:String,
   Treatment_Given:String,
  Treatment_Adviced:String,
   Follow_Up_Visit:String,
  Procedure_done:String,
  policyId:String,
  claimAmount:Number,
    status:String,
    submitID:String,
    HospitalName:String,
    Expenses:Number,
    message:String,
    AmountPayerWouldPay:Number,
    AmountuserHavetopay:Number,
    
    created_at: Date
    
>>>>>>> 25136fda848ba80d4b51a8aa57736911df67c1f9
});


mongoose.Promise = global.Promise;

<<<<<<< HEAD
mongoose.connect('mongodb://bahirathy:bahirathy20@ds127851.mlab.com:27851/kare4u',{
    useMongoClient: true
});
=======
mongoose.connect('mongodb://risabhsharma71:Rpqb123@ds111420.mlab.com:11420/care4u', { useMongoClient: true });
>>>>>>> 25136fda848ba80d4b51a8aa57736911df67c1f9


module.exports = mongoose.model('hold', holdSchema);