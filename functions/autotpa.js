'use strict';
var Patient = require('../models/Tpa');
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
//var hold = require('../models/hold');
var bcSdk = require('../fabcar/invoke')

exports.autotpa =(NAME, AGE, DOA, REF_DOC, IPD_No, MLC, SEX, DOD, DAIGONIS, Cheif_Complaints_On_Admission, Past_History_with_Allergy, Personal_History, Family_History, Menstrual_History, Obstretric_History, Genral_Examination, Systematic_Examination, Investigations, BaBys_Details, Course_in_Hospital_And_condition, Treatment_Given, Treatment_Adviced, Follow_Up_Visit, Procedure_done, submitID, policyId ,HospitalName, status, claimamount, claimAmount) =>{

 return new Promise((resolve, reject) => {

       // console.log("conditions==================>",conditions)
       if(claimAmount > claimamount){
        var data = new Patient({
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
            "HospitalName": HospitalName,
            "status": "waiting for TPA approval",
            "submitID": submitID,
           "message": "on Hold",
            "Expenses": claimAmount,
           "AmountPayerWouldPay":"on Hold",
         "AmountuserHavetopay":"on Hold",

            created_at: new Date()
        });
    data.save()
    var ldata  = {updatedetails:{
                   
        "userId":submitID,
        "transactionstring":data
       
        }}
        
            bcSdk.updatetransaction(ldata)
           

    }
       else {
        var data = new Patient({
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
=======
var bcSdk = require('../fabcar/invoke')

exports.autotpa =(conditions,HospitalName,submitID,status,claimamount,claimAmount) =>{

 return new Promise((resolve, reject) => {
        console.log("conditions==================>",conditions)
        var data = new Patient({
            "patientData": conditions,
>>>>>>> c20a0b299b30e21d75daf1e174b20316b54a56d3
            "HospitalName": HospitalName,
            "status": "Auto approved",
            "submitID": submitID,
           "message": "approved",
            "Expenses": claimamount,
           "AmountPayerWouldPay":claimamount,
         "AmountuserHavetopay":claimAmount-claimamount,

            created_at: new Date()
        });
<<<<<<< HEAD
        data.save()
        var ldata  = {updatedetails:{
                   
            "userId":submitID,
            "transactionstring":data
           
            }}
          
                bcSdk.updatetransaction(ldata)
               
   
    }
    resolve({
        "status": 200,
        "message": "details saved"
    })
              
    
=======
                console.log("discharge summary====================>",data)
                var ldata  = {updatedetails:{
                   
                    "userId":submitID,
                    "transactionstring":data
                   
                    }}
             
                data.save()
               
                .then(
                    bcSdk.updatetransaction(ldata))
    
            .then(() => resolve({
                status: 201,
                message: 'Patient details saved'
            }))
>>>>>>> c20a0b299b30e21d75daf1e174b20316b54a56d3

            .catch(err =>{ 
>>>>>>> 25136fda848ba80d4b51a8aa57736911df67c1f9

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'User Already Registered !'
                    });
<<<<<<< HEAD

                } else {

=======
    
                } else {
    
>>>>>>> 25136fda848ba80d4b51a8aa57736911df67c1f9
                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
<<<<<<< HEAD
            });

    })
}
=======
 });

        })
<<<<<<< HEAD
    }
=======
    }
>>>>>>> c20a0b299b30e21d75daf1e174b20316b54a56d3
>>>>>>> 25136fda848ba80d4b51a8aa57736911df67c1f9
