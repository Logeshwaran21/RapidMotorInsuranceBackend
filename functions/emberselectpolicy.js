'use strict';

// const user = require('../models/notify');
const user = require('../models/notifySelectPolicy');
var bcSdk = require('../fabcar/invoke');
// const user = require('../models/fetchdata');

exports.emberselectpolicy = (policyid, policyname, policycatagory, rules, count) => {
    return new Promise((resolve, reject) => {

        const newUser = new user({

            policyid: policyid,
            policyName: policyname,
            policycatagory: policycatagory,
            // policypercentage: policypercentage,
            rules: rules,
            count: count
        });
        var ldata = {
            TransactionDetails: {

                "userId": policyid,
                "transactionstring": newUser

            }
        }
        newUser
            .save()

        // .then((result) => resolve({
        //     status: 201,
        //     message: 'Your Request has been recieved,Waiting for Admin Approval!',
        //     result: result
        // }))

        bcSdk.savetransaction(ldata)
            .then((result) => resolve({
                status: 201,
                message: 'Your Request has been recieved,Waiting for Admin Approval!',
                result: result
            }))
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