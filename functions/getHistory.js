var bcSdk = require('../fabcar/query');

const user = require('../models/patientData');

exports.getHistory = (userId) => {
   return new Promise((resolve, reject) => {

           bcSdk.getHistory({
                   userId: userId

               })

.then(function (docs) {
   if (docs.response == undefined) {
   console.log(docs.response)
       return resolve({
           "status": 401,
           "message": "record doesnot exits"
       });
   } else {
       resolve({
           "status": 200,
           docs:docs
       });
   }
})
.catch(err => {
   console.log(err)
   reject({
       "status": 500,
       "message": 'Something went wrong please try again later!!'
   });

});
});
}