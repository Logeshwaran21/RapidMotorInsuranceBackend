'use strict';
var Patient = require('../models/Tpa');
var hold = require('../models/hold')
var bcSdk = require('../fabcar/invoke')

exports.autotpa = (keys,s,claimamount,claimAmount,submitID) => {
    console.log("claimamount",claimamount)
    console.log("claimAmount",claimAmount)

    return new Promise((resolve, reject) => {

        if (claimAmount > claimamount ) {

            var data = new hold({
                // "NAME": NAME,
                // "AGE": AGE,
                // "DOA": DOA,
                // "REF_DOC": REF_DOC,
                // "IPD_No": IPD_No,
                // "MLC": MLC,
                // "SEX": SEX,
                // "DOD": DOD,
                // "DAIGONIS": DAIGONIS,
                // "Cheif_Complaints_On_Admission": Cheif_Complaints_On_Admission,
                // "Past_History_with_Allergy": Past_History_with_Allergy,
                // "Personal_History": Personal_History,
                // "Family_History": Family_History,
                // "Menstrual_History": Menstrual_History,
                // "Obstretric_History": Obstretric_History,
                // "Genral_Examination": Genral_Examination,
                // "Systematic_Examination": Systematic_Examination,
                // "Investigations": Investigations,
                // "BaBys_Details": BaBys_Details,
                // "Course_in_Hospital_And_condition": Course_in_Hospital_And_condition,
                // "Treatment_Given": Treatment_Given,
                // "Treatment_Adviced": Treatment_Adviced,
                // "Follow_Up_Visit": Follow_Up_Visit,
                // "Procedure_done": Procedure_done,
                // "policyId": policyId,
                // "HospitalName": HospitalName,
                "patientData":s,
                "submitID": submitID,
                "claimAmount":claimAmount,
                 "status": "waiting for TPA approval",
                 "message": "Hold",
                          
                "Expenses": claimamount,
                
                "AmountPayerWouldPay": "hold",
                "AmountuserHavetopay": "hold",

                created_at: new Date()
            });
            console.log("discharge summary====================>", data)
            var ldata = {
                updatedetails: {

                    "userId": submitID,
                    "transactionstring": data

                }
            }

            data.save()

                .then(
                    bcSdk.updatetransaction(ldata))
        } else {
            var data = new Patient({
                // "NAME": NAME,
                // "AGE": AGE,
                // "DOA": DOA,
                // "REF_DOC": REF_DOC,
                // "IPD_No": IPD_No,
                // "MLC": MLC,
                // "SEX": SEX,
                // "DOD": DOD,
                // "DAIGONIS": DAIGONIS,
                // "Cheif_Complaints_On_Admission": Cheif_Complaints_On_Admission,
                // "Past_History_with_Allergy": Past_History_with_Allergy,
                // "Personal_History": Personal_History,
                // "Family_History": Family_History,
                // "Menstrual_History": Menstrual_History,
                // "Obstretric_History": Obstretric_History,
                // "Genral_Examination": Genral_Examination,
                // "Systematic_Examination": Systematic_Examination,
                // "Investigations": Investigations,
                // "BaBys_Details": BaBys_Details,
                // "Course_in_Hospital_And_condition": Course_in_Hospital_And_condition,
                // "Treatment_Given": Treatment_Given,
                // "Treatment_Adviced": Treatment_Adviced,
                // "Follow_Up_Visit": Follow_Up_Visit,
                // "Procedure_done": Procedure_done,
                // "policyId": policyId,
                // "HospitalName": HospitalName,
                "patientData":s,
                
                 "submitID": submitID,
                 "claimAmount":claimAmount,
                 "status": "Auto approved",
                "message": "approved",
                "Expenses": claimamount,
                "AmountPayerWouldPay": claimamount,
                "AmountuserHavetopay": claimAmount - claimamount,

                created_at: new Date()
            });
            data.save()
            var ldata = {
                updatedetails: {

                    "userId": submitID,
                    "transactionstring": data

                }
            }

            bcSdk.updatetransaction(ldata)


        }
        resolve({
                "status": 200,
                "message": "details saved"
            })



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