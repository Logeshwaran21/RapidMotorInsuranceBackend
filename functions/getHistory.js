var bcSdk = require('../fabcar/query');
const user = require('../models/patientdetails');
//const user = require('../models/fetchdata');

       
        exports.getHistory = (userId) => {
                return new Promise((resolve, reject) => {
            
                   bcSdk.getHistory({
                       userId : userId
                       
                        
                   })
            
                           // request.find({
                            //         "rapidID": rapidID
                            //     })
            
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