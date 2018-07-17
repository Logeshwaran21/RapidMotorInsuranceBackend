'use strict';

const user = require('../models/update');

exports.getdetailsuser = () => {

    return new Promise((resolve, reject) => {

     user.find()
            
            .then(users => {
                console.log("users", users)
               
                resolve({
                    status: 201,
                    usr: users
                })

            }) 

          
              
            .catch(err => {

                if (err.code == 11000) {

                    return reject({
                        status: 409,
                        message: 'cant fetch !'
                    });

                } else {
                    console.log("error occurred" + err);

                    return reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            })
    }) 
}; 