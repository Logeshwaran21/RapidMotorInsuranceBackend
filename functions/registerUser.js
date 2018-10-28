'use strict';

const user = require('../models/registerInsurance');  
//const bcSdk = require('../fabcar/invoke.js');

exports.registerUser = (name,groupID, address, phoneNumber, email,password,captiveName,parent,employeeID,captiveType,entity,organization) => {
    return new Promise((resolve, reject) => {

    const newUser = new user({

        name:name,
        groupID:groupID,
        address : address, 
        phoneNumber : phoneNumber, 
        email : email,
        password:password,
        // pwd : pwd, 
        // rpwd : rpwd,
        captiveName: captiveName,
        parent:parent,
        employeeID:employeeID,
        captiveType:captiveType,
        entity:entity,
        organization:organization
        
       
    });
    var ldata = {
        TransactionDetails: {

            "userId": groupID,
            "transactionstring": newUser

        }
    }
    newUser
    .save()
    // .then(
    //     bcSdk.savetransaction(ldata))

  resolve({
        status: 201,
        message: 'User Registered Sucessfully !'
    })

    // .then(() => bcSdk.createUser({
    //     user: users,
    //     UserDetails: newUser
    // }))

    .catch(err => {

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

});
}