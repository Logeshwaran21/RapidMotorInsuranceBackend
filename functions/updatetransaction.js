'use strict';
var bcSdk = require('../fabcar/invoke.js');
const  updatepage = require('../models/update');

exports.updatetransaction = (userId,transactionstring) => {
return new Promise((resolve, reject) => {

    const newupdatepage= new updatepage ({
        userId:userId,
        transactionstring: transactionstring,
        
    });
   
    newupdatepage.save()

   .then(() => resolve({ 
    status: 201,
    message: 'user patient details updated successfully!',
   
}))
  
    .then(() => 
    bcSdk.updatetransaction({
            updatedetails: newupdatepage
        })
    )
        
    }).catch(err => {
            log("error occured");
            if (err.code == 11000) {
                reject({
                    status: 409,
                    message: 'some error !'
                });
            } else {
                console.log("error occurred" + err);
                reject({
                    status: 500,
                    message: 'Internal Server Error !'
                });
            }
        });

    }


