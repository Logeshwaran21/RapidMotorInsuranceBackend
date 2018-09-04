var bcSdk = require('../fabcar/query');


exports.validate = (userId) => {
    return new Promise((resolve, reject) => {

            bcSdk.getHistory({
                    userId: userId
                })


                .then((docs) => {
                    console.log("out from chain", docs)
                    // if(docs.response==undefined){
                    //     return resolve({
                    //         status:402,
                    //         "message":"Record does not exits "

                    //     });
                    //  } else {

                    return resolve({
                        status: 201,
                        docs: docs,

                    })
               // }
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