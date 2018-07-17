'use strict';
const Pateint = require('../models/patientData');
var bcSdk = require('../fabcar/invoke')

exports.createContract =(conditions,HospitalName,submitID,status,TotalClaimedAmount) =>{

 return    new Promise((resolve, reject) => {
        console.log("conditions==================>",conditions)
            var data  = new Pateint({
                "patientData":conditions,
                "HospitalName":HospitalName,
                "submitID":submitID,
                "userId":submitID,
                "status":status,
                "TotalClaimedAmount":TotalClaimedAmount,
                  created_at: new Date()
                });
                
                console.log("discharge summary====================>",data)
                var data1  = {"TransactionDetails":{
                    // "patientData":conditions,
                    // "HospitalName":HospitalName,
                    // "submitID":submitID,
                    "userId":submitID,
                    "transactionstring":data
                    // "status":status,
                    // "TotalClaimedAmount":TotalClaimedAmount,
                    //   created_at: new Date()
                    }}
               // console.log(data,"record");
                data.save()
               
                .then(
                    bcSdk.savetransaction(data1))
    
            .then(() => resolve({
                status: 201,
                message: 'Patient details saved'
            }))

            .catch(err =>{ 

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
 });

        })
    }