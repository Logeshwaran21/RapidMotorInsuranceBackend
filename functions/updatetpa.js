

'use strict';
var bcSdk = require('../fabcar/invoke.js');
const tpaupdate= require('../models/updatetpa')



exports.updatetpa=(userId,transactionstring)=>{

    return new Promise((resolve,reject)=>{
        const newupdate = new tpaupdate({

            userId: userId, 
            transactionstring:transactionstring
        })
        newupdate.save()
        .then((result) => resolve({status: 201, message: 'success'}))
        .catch(err => {

            if (err.code == 11000) {

                reject({status: 409, message: 'already they are having insurance application!'});

            } else {

                reject({status: 500, message: 'Internal Server Error !'});
            }

            var str=JSON.stringify(transferObj)
       
            if(status == "Rejected"){
                new Promise(async(resolve,reject)=>{
                if(HospitalName=="Apollo"){
                    console.log("Appollo TPAupdate");

                    // AddressOfProvider="MALSD5RR7YN4YSFTQWOLJURZ2OINSME4GD5RBHZJ"
                }
                if(HospitalName=="Fortis")
                {
                    console.log("Fortis TPAupdate");

                }
               

                if(status == "Approved"){
                    new Promise(async(resolve,reject)=>{
                  
                       if(HospitalName=="Apollo"){
                       }
                       if(HospitalName=="Fortis"){
                       }


                       return   resolve({"status":200,
                       "message":"approved"})
               })
                   }
                 return  resolve({"status":200,
               "messsage":"object updated"})

               }).catch(err=>{console.log(err)})
            }
           })
           })
        };


