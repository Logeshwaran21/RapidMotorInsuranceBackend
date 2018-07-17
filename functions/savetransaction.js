'use strict';
// const bc_client = require('../blockchain_sample_client'); const bcrypt =
// require('bcryptjs');
var bcSdk = require('../fabcar/invoke');
const  patientpage = require('../models/patientdetails');

exports.savetransaction = (userId,transactionstring) => {
    return new Promise((resolve, reject) => {

    const newpage =new patientpage ({

        userId:userId,
       transactionstring: transactionstring,
        
        
   });

   newpage.save()
   
   
   

   .then(() => resolve({
    status: 201,
    message: 'your patient details entered successfully !'
}))

.then(() => 
bcSdk.savetransaction({ TransactionDetails: newpage})
)
        .catch(err => {
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
});
}