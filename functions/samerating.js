'use strict';
var bcSdk = require('../fabcar/invoke.js');
const tpaupdate= require('../models/updatetpa')
exports.same=(groupID, claimAmount, Amounttopay, Reason, status)=>{
   // console.log("r",rating);
    return new Promise((resolve,reject)=>{
        var newupdate = new tpaupdate({
            "groupID":groupID,
            "claimAmount": claimAmount, 
            "Amounttopay":Amounttopay,
            "Reason": Reason,
            "status":status
           

        })
        var data3  = {TransactionDetails:{
                   
            "userId":groupID,
            "transactionstring":newupdate
           
            }}
     
console.log("data3===>",data3);
       // newupdate.save()
      //  .then(
            bcSdk.savetransaction(data3)
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