 'use strict';
const Pateint = require('../models/patientData');
var bcSdk = require('../fabcar/invoke')

exports.createContract =(keys,s,submitID,policyId) => {
// (NAME, AGE, HospitalName, DOA, REF_DOC, IPD_No, MLC, SEX, DOD, DAIGONIS, Cheif_Complaints_On_Admission, Past_History_with_Allergy, Personal_History, Family_History, Menstrual_History, Obstretric_History, Genral_Examination, Systematic_Examination, Investigations, BaBys_Details, Course_in_Hospital_And_condition, Treatment_Given, Treatment_Adviced, Follow_Up_Visit, Procedure_done, submitID, status, claimAmount, policyId) => {

    return new Promise((resolve, reject) => {
        var data = new Pateint({
          
            "patientData":s,
            "submitID":submitID,
            "policyId": policyId,

            created_at: new Date()
        });

        console.log("discharge summary====================>", data)
        var ldata = {
            TransactionDetails: {

                "userId": submitID,
                "transactionstring": data

            }
        }
        // data.save()

        //     .then(
              //  bcSdk.savetransaction(ldata))
                bcSdk.savetransaction(ldata)
            .then(() => resolve({
                status: 201,
                message: 'Patient details saved'
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'User Already Registered !'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            });

    })
}