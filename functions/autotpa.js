'use strict';
var Patient = require('../models/Tpa');
var bcSdk = require('../fabcar/invoke')

exports.autotpa =(conditions,HospitalName,submitID,status,claimamount,claimAmount) =>{

 return new Promise((resolve, reject) => {
        console.log("conditions==================>",conditions)
        var data = new Patient({
            "patientData": conditions,
            "HospitalName": HospitalName,
            "status": "Auto approved",
            "submitID": submitID,
           "message": "approved",
            "Expenses": claimamount,
           "AmountPayerWouldPay":claimamount,
         "AmountuserHavetopay":claimAmount-claimamount,

            created_at: new Date()
        });
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
