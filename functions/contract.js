'use strict';
const Pateint = require('../models/patientData');
var bcSdk = require('../fabcar/invoke')

exports.createContract =(conditions,HospitalName,submitID,status,claimAmount) =>{

 return    new Promise((resolve, reject) => {
        console.log("conditions==================>",conditions)
            var data  = new Pateint({
                "patientData":conditions,
                "HospitalName":HospitalName,
                "submitID":submitID,
               // "userId":submitID,
                "status":status,
                "TotalClaimedAmount":claimAmount,
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
// bcSdk.savetransaction(data2).then((response) =>{ 
                
//     console.log(response)
//     resolve({
//     status: 201,
//     message: 'Patient details saved'
// })
// }).catch(err =>{ 
//         reject({
//             status: 500,
//             message: 'Internal Server Error !'
//         });
// });

// })
// }