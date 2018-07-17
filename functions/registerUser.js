
'use strict';

const user = require('../models/register');  
// const user = require('../models/fetchdata');

exports.registerUser = (firstname, lastname, phonenumber,dateofbirth,email,password, retypepassword,usertype, userId) => new Promise((resolve, reject) => {

    const newUser = new user({

        firstname : firstname, 
        lastname : lastname, 
        phonenumber : phonenumber,
        dateofbirth : dateofbirth,
        email : email,
        password : password, 
        retypepassword : retypepassword,
        usertype : usertype,
        userId:userId
    });
    newUser
        .save()
        .then(() => resolve({
            status: 201,
            message: 'Please verify your emailid and phone no'
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