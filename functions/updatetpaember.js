'use strict';
var bcSdk = require('../fabcar/invoke.js');
const tpaupdate = require('../models/updatetpa')
exports.updatetpaember = (InsurerID, claimAmount, Amounttopay, Reason, status,rating) => {

    return new Promise((resolve, reject) => {
        var newupdate = new tpaupdate({
            "InsurerID": InsurerID,
            "claimAmount": claimAmount,
            "Amounttopay": Amounttopay,
            "Reason": Reason,
            "status": status,
            "rating": rating


        })
        var data3 = {
            updatedetails: {

                "userId": InsurerID,
                "transactionstring": newupdate

            }
        }

        console.log("data3===>", data3);
        newupdate.save()
            .then(
                bcSdk.savetransaction(data3))
            .then(() => resolve({
                status: 201,
                message: 'Patient details saved'
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

    })
}