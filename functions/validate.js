var bcSdk = require('../fabcar/query');


exports.validate = (userId) => {
    return new Promise((resolve, reject) => {

            bcSdk.getHistory({
                    userId: userId
                })


                .then((docs) => {
                    console.log("out from chain", docs)


                    return resolve({
                        status: 201,
                        docs: docs,

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