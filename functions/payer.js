
//const nem = require("nem-sdk").default;
const crypto= require("crypto")
var patientData= require("../models/patientData");
var Tpa = require('../models/Tpa');

exports.mock=()=>{
    return new Promise(async(resolve,reject)=>{
        var aprovedArray=[];
    let results1= await  Tpa.find({})
        for(let i=0;i<results1.length;i++ ){
            var str=JSON.stringify(results1[i]._doc.patientData);         
            var txHash=results1[i]._doc.txHash;
            console.log(txHash)
            if(txHash==""){
                aprovedArray.push(results1[i])
            }
       
            if(i==results1.length-1)
           return resolve({
                "status":200,
                "message":aprovedArray
            })
        }
           
    })
}