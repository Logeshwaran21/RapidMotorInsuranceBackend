'use strict';
var bcSdk = require('../fabcar/invoke');
//const  patientpage = require('../models/patientdetails');

exports.Policyrules = (policyId,policydate_date,provider,rules) => {
    return new Promise((resolve, reject) => {

    var newpage = new patientpage ({

        "policyId":policyId,
        "policydate_date":policydate_date,
        "provider":provider,
        "rules":rules
        
        
   });
   console.log("details",newpage); 
   console.log("enter chain func");
    var newPolicy = {TransactionDetails:{
        "userId":policyId,
        "transactionstring":newpage



    }}
//newpage.save()
.then(
bcSdk.savetransaction(newPolicy))

   .then(() => resolve({
    status: 201,
    message: 'your patient details entered successfully !'
}))

// .then(() => 
// bcSdk.savetransaction({ TransactionDetails: newpage})
// )
.catch(err =>{ 

    if (err.code == 11000) {

        reject({
            status: 409,
            message: 'Policy Already Registered !'
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