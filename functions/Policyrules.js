'use strict';
var bcSdk = require('../fabcar/invoke');
const  rulespage = require('../models/rules');

exports.Policyrules = (policyId,policydate_date,provider,rules) => {
    return new Promise((resolve, reject) => {
        console.log("in func");
    var newpage = new rulespage({

        "policyId":policyId,
        "policydate_date":policydate_date,
        "provider":provider,
        "rules":rules
        
        
   });
   console.log("details",newpage); 
   console.log("enter chain func");
    var newPolicy = {TransactionDetails:{
        "userId":policyId,
        "transactionstring":newpage.id



    }}
    //console.log("storeid",id);
newpage.save()
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