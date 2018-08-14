var bcSdk = require('../fabcar/query');
<<<<<<< HEAD
const user = require('../models/patientdetails');

=======
const user = require('../models/patientData');
//const user = require('../models/fetchdata');
>>>>>>> 9b7a33b7e1bb36415c4bde996d1ea214405b45cc

       
        exports.getHistory = (userId) => {
                return new Promise((resolve, reject) => {
            
                   bcSdk.getHistory({
                       userId : userId
                       
                        
                   })
            
            
                               .then((docs) => {
                                   var len=docs.length;
                                   console.log(len)

                                   console.log("docs....123>>>",docs)

                                return resolve({
                                        status: 201,
                                         docs:docs,                                       
                                         
                                    })
                                })
                        })
                            
                       .catch(err => {
            
                           console.log("error occurred" + err);
            
                           return reject({
                                status: 500,
                                message: 'Internal Server Error !'
                            });
                        })
            
            };