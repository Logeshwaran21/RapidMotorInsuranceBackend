'use strict';

const user = require('../models/registerInsurance');
exports.login = (email, password) =>

    new Promise((resolve, reject) => {
    

        console.log("Entering into login fun");
        console.log(email);
        user.find({
                "email": email,
            "password":password
            })
            .then(users => {
                const dbpin = users[0].password;
                console.log(users[0].password)
                console.log(users[0]._id)
                console.log(dbpin + "   " + users[0].password)

                if (String(password) === String(dbpin)) {

                    resolve({
                        status: 200,
                        users: users[0],
                        message:'Login Successful'
                    });

                } else {

                    reject({
                        status: 401,
                        message: 'Invalid Credentials !'
                    });
                }
            })


    });