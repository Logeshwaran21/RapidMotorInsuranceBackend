'use strict';

var tpaApproval = require("./functions/tpaapproval.js")
var validate = require("./functions/validate.js");
const contractJs = require('./functions/contract')
const { getpatientdetails } = require('./functions/getpatientdetails')
const  getcaptivepolicydetails  = require('./functions/captivePolicy')
const getHistory = require('./functions/getHistory')
const updatetpa = require('./functions/updatetpa')
 
const updatenotifyember = require('./functions/updatenotifyember.js')

const autotpa = require('./functions/autotpa')
const createpolicy = require('./functions/policy1')
const getpolicy1 = require('./functions/getpolicy1')
const savetransaction = require('./functions/savetransaction')
const submitdata = require('./functions/submitdata')
const registerUser = require('./functions/registerUser');
var bcSdk = require('./fabcar/invoke')
var config = require('./config.json')
var crypto = require('crypto')
var fs = require('fs')
var cors = require('cors')
var mongoose = require('mongoose')
var Promises = require('promise')
var cloudinary = require('cloudinary')
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();
var path = require('path');
var uniqid = require('uniqid');
//var changeCase = require('change-case')
var login = require('./functions/login')
var captiveCreatePolicy = require('./functions/captiveCreatePolicy')
var notification = require('./functions/notification')
var captivePolicy = require('./functions/captivePolicy')
var notifypost = require('./functions/notifypost')
var notifyApprove = require('./functions/notifyApprove')
var getusernotification = require('./functions/getusernotification')
var count = 0;
var count1 = 0;
var count2=0;
const reguser = require('./models/registerInsurance');
var rating = 5;
//var getrating =rating-0.5;
var embercreatefunc = require('./functions/embercreatefunc')
var emberselectpolicy = require('./functions/emberselectpolicy')
var updatetpaember = require('./functions/updatetpaember')
var same = require('./functions/samerating')


module.exports = router => {

    //=================================================create discharge summary==============================================================//


    router.post('/submitClaim', cors(), async function (req, res) {
        var submitID = "";
        var policyid = req.body.policyid;
        var claimAmount = req.body.claimAmount;
        count2 = count2 + 1
        console.log("count", count2)
        var s = req.body
        var keys = [];
        for (var k in s) keys.push(k);
        var r = Object.values(s);
        //var sub;
        console.log("value", r)

        var possible = "0123456789674736728367382772898366377267489457636736273448732432642326734"
        for (var i = 0; i < 3; i++)

            submitID += (possible.charAt(Math.floor(Math.random() * possible.length))).toString();
        submitID = "FGI" + submitID
        console.log("submitId", submitID)
        var fieldvalid = 0;
        for (var k = 0; k < r.length; k++) {
            if (!r[k]) {
                fieldvalid = 1;
                res.send({
                    message: "Please enter" + keys[k] + " field"
                })

            }
        }

        if (fieldvalid == 0) {

            await contractJs.createContract(s, submitID, policyid,count2)
            //(NAME, AGE, HospitalName, DOA, REF_DOC, IPD_No, MLC, SEX, DOD, DAIGONIS, Cheif_Complaints_On_Admission, Past_History_with_Allergy, Personal_History, Family_History, Menstrual_History, Obstretric_History, Genral_Examination, Systematic_Examination, Investigations, BaBys_Details, Course_in_Hospital_And_condition, Treatment_Given, Treatment_Adviced, Follow_Up_Visit, Procedure_done, submitID, status, claimAmount, policyid)
            var userId = req.body.policyid;
            console.log("userId", userId);
            var exp = [];
            var rs = [];
            var result = await validate.validate(userId)
            console.log("re", result)
            if (result.status == 400) {
                res.send({
                    "message": "Please enter a valid policyid"
                })

            }
          //  for (var i = 0; i < result.docs[0].Records.rules.length; i++) {
                
                console.log("re", result.docs[0].Records.rules.length);
                var expression = result.docs[0].Records.rules;
                // console.log("userid", userId);
               // var result1 = await validate.validate(userId)
                // console.log("result....123>>>", result1.docs[0].Records);
                // var expression = result1.docs[0].Records;
                console.log("expression", expression);
                var TransactionDetails = {
                    "userid": "1",
                    "transactionstring": {
                        "exp": expression,
                        "value": Object.values(s),
                        "params": keys,
                        "function": "validatefunc"
                    }
                }

                var result2 = await savetransaction.evaluate(TransactionDetails)
                rs.push(result2);
                console.log("result", rs[0].result);
                var claimamount = rs[0].result;
            //}
            console.log("claimamt", claimAmount)
            await autotpa.autotpa(s, claimamount, claimAmount, submitID)

            res.send({
                "submitID": submitID,
                rs
            })
        }
    });

    //========================================validateClaim=========================================//

    router.post('/validateClaim', cors(), async function (req, res) {

        var userId = req.body.policyid;
        console.log("userId", userId);
        var exp = [];
        var rs = [];
        var result = await validate.validate(userId)
        console.log("re", result)
        for (var i = 0; i < result.docs[0].Records.policys.rules.length; i++) {
            console.log("re", result.docs[0].Records.policys.rules[i]);
            var userId = result.docs[0].Records.policys.rules[i];
            console.log("userid", userId);
            var result1 = await validate.validate(userId)
            console.log("result....123>>>", result1.docs[0].Records);
            var expression = result1.docs[0].Records;
            console.log("expression", expression);
            // var params = req.body.params;
            // console.log("params", params);
            // var expRep = expression.replace(/[^a-zA-Z ]/g, "")
            // var expArr = expRep.split(" ")
            // var duplicateParams = expArr.filter(Boolean)
            // var params = []
            // for (let i = 0; i < duplicateParams.length; i++) {
            //     if (params.indexOf(duplicateParams[i]) == -1) {
            //         params.push(duplicateParams[i])
            //     }
            // }
            // console.log(params)
            var TransactionDetails = {
                "userid": "1",
                "transactionstring": {
                    "exp": result1.docs[0].Records,
                    "value": req.body.value,
                    "params": params,
                    "function": "validatefunc"
                }
            }


            var result2 = await savetransaction.evaluate(TransactionDetails)
            rs.push(result2);
            console.log(rs);
        }
        res.send(rs)


    })

    //=====================Status Settlement==========================================================//

    router.get('/StatusSettlement', cors(), function (req, res) {

        tpaApproval.mock()
            .then(result => {
                console.log(result)
                res.status(result.status).json({
                    patients: result.patients
                });

            }).catch(err => res.status(err.status).json({
                message: err.message
            }))
    });


    //============================waitingforapproval==========================================  
    router.get('/waitingforapproval', cors(), function (req, res) {

        submitdata.mocks()
            .then(result => {
                console.log(result)
                res.status(result.status).json({
                    patients: result.patients
                });

            }).catch(err => res.status(err.status).json({
                message: err.message
            }))
    });

    //============================================RetrieveClaim===============================================//

   
    router.post('/retrieveClaim', (req, res) => {

        console.log("request UI>>>ui>>>", req.body);
        const userId = req.body.userId;
        console.log("userId", userId);

        getHistory.getHistory(userId)

            .then(result => {
                if (result.status == 400) {
                    res.send({
                        "message": "Please enter a valid ID"
                    })

                }
                console.log("result....123>>>", result);
                res.status(result.status).json({
                    result: result,

                })
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }).json({
                status: err.status
            }));
    })

    //======================================AutoApproveClaim===============================================//

    // router.post('/autoapproveclaim', cors(), (req, res) => {
    //     var submitID = req.body.submitID;
    //     var status = req.body.status;
    //     var message = req.body.message;
    //     var AmountuserHavetopay = req.body.AmountuserHavetopay;
    //     var AmountPayerWouldPay = req.body.AmountPayerWouldPay;

    //     updatetpa.updatetpa(submitID, status, message, AmountuserHavetopay, AmountPayerWouldPay)
    //         .then(result => {
    //             console.log(result)
    //             res.status(200).json({
    //                 message: "Details updated successfully"
    //             });
    //         }).catch(err => res.status(err.status).json({
    //             message: err.message
    //         }))



    //         .then(result => {
    //             console.log("result....", result)

    //         })
    // });
    // router.post('/autoapproveclaim', cors(), async function (req, res) {
    //     var policyid = req.body.policyid;
    //     var status = req.body.status;   
    //     var message = req.body.message;
    //    // var AmountuserHavetopay = req.body.AmountuserHavetopay;
    //    // var AmountPayerWouldPay = req.body.AmountPayerWouldPay;

    //     var result1 = await validate.validate(policyid)
    //     var patientData = result1.docs[0].Records.patientData
    //      console.log("patientData",result1.docs[0].Records.patientData)


    //     updatetpa.updatetpa(policyid,status,message,patientData)
    //         .then(result => {
    //             console.log(result)
    //             res.status(200).json({
    //                 message: "Details updated successfully",
    //                 result:result
    //             });
    //         }).catch(err => res.status(err.status).json({
    //             message: err.message
    //         }))
    //         .then(result => {
    //             console.log("result....", result)

    //         })
    // });

    router.post('/autoapproveclaim', cors(), async function (req, res) {
        var submitID = req.body.submitID;
        var status = req.body.status;
        var message = req.body.message;
        var AmountuserHavetopay = req.body.AmountuserHavetopay;
        var AmountPayerWouldPay = req.body.AmountPayerWouldPay;
 
        var result1 = await validate.validate(submitID)
        var patientData = result1.docs[0].Records.patientData
        console.log("patiendata", result1.docs[0].Records.patientData)
 
 
        updatetpa.updatetpa(patientData, submitID, status, message, AmountuserHavetopay, AmountPayerWouldPay)
            .then(result => {
                console.log(result)
                res.status(200).json({
                    message: "Details updated successfully"
                });
            }).catch(err => res.status(err.status).json({
                message: err.message
            }))
            .then(result => {
                console.log("result....", result)
 
            })
    });

    

    //======================================RetrieveBulkPatientRecords=====================================//


    router.get("/RetrieveBulkPatientRecords", cors(), (req, res) => {

        var startKey = 'FGI000';
        console.log("startKey", startKey);
        var endKey = 'FGI999';
        console.log("endKey--", endKey);

        getpatientdetails(startKey, endKey)
            .then(function (result) {

                console.log("  result.query1234..>>>", result.query);
                console.log("  result.querykey..>>>", result.query.Key);
                res.status(result.status).json({
                    message: result.query
                })
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));


    });



    //========================================CreateContract=============================================//

    router.post('/createpolicy', cors(), async function (req, res) {

        var policys = req.body;
        var policyName = req.body.policyName;
        console.log("UI", policyName);
        var policyid = "";
        policyid = uniqid();
        console.log("unique id", policyid)

        var rulesids = [];
        for (var i = 0; i < policys.rules.length; i++) {
            var expression = policys.rules[i];
            console.log("expression", expression);
            var TransactionDetails = {
                "userid": "1",
                "transactionstring": {
                    "exp": policys.rules[i],
                    "value": "",
                    "params": "",
                    "function": "validateExpression"
                }
            }
            var res1 = await savetransaction.evaluate(TransactionDetails)
            console.log("res1", res1)

            if (res1.result == "Valid") {
                var idasdd = "E" + uniqid();
                var idsObj = {
                    "id": idasdd,
                    "expression": policys.rules[i],
                    created_at: new Date()
                }
                console.log("idasdd", idasdd, idsObj);
                rulesids.push(idasdd);

                await createpolicy.policy1(idasdd, policys.rules[i])
                    .then(result => {
                        console.log("SADASD", result);
                    }).catch(err => res.status(err.status).json({
                        message: err.message
                    }))

                policys.rules = rulesids;
                console.log("rulesids", rulesids);
                var policyObj = {
                    "policyid": policys.policyid,
                    "policys": policys,
                    created_at: new Date()
                }
                createpolicy.policy1(policyid, policyObj)
                    .then(result => {
                        res.status(result.status).json({
                            "policyid": policyid,
                            "policyName": policyName,
                            message: result.message
                        });
                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
            } else {
                res.send({
                    "message": res1.result,
                    "comments": "please enter a valid expression"
                })
            }
        }
    });
//=========================================get group name start==================================================
router.post('/getGroupName', async (req, res) => {

    var result = await reguser.find({ groupname: req.body.groupname }, { _id: 0, name: 1 })
    // _id: 0, _v: 0, name: 1, address: 0, phoneNumber: 0, groupname: 0, email: 0, pwd: 0, rpwd: 0, captiveName: 0, parent: 0, employeeID: 0, captiveType: 0, entity: 0, organization: 0, captiveAddress: 0
    console.log(result)
    res.send(result);
});
//===============================================get group name ENd===========================================
    //====================================RetrieveContract====================================================//


    router.post("/retrieveContract", cors(), (req, res) => {

        console.log("request Id>>>ui>>>", req.body);
        const userId = req.body.userId;
        getpolicy1.getpolicy1(userId)
            .then(result => {
                console.log("result....123>>>", result);
                res.status(result.status).json({
                    result: result.docs,

                })
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }).json({
                status: err.status
            }));
    })



    //========================================EvaluateExpression========================================//

    router.post('/evaluateExpression', cors(), (req, res) => {

        var expression = req.body.expression;
        var params = req.body.params;

        var TransactionDetails = {
            "userid": "1",
            "transactionstring": {
                "exp": req.body.expression,
                "value": req.body.value,
                "params": req.body.params,
                "function": "validatefunc"
            }
        }
        savetransaction.evaluate(TransactionDetails)
            .then(function (result) {
                console.log(result)
                res.send(result);
            }).catch(err => res.status(err.status).json({
                message: err.message
            }));
    });


    //=====================================ValidateExpression==========================================//

    router.post('/validateExpression', cors(), (req, res) => {

        var expression = req.body.expression;
        var TransactionDetails = {
            "userid": "1",
            "transactionstring": {
                "exp": req.body.expression,
                "value": "",
                "params": "",
                "function": "validateExpression"
            }
        }
        savetransaction.evaluate(TransactionDetails)
            .then(function (result) {
                console.log(result)
                res.send(result);
            }).catch(err => res.status(err.status).json({
                message: err.message
            }));
    });

    // //---------------------------------------Registration-------------------------------------------------


    // router.post('/registerUser', cors(), (req, res) => {
    //     console.log("UI", req.body);

    //     const name = req.body.name;
    //     console.log(name);
    //     const address = req.body.address;
    //     console.log(address);
    //     const phoneNumber = req.body.phoneNumber;
    //     console.log(phoneNumber);
    //     const email = req.body.email;
    //     console.log(email);
    //     const password = req.body.pass;
    //     console.log(password);
    //     const pwd = crypto
    //         .createHash('sha256')
    //         .update(password)
    //         .digest('base64');
    //     console.log("pwd", pwd);//encryption
    //     const confirmpassword = req.body.repass;
    //     console.log(confirmpassword);

    //     const rpwd = crypto
    //         .createHash('sha256')
    //         .update(password)
    //         .digest('base64');
    //     console.log("pwd", rpwd);//encryption

    //     const captiveName = req.body.captiveName;
    //     console.log("captiveName", captiveName);
    //     const parent = req.body.parent;
    //     console.log("parent", parent);
    //     const employeeID = req.body.employeeID;
    //     console.log("employeeID", employeeID);
    //     const captiveType = req.body.captiveType;
    //     console.log("captiveType", captiveType);
    //     const entity = req.body.entity;
    //     console.log("entity", entity);
    //     const organization = req.body.organization;
    //     console.log("organization", organization);
    //     const captiveAddress = req.body.captiveAddress;
    //     console.log("captiveAddress", captiveAddress);


    //     if (!address || !phoneNumber || !email || !pwd || !rpwd || !captiveName || !parent || !employeeID || !captiveType || !entity || !organization || !captiveAddress) {
    //         res.status(400)
    //             .json({
    //                 message: 'Invalid Request !'
    //             });

    //     } else {

    //         registerUser.registerUser(name, address, phoneNumber, email, pwd, rpwd, captiveName, parent, employeeID, captiveType, entity, organization, captiveAddress)
    //             .then(result => {
    //                 if (result.status == 400) {
    //                     res.send({
    //                         "message": "Please enter a value"
    //                     })

    //                 }
    //                 console.log("result....123>>>", result);
    //                 res.status(result.status).json({
    //                     result: result,

    //                 })

    //                     .catch(err => res.status(err.status).json({
    //                         message: err.message
    //                     }).json({
    //                         status: err.status
    //                     }));

    //             })

    //     }



    // });
 //---------------------------------------Registration-------------------------------------------------


 router.post('/registerUser', cors(), (req, res) => {
    console.log("UI", req.body);

    const name = req.body.Name;
    console.log(name);
   
    const address = req.body.Address;
    console.log(address);
    const phoneNumber = req.body.Phone;
    console.log(phoneNumber);
    const groupID = req.body.groupname;
    const email = req.body.email;
    console.log(email);
    const password = req.body.Password;
    console.log(password);
    // const pwd = crypto
    //     .createHash('sha256')
    //     .update(password)
    //     .digest('base64');
    // console.log("pwd", pwd);//encryption
    // const retypepassword = req.body.repass;
    // console.log(retypepassword);

    // const rpwd = crypto
    //     .createHash('sha256')
    //     .update(password)
    //     .digest('base64');
    // console.log("pwd", rpwd);//encryption

    const captiveName = req.body.captiveName;
    console.log("captiveName", captiveName);
    const parent = req.body.parent;
    console.log("parent", parent);
    const employeeID = req.body.employeeID;
    console.log("employeeID", employeeID);
    const captiveType = req.body.captive;
    console.log("captiveType", captiveType);
    const entity = req.body.business;
    console.log("entity", entity);
    const organization = req.body.organization;
    console.log("organization", organization);
   


    if (!groupID ||!address || !phoneNumber || !email || !password  || !captiveName || !parent || !employeeID || !captiveType || !entity || !organization ) {
        res.status(400)
            .json({
                message: 'Invalid Request !'
            });

    } else {

        registerUser.registerUser(name,groupID, address, phoneNumber, email, password, captiveName, parent, employeeID, captiveType, entity, organization)
            .then(result => {
                if (result.status == 400) {
                    res.send({
                        "message": "Please enter a value"
                    })

                }
                console.log("result....123>>>", result);
                res.status(result.status).json({
                    result: result,

                })
            })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }).json({
                        status: err.status
                    }));

            

    }



});
 //======================================Create policy for ember create policy start===============================================//
//  router.post('/createpolicyember', cors(), (req, res) => {
//     console.log("UI", req.body);

//     // const policyid = req.body.policyid;
//     // console.log(policyId);
//     // var policyId = "";
//     // policyId = uniqid();
//     var policyid = ""
//     var possible = "0123456789674736728367382772898366377267489457636736273448732432642326734"
//     for (var i = 0; i < 3; i++)

//         policyid += (possible.charAt(Math.floor(Math.random() * possible.length))).toString();
//     policyid = "PCI" + policyid
//     console.log("unique id", policyid)
//     const policyname = req.body.policyName;
//     console.log(policyname);
//     const policycatagory = req.body.policycatagory;
//     console.log("policycatagory", policycatagory);
//     const rules = req.body.paymentrule;
//     console.log("rulesstyle", rules);

//     // const policypercentage = "50";


//     // const inputradio = "66"


//     if ( !policyname || !policycatagory || !rules ) {
//         res.status(400)
//             .json({
//                 message: 'Invalid Request !'
//             });

//     } else {

//         embercreatefunc.embercreatefunc(policyid, policyname, policycatagory, rules)
//             .then(result => {

//                 // if (result.status == 400) {
//                 //     res.send({
//                 //         "message": "Please enter a value",
//                 //         result: result
//                 //     })

//                 // }
//                 // console.log("result....123>>>", result);
//                 res.status(result.status).json({
//                     policyid: policyid,
//                     result: result.message,

//                 })

//                     .catch(err => res.status(err.status).json({
//                         message: err.message
//                     }).json({
//                         status: err.status
//                     }));


//             })


//     }
// });

router.post('/createpolicyember', cors(), (req, res) => {
   console.log("UI", req.body);

   // const policyid = req.body.policyid;
   // console.log(policyId);
   // var policyId = "";
   // policyId = uniqid();
   var policyid = ""
   var possible = "0123456789674736728367382772898366377267489457636736273448732432642326734"
   for (var i = 0; i < 3; i++)

       policyid += (possible.charAt(Math.floor(Math.random() * possible.length))).toString();
   policyid = "PCI" + policyid
   console.log("unique id", policyid)
   const policyName = req.body.policyname;
   console.log(policyName);
   const policycatagory = req.body.policycatagory;
   console.log("policycatagory", policycatagory);
   const rules = req.body.paymentrule;
   console.log("rulesstyle", rules);

//    const policypercentage = "50";


//    const inputradio = "66"


   if ( !policyName || !policycatagory || !rules ) {
       res.status(400)
           .json({
               message: 'Invalid Request !'
           });

   } else {

       embercreatefunc.embercreatefunc(policyid, policyName, policycatagory, rules)
           .then(result => {

               // if (result.status == 400) {
               //     res.send({
               //         "message": "Please enter a value",
               //         result: result
               //     })

               // }
               // console.log("result....123>>>", result);
               res.status(result.status).json({
                   policyid: policyid,
                   result: result.message,

               })

                   .catch(err => res.status(err.status).json({
                       message: err.message
                   }).json({
                       status: err.status
                   }));


           })


   }
});


//======================================Create policy for ember create policy END=================================


    //----------------------------------------Login---------------------------------------------------------//

    // router.post('/login', cors(), (req, res) => {
    //     console.log("entering login function in functions ");
    //     console.log(req.body)
    //     const email = req.body.email;
    //     console.log(email);
    //     const password = req.body.password;
    //     console.log(password);
    //     // const pwd = crypto
    //     //     .createHash('sha256')
    //     //     .update(password)
    //     //     .digest('base64');
    //     // console.log("pwd", pwd);//encryption


    //     login
    //         .login(email, password)
    //         .then(result => {
    //             console.log("resultharini", result);
    //             // console.log("logesh ===>>>", result.users.usertype)
    //             // console.log("Arjun ===>>>", result.users.firstname)


    //             res.send({
    //                 "message": "Login Successful",

    //                 "result": result

    //             });
    //             console.log("Route login Result", result)
    //         })
    //         .catch(err => res.status(err.status).json({
    //             message: err.message
    //         }).json({
    //             status: err.status
    //         }));

    // });

    //----------------------------------------Login---------------------------------------------------------//

    router.post('/login', cors(), (req, res) => {
        console.log("entering login function in functions ");
        console.log(req.body)
        const email = req.body.email;
        console.log(email);
        const password = req.body.password;
        console.log(password);
        // const pwd = crypto
        //     .createHash('sha256')
        //     .update(passwordid)
        //     .digest('base64');
        // console.log("pwd", pwd);//encryption


        login
            .login(email, password)
            .then(result => {
                console.log("resultharini", result);
                // console.log("logesh ===>>>", result.users.usertype)
                // console.log("Arjun ===>>>", result.users.firstname)


                res.send({
                    "message": "Login Successful",

                    "result": result

                });
                console.log("Route login Result", result)
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }).json({
                status: err.status
            }));

    });



    // router.post('/login',cors(),(req,res)=> {
   
    //     var email =req.body.email;
    //     console.log("email",email);
    //     var password=req.body.password;
    //     console.log("password",password);
    //     // var category=req.body.category;
    //     // console.log("category",category);
   
    //     login
    //      .login(email,password)
    //      .then(result => {   
    //         console.log("result ===>>>",result)
    //         console.log("hello")
    //         res.send({
    //             "message": "Login sucessfull",
    //             "status": true,
                
    //         });
   
    //     })
    //     .catch(err => res.status(err.status).json({
    //         message: err.message
    //     }).json({
    //         status: err.status
    //     }));
    // }
    // )
   
//=======================================ember tpa start========================
router.post('/autoapproveclaimember', cors(), async function (req, res) {
    var Bulkdata = req.body
    console.log("Bulkdata", Bulkdata)

    var InsurerID = req.body.insuredId;
    var claimAmount = req.body.claimAmount;
    var Amounttopay = req.body.Amounttopay;
    var Reason = req.body.Reason;
    var status = req.body.status;
   

    // var result1 = await validate.validate(submitID)
    // var patientData = result1.docs[0].Records.patientData
    // console.log("patiendata", result1.docs[0].Records.patientData)


    updatetpaember.updatetpaember(InsurerID, claimAmount, Amounttopay, Reason, status)
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "Details updated successfully"
            });
        }).catch(err => res.status(err.status).json({
            message: err.message
        }))
        .then(result => {
            console.log("result....", result)

        })
})
//=======================================ember tpa END========================


    //======================================Create policy for captive insurance start===============================================//
    router.post('/createpolicycaptive', cors(), (req, res) => {
        console.log("UI", req.body);

        // const policyid = req.body.policyid;
        // console.log(policyId);
        // var policyId = "";
        // policyId = uniqid();
        var policyid = ""
        var possible = "0123456789674736728367382772898366377267489457636736273448732432642326734"
        for (var i = 0; i < 3; i++)

            policyid += (possible.charAt(Math.floor(Math.random() * possible.length))).toString();
        policyid = "PCI" + policyid
        console.log("unique id", policyid)
        const policyName = req.body.policyName;
        console.log(policyName);
        const policycatagory = req.body.policycatagory;
        console.log(policycatagory);
        const rules = req.body.rules;
        console.log("rulesstyle", rules);

        const policypercentage = req.body.policypercentage;
        console.log("policypercentage..<<<", policypercentage);

        const inputradio = req.body.inputradio;
        console.log("inputradio....>", inputradio);

        if (!policyid || !policyName || !policycatagory || !rules || !policypercentage || !inputradio) {
            res.status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            captiveCreatePolicy.captiveCreatePolicy(policyid, policyName, policycatagory, rules, policypercentage, inputradio)
                .then(result => {

                    // if (result.status == 400) {
                    //     res.send({
                    //         "message": "Please enter a value",
                    //         result: result
                    //     })

                    // }
                    // console.log("result....123>>>", result);
                    res.status(result.status).json({
                        policyid: policyid,
                        result: result.message,

                    })

                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }).json({
                            status: err.status
                        }));


                })


        }
    });

    //======================================Create policy for captive insurance END=================================
    //=====================Notification==========================================================//

    // router.get('/Notification', cors(), function (req, res) {

    //     notification.notification()
    //         .then(result => {
    //             console.log(result)
    //             res.status(result.status).json({
    //                 patients: result.patients
    //             });

    //         }).catch(err => res.status(err.status).json({
    //             message: err.message
    //         }))
    // });

    router.get("/Notification", cors(), (req, res) => {

        var startKey = 'PCI000';
        console.log("startKey", startKey);
        var endKey = 'PCI999';
        console.log("endKey--", endKey);

        notification.notification(startKey, endKey)
            .then(function (result) {

                console.log("  result.query1234..>>>", result.query);
                // console.log("  result.querykey..>>>", result.query);
                res.status(result.status).json({
                    message: result.query
                })
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));


    });

//==========================================Underwriter====================================================//
router.post('/underwriter', cors(), async function (req, res) {
    var groupID = req.body.groupID;
    var claimAmount = req.body.claimAmount;
    var Amounttopay = req.body.Amounttopay;
    var Reason = req.body.Reason;
    var status = req.body.status;
   
    // var result1 = await validate.validate(InsurerID)
    // var rating = result1.docs[0].Records.Groupdetails.Rating
    if(status=="Approved"){
        rating  = rating-0.5;
        // getrating = rating
        console.log("Ratings",rating)
     //console.log("patiendata", result1.docs[0].Records.Groupdetails.Rating)
    updatetpa.updatetpa(groupID, claimAmount, Amounttopay, Reason, status,rating)
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "Details updated successfully"
            });
        }).catch(err => res.status(err.status).json({
            message: err.message
        }))
        .then(result => {
            console.log("result....", result)

        })
    }
    else{
        same.same(groupID, claimAmount, Amounttopay, Reason, status)
            .then(result => {
                console.log(result)
                res.status(200).json({
                    message: "Details updated successfully"
                });
            }).catch(err => res.status(err.status).json({
                message: err.message
            }))
            .then(result => {
                console.log("result....", result)
 
            }) 

    }
});

//==================================================rating==================================================//

router.get('/getRating', cors(), function (req, res) {
    console.log("get rating console", rating)
   
    res.send({
        "rating": rating
    })
})





    //======================================Notify create policy for captive insurance Start===============================================//
    router.post('/selectPolicy', cors(), (req, res) => {
        console.log("UI", req.body);

        const policyid = req.body.policyid;
        console.log(policyid);
        const policyName = req.body.policyName;
        console.log(policyName);
        const policycatagory = req.body.policycatagory;
        console.log(policycatagory);

        const policypercentage = req.body.policypercentage;
        console.log(policypercentage);

        const rules = req.body.rules;
        console.log(rules);

        const inputradio = req.body.inputradio;
        console.log("inputradio", inputradio);

        const status = "Initiated";
        console.log("Status..<<<", status);

        count = count + 1
        console.log("count", count)

        if (!policyid || !policyName || !policycatagory || !policypercentage || !rules || !inputradio || !status || !count) {
            res.status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            notifypost.notifypost(policyid, policyName, policycatagory, policypercentage, rules, inputradio, status, count)
                .then(result => {

                  
                    console.log("result....123>>>", result);
                    res.status(result.status).json({
                        result: result,

                    })
                })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }).json({
                            status: err.status
                        }));


                


        }
    });


    //======================================Notify create policy for captive insurance END===============================================//
    //======================================Notify Approve for captive insurance Start===============================================//
    // router.post('/notifyApprove', cors(), (req, res) => {
    //     console.log("UI", req.body);

    //     const policyid = req.body.policyid;
    //     console.log(policyid);
    //     const policyName = req.body.policyName;
    //     console.log(policyName);
    //     const policycatagory = req.body.policycatagory;
    //     console.log(policycatagory);

    //     const policypercentage = req.body.policypercentage;
    //     console.log(policypercentage);

    //     const rules = req.body.rules;
    //     console.log(rules);

    //     const inputradio = req.body.inputradio;
    //     console.log("inputradio", inputradio);

    //     const status = "Approved";
    //     console.log("Status..<<<", status);

    //     if (!policyid || !policyName || !policycatagory || !policypercentage || !rules || !inputradio || !status) {
    //         res.status(400)
    //             .json({
    //                 message: 'Invalid Request !'
    //             });

    //     } else {

    //         notifyApprove.notifyApprove(policyid, policyName, policycatagory, policypercentage, rules, inputradio, status)
    //             .then(result => {

                    
    //                 console.log("result....123>>>", result);
    //                 res.status(result.status).json({
    //                     result: result,

    //                 })
    //             })
    //                     .catch(err => res.status(err.status).json({
    //                         message: err.message
    //                     }).json({
    //                         status: err.status
    //                     }));


              


    //     }
    // });
    router.post('/notifyApprove', cors(), (req, res) => {
        console.log("UI", req.body);

        const policyid = req.body.policyid;
        console.log(policyid);
        const policyname = req.body.policyname;
        console.log(policyname);
        const policycatagory = req.body.policycatagory;
        console.log(policycatagory);

        // const policypercentage = req.body.policypercentage;
        // console.log(policypercentage);

        const rules = req.body.rules;
        console.log(rules);

        // const inputradio = req.body.inputradio;
        // console.log("inputradio", inputradio);

        const status = "Approved";
        console.log("Status..<<<", status);

        count1 = count1 + 1
        console.log("count", count1)

        if (!policyid || !policyname || !policycatagory  || !rules  || !status || !count1) {
            res.status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {
            updatenotifyember.updatenotifyember( status,policyid, policyname, policycatagory, rules,  count1)
            .then(result => {
                console.log(result)
                res.status(200).json({
                    message: "Details updated successfully",
                    //result:result
                });
            }).catch(err => res.status(err.status).json({
                message: err.message
            }))
            // .then(result => {
            //     console.log("result....", result)

            // })
    
            // notifyApprove.notifyApprove(policyid, policyName, policycatagory, policypercentage, rules, inputradio, status, count1)
            //     .then(result => {

                  
            //         console.log("result....123>>>", result);
            //         res.status(result.status).json({
            //             result: result,

            //         })
            //     })
            //             .catch(err => res.status(err.status).json({
            //                 message: err.message
            //             }).json({
            //                 status: err.status
            //             }));


                


        }
    });


    //======================================Notify Approve for captive insurance END===============================================//
//============================GET COUNT START==========================================
router.get('/getCount', cors(), function (req, res) {
    console.log("get count console", count)
    //res.sendStatus(count)
    //res.status(200).send(count)
    // result = count

    res.send({
        "count": count
    })
})
//============================================GET COUNT END===============================================//
//============================GET COUNT START==========================================
router.get('/getCount2', cors(), function (req, res) {
    console.log("get count console", count2)
    //res.sendStatus(count)
    //res.status(200).send(count)
    // result = count

    res.send({
        "count": count2
    })
})
//============================================GET COUNT END===============================================//
    //============================GET COUNT START==========================================
router.get('/getCount1', cors(), function (req, res) {
    console.log("get count1 console", count1)
    //res.sendStatus(count)
    //res.status(200).send(count)
    // result = count

    res.send({
        "count1": count1
    })
})
//============================================GET COUNT END===============================================//

    //=========================================Captive insurance get policy Start===========================
    // router.get('/getcaptivepolicy', cors(), function (req, res) {

    //     captivePolicy.getcaptivepolicydetails()
    //         .then(result => {
    //             console.log(result)
    //             res.status(result.status).json({
    //                 captivepolicydata: result
    //             });
    //             // console.log("manoj", hosp)

    //         }).catch(err => res.status(err.status).json({
    //             message: err.message
    //         }))
    // });
    //==========================================Captive insurance get policy END=============================

    router.get("/getcaptivepolicy", cors(), (req, res) => {

        var startKey = 'PCI000';
        console.log("startKey", startKey);
        var endKey = 'PCI999';
        console.log("endKey--", endKey);

        getcaptivepolicydetails.getcaptivepolicydetails(startKey, endKey)
            .then(function (result) {

                console.log("  result.query1234..>>>", result.query);
                // console.log("  result.querykey..>>>", result.query);
                res.status(result.status).json({
                    message: result.query
                })
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));


    });


    router.get("/getusernotification", cors(), (req, res) => {

       
        // getusernotification.getusernotification()
        //     .then(function (result) {

        //         // console.log("  result.query1234..>>>", result.query);
        //         // console.log("  result.querykey..>>>", result.query);
        //         res.status(result.status).json({
        //             message: result
        //         })
        //     })
        //     .catch(err => res.status(err.status).json({
        //         message: err.message
        //     }));
        var startKey = 'PCI000';
        console.log("startKey", startKey);
        var endKey = 'PCI999';
        console.log("endKey--", endKey);

        getusernotification.getusernotification(startKey, endKey)
            .then(function (result) {

                console.log("  result.query1234..>>>", result.query);
                // console.log("  result.querykey..>>>", result.query);
                res.status(result.status).json({
                    message: result.query
                })
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));


    });

    //======================================Notify create policy for ember Start===============================================//
    router.post('/selectPolicyember', cors(), (req, res) => {
        console.log("UI", req.body);

        const policyid = req.body.policyid;
        console.log(policyid);
        const policyname = req.body.policyname;
        console.log(policyname);
        const policycatagory = req.body.policycatagory;
        console.log(policycatagory);

        // const policypercentage = req.body.policypercentage;
        // console.log(policypercentage);

        const rules = req.body.rules;
        console.log(rules);

        // const inputradio = req.body.inputradio;
        // console.log("inputradio", inputradio);

        // const status = "Initiated";
        // console.log("Status..<<<", status);

        count = count + 1
        console.log("count", count)

        if (!policyid || !policyname || !policycatagory  || !rules || !count) {
            res.status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            emberselectpolicy.emberselectpolicy(policyid, policyname, policycatagory, rules, count)
                .then(result => {


                    console.log("result....123>>>", result);
                    res.status(result.status).json({
                        result: result,

                    })
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }).json({
                    status: err.status
                }));





        }
    });


    //======================================Notify create policy for ember END===============================================//   



}