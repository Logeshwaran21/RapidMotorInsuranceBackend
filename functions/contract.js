'use strict';
const Pateint = require('../models/patientData');
var bcSdk = require('../fabcar/invoke')

<<<<<<< HEAD
exports.createContract =(NAME, AGE, DOA, REF_DOC, IPD_No, MLC, SEX, DOD, DAIGONIS, Cheif_Complaints_On_Admission, Past_History_with_Allergy, Personal_History, Family_History, Menstrual_History, Obstretric_History, Genral_Examination, Systematic_Examination, Investigations, BaBys_Details, Course_in_Hospital_And_condition, Treatment_Given, Treatment_Adviced, Follow_Up_Visit, Procedure_done, HospitalName, submitID, status, claimAmount, policyId) =>{
=======
exports.createContract =(conditions,HospitalName,submitID,status,claimAmount) =>{
>>>>>>> c20a0b299b30e21d75daf1e174b20316b54a56d3

 return    new Promise((resolve, reject) => {
        // console.log("conditions==================>",conditions)
            var data  = new Pateint({
                "NAME":NAME,
    "AGE":AGE ,
    "DOA": DOA,
  "REF_DOC": REF_DOC,
   "IPD_No": IPD_No,
    "MLC": MLC,
    "SEX": SEX,
    "DOD": DOD,
   "DAIGONIS": DAIGONIS,
   "Cheif_Complaints_On_Admission": Cheif_Complaints_On_Admission,
    "Past_History_with_Allergy": Past_History_with_Allergy,
    "Personal_History": Personal_History,
   "Family_History": Family_History,
   "Menstrual_History": Menstrual_History,
   "Obstretric_History": Obstretric_History,
   "Genral_Examination": Genral_Examination,
   "Systematic_Examination": Systematic_Examination,
  "Investigations": Investigations,
   "BaBys_Details": BaBys_Details,
   "Course_in_Hospital_And_condition": Course_in_Hospital_And_condition,
   "Treatment_Given": Treatment_Given,
    "Treatment_Adviced": Treatment_Adviced,
    "Follow_Up_Visit": Follow_Up_Visit,
    "Procedure_done":Procedure_done,
      "policyId":policyId,
                 "HospitalName":HospitalName,
                "submitID":submitID,
                "status":status,
<<<<<<< HEAD
                "claimAmount":claimAmount,
=======
                "TotalClaimedAmount":claimAmount,
>>>>>>> c20a0b299b30e21d75daf1e174b20316b54a56d3
                  created_at: new Date()
                });
                
                console.log("discharge summary====================>",data)
                var ldata  = {TransactionDetails:{
                   
                    "userId":submitID,
                    "transactionstring":data
                   
                    }}
             
                data.save()
               
                .then(
                    bcSdk.savetransaction(ldata))
    
            .then(() => resolve({
                status: 201,
                message: 'Patient details saved'
            }))

            .catch(err =>{ 

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