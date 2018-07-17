'use strict';


const registerUser = require('./functions/registerUser');
const mockWeather = require('./functions/smartContract');
var crypto = require('crypto');
var fs = require('fs');
var cors = require('cors');
var tpaApproval=require("./functions/Tpaapproval.js")
 const contractJs = require('./functions/contract');
 const payer=require("./functions/payer");

var config = require('./config.json')
var oneday= require('./functions/oneday')
const getpatientdetails = require('./functions/getpatientdetails');
const getHistory = require('./functions/getHistory');
const updatetpa=require('./functions/updatetpa');
const updatetransaction = require('./functions/updatetransaction');
const savetransaction = require('./functions/savetransaction');
const readIndex = require('./functions/readIndex');


var cors = require('cors');
var mongoose = require('mongoose');

var Promises = require('promise');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var path = require('path');



module.exports = router => {
   
//=============================================create discharge summary==============================================================//
        router.post('/createContract', cors(),function(req,res){

        var conditions =req.body.patientData;
                        var HospitalName=req.body.HospitalName;
                        var submitID=req.body.submitID;
                        var status = req.body.status;
                        var TotalClaimedAmount=req.body.TotalClaimedAmount
         
             contractJs.createContract(conditions,HospitalName,submitID,status,TotalClaimedAmount)
             .then(result => {
                
        
                        res.status(result.status).json({
                            message: result.message
                          
                        });
    
                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
                });

//============================================mock weather====================================================//         
router.get('/trigger',cors(),function(req,res){

    // var HospitalName= req.body.HospitalName;
   var jsonfile = require('jsonfile')
   var file = './payer_provider.json'
   jsonfile.readFile(file, function(err, obj)
   {
    if(err){
       res.send({"code":404,
       "message":"no contract created yet",
           "error":err})
        }    

 
            mockWeather.mock(obj)
            .then(result => {
                       console.log(result)
                       res.status(200).json({
                        message: "conditions satisfied for the users below"
                       });
   
                   }) .catch(err => res.status(err.status).json({
                       message: err.message
                   }))
    })
             
                 
               });
   
            

           

//==========================Tpa=====================================================================//
router.get('/Tpa',cors(),function(req,res){
   
        tpaApproval.mock()
             .then(result => {
                        console.log(result)
                        res.status(result.status).json({
                            patients:result.patients 
                        });
    
                    }) .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
                });
            
//===========================tpa changing status=========================================================//
router.post('/Tpaupdate',cors(),function(req,res){
   var status= req.body.status;
   var id=req.body.id;
   var message=req.body.message;

    tpaNem.mocknem(status,id,message)
         .then(result => {
                    console.log(result)
                    res.status(200).json({
                        message:"dataset triggered "
                    });
                }) .catch(err => res.status(err.status).json({
                    message: err.message
                }))
            });
        
//====================================payer page=============================================//
router.get('/payerpay',cors(),function(req,res){
   
    payer.mock()
         .then(result => {
                    console.log(result)
                    res.status(result.status).json({
                        patients:result.message 
                    });

                }) .catch(err => res.status(err.status).json({
                    message: err.message
                }))
            });
//=======================================fortis dashboard api====================================================//
router.post("/HospitalDashboard",cors(),function(req,res){
    var HospitalName= req.body.HospitalName;
    Hospital.DashBoard(HospitalName).then(reports=>{
        res.send({
            "status":200,
            "patients":reports.message
        })
    })
})

//=========================================24hrs trigger===============================================//
router.get("/24hrs",cors(),(req,res)=>{
    oneday.oneday().then((results)=>{
            console.log(results)
            res.send({"status":200,
        "message":results.message})
    })
})
//===============================history api==============================================================//
router.post("/history",cors(),(req,res)=>{
    var id=req.body.id
    recordHistory.history(id).then(result=>{
        
            console.log(result)
            res.status(result.status).json({
                history:result.message 
            });

        }) .catch(err => res.status(err.status).json({
            message: err.message
        }))
    });
//=================update discharge summary=======================================//
router.post("/updateDischargeSummary",cors(),(req,res)=>{
    var id=req.body.id
    updateDischargeSummary.update(id).then(result=>{
        
            console.log(result)
            res.status(result.status).json({
                history:result.message 
            });

        }) .catch(err => res.status(err.status).json({
            message: err.message
        }))
    });






    router.post('/patientdetails', cors(), (req, res) => {
        console.log("body========>",req.body)
        const userId = req.body.userId;
        console.log("userId",userId);
        var transactionstring =req.body.transactionstring;
        console.log("line number 212-------->",transactionstring)
    


        savetransaction.savetransaction(userId,transactionstring)
            
        .then(result => {

                console.log(result);
                res.send({
                    "message": result.message,
                    // "requestid": requestid,
                    "status": true


                });
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }).json({
                status: err.status
            }));

    });


                router.post('/getHistory',(req,res)=>{
                    console.log("requ...123>>>ui>>>",req.body);
                    const userId = req.body.userId;
                    console.log("userId", userId);
                    

                           getHistory.getHistory (userId)
                                .then(result=>{
                                    console.log("result....123>>>",result);
                                   res.status(result.status).json({
                                    result:result.docs,

                                })
                            })
                            
                           .catch(err => res.status(err.status).json({
                                message: err.message
                            }).json({
                                status: err.status
                            }));
                        })
                        

    router.post('/savetransaction', cors(), (req, res) => {
        var name = req.body.name;
        var transactionstring = JSON.stringfy(req.body.transactionstring);
        var requestid = req.body.requestid;

        savetransaction
            .savetransaction(name, transactionstring, requestid)
            .then(function(result) {
                console.log(result)

                res.send({

                    message: "entered successfully"
                });
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));


    });

    router.post('/updatetpa', cors(), (req, res) => {
   var userId=req.body.userId;
   var transactionstring=req.body.transactionstring;
           updatetpa.updatetpa(userId,transactionstring)
         .then(result => {
                    console.log(result)
                    res.status(200).json({
                        message:"dataset triggered "
                    });
                }) .catch(err => res.status(err.status).json({
                    message: err.message
                }))
            

        updatetransaction
        .updatetransaction(userId,transactionstring)
        .then(result =>  {
            console.log("result....",result)     
        
        })
    });



    router.post("/HospitalDashboard",cors(),function(req,res){
        var HospitalName= req.body.HospitalName;
        Hospital.DashBoard(HospitalName).then(reports=>{
            res.send({
                "status":200,
                "patients":reports.message
            })
        })
    })



    
                             router.get("/getpatientdetails", cors(), (req, res) => {
                                
                                                                       
                                            var startKey = '000';
                                            console.log("startKey", startKey);
                                            var endKey = '999';
                                            console.log("endKey--", endKey);
                                
                                            getpatientdetails
                                            .getpatientdetails(startKey, endKey)
                                                .then(function(result) {

                                                    console.log("  result.query1234..>>>", result.query);
                                                    console.log("  result.querykey..>>>", result.query.Key);
                                                    res.status(result.status).json({message:result.query})
                                                })
                                                .catch(err => res.status(err.status).json({
                                                    message: err.message
                                                }));
                                       

                                    });


                                  


   router.post('/updatetransaction', cors(), (req, res) => {
    
        console.log("entering in to the update trans.....ui",req.body);
        
         var body = req.body
        var userId = body.id;
      var transactionstring = body.transactionstring;
      
                                                
  console.log("entering in to the upda trans",userId,transactionstring);

  

        updatetransaction.updatetransaction(userId,transactionstring)
        
        
        .then(result => {
            if(!userId) {
                res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
            }

                else {
                res.send({
                    "message": result.message,
                    "status": true


                });
            }
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }).json({
                status: err.status
            }));

    }); 
                                         


            

    function checkToken(req) {

        const token = req.headers['authorization'];

        if (token) {

            try {
                (token.length != 0)
                return token
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    }

    function getrapidID(req) {
        
               const token = req.headers['x-access-token'];
        
               if (token) {
        
                   try {
        
                     //  var decoded = jwt.verify(token, config.secret);
                    
                        return decoded.register.userId;
        
        
                   } catch (err) {
        
                       return false;
                    }
        
               } else {
        
                   return false;
                }
            }
        }