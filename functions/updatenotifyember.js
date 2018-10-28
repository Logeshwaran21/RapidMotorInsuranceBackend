'use strict';
var bcSdk = require('../fabcar/invoke.js');
//const tpaupdate= require('../models/updatetpa')
exports.updatenotifyember=(status,policyid, policyname, policycatagory, rules,  count1)=>{
    //console.log("r",rating);
    return new Promise((resolve,reject)=>{
        var newupdate=({
            "status":status,
            "policyid": policyid, 
            "policyname":policyname,
            "policycatagory": policycatagory,
            "rules":rules,
            "count1":count1
        })
        var data3  = {updatedetails:{
                   
            "userId":policyid,
            "transactionstring":newupdate
           
            }}
     
console.log("data3===>",data3);
        // newupdate.save()
        // .then(
            bcSdk.updatetransaction(data3)
            .then(() => resolve({
                status: 201,
                
                message: 'Details updated successfully'
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