var hold = require('../models/hold')

exports.mocks=()=>{
    return new Promise(async(resolve,reject)=>{
       
        hold.find( { $or:[ {'status':"initiated"}, {'status':"waiting for TPA approval"},{"status":"rejected"},{"status":"Auto approved"},{"status":"Approved"}]}).then(result=>{
            console.log(result)
            resolve({"status":200,
        "patients":result})
                     })
        
    })
}