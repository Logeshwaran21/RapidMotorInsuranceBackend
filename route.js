'use strict';

var tpaApproval = require("./functions/Tpaapproval.js")
var validate = require("./functions/validate.js");
const contractJs = require('./functions/contract')
const getpatientdetails = require('./functions/getpatientdetails')
const getHistory = require('./functions/getHistory')
const updatetpa = require('./functions/updatetpa')
const autotpa = require('./functions/autotpa')
const createpolicy = require('./functions/policy1')
const getpolicy1 = require('./functions/getpolicy1')
const savetransaction = require('./functions/savetransaction')
const submitdata= require('./functions/submitdata');
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
var uniqid = require('uniqid')
var changeCase = require('change-case')



module.exports = router => {

    //=================================================create discharge summary==============================================================//


    router.post('/submitClaim', cors(), async function(req, res) {
        var submitID = "";
        var policyId=req.body;
        var claimAmount=req.body.claimAmount;
        var s = req.body
        var keys = [];
        for (var k in s) keys.push(k);
        var r = Object.values(s);
        // Object.entries(s);
        // console.log("map", Object.entries(s))
        console.log("value", r)
        // for (var i = 0; i < keys.length; i++){
        //     console.log("key=========>",req.body.keys[i])

        //     if(!req.body.keys[i] && req.body.keys[i].trim()){
        //         console.log("please fill the "+req.body.keys[i])
        //     }else{
        //         console.log("success")
        //     }
        // }
            
        var possible = "0123456789674736728367382772898366377267489457636736273448732432642326734"
        for (var i = 0; i < 3; i++)

         submitID += (possible.charAt(Math.floor(Math.random() * possible.length))).toString();
        console.log("submitId" + submitID)

        // if(!r || r.trim()){
    //    if (!NAME.trim() || !AGE.trim() || !DOA.trim() || !REF_DOC.trim() || !IPD_No.trim() || !MLC || !SEX.trim() || !DOD.trim() || !DAIGONIS.trim() || !Cheif_Complaints_On_Admission.trim() || !Past_History_with_Allergy.trim() || !Personal_History.trim() || !Family_History.trim() || !Menstrual_History.trim() || !Obstretric_History.trim() || !Genral_Examination.trim() || !Systematic_Examination.trim() || !Investigations.trim() || !BaBys_Details.trim() || !Course_in_Hospital_And_condition.trim() || !Treatment_Given.trim() || !Treatment_Adviced.trim() || !Follow_Up_Visit.trim() || !Procedure_done.trim() || !HospitalName.trim() || !status.trim() || !claimAmount.trim() || !policyId.trim()) {

            // res.status(400)

            //     .json({
            //         message: 'Please enter the details completely !'
            //     });

        //  } else {

            await contractJs.createContract(keys,s,submitID,policyId)
            //(NAME, AGE, HospitalName, DOA, REF_DOC, IPD_No, MLC, SEX, DOD, DAIGONIS, Cheif_Complaints_On_Admission, Past_History_with_Allergy, Personal_History, Family_History, Menstrual_History, Obstretric_History, Genral_Examination, Systematic_Examination, Investigations, BaBys_Details, Course_in_Hospital_And_condition, Treatment_Given, Treatment_Adviced, Follow_Up_Visit, Procedure_done, submitID, status, claimAmount, policyId)
            var userId = req.body.policyId;
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
                                var TransactionDetails = {
                    "userid": "1",
                    "transactionstring": {
                        "exp": result1.docs[0].Records,
                        "value": Object.values(s),
                        "params": keys,
                        "function": "validatefunc"
                    }
                }

                var result2 = await savetransaction.evaluate(TransactionDetails)
                rs.push(result2);
                console.log("result", rs[0].result);
                var claimamount = rs[0].result;
            }
            console.log("claimamt",claimAmount)
            await autotpa.autotpa(keys,s,claimamount,claimAmount,submitID)

            res.send({
                "submitID": submitID,
                rs
            })
        // }


    });


    //========================================validateClaim=========================================//

    router.post('/validateClaim', cors(), async function(req, res) {

        var userId = req.body.policyId;
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
            var params = req.body.params;
            console.log("params", params);
            var expRep = expression.replace(/[^a-zA-Z ]/g, "")
            var expArr = expRep.split(" ")
            var duplicateParams = expArr.filter(Boolean)
            var params = []
            for (let i = 0; i < duplicateParams.length; i++) {
                if (params.indexOf(duplicateParams[i]) == -1) {
                    params.push(duplicateParams[i])
                }
            }
            console.log(params)
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

    router.get('/StatusSettlement', cors(), function(req, res) {

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
//==============================waitingforapproval================================================//
 router.get('/waitingforapproval', cors(), function(req, res) {

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


    //======================================AutoApproveClaim===============================================//

    router.post('/autoapproveclaim', cors(), (req, res) => {
        var submitID = req.body.submitID;
        var status = req.body.status;
        var message = req.body.message;
        var AmountuserHavetopay = req.body.AmountuserHavetopay;
        var AmountPayerWouldPay = req.body.AmountPayerWouldPay;

        updatetpa.updatetpa(submitID, status, message, AmountuserHavetopay, AmountPayerWouldPay)
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

        var startKey = '000';
        console.log("startKey", startKey);
        var endKey = '999';
        console.log("endKey--", endKey);

        getpatientdetails
            .getpatientdetails(startKey, endKey)
            .then(function(result) {

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

    router.post('/createpolicy', cors(), async function(req, res) {

        var policys = req.body;
        console.log("UI", policys);
        var policyID = policys.policyID;
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
                    "policyID": policys.policyID,
                    "policys": policys,
                    created_at: new Date()
                }
                createpolicy.policy1(policyID, policyObj)
                    .then(result => {
                        res.status(result.status).json({
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
            .then(function(result) {
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
            .then(function(result) {
                console.log(result)
                res.send(result);
            }).catch(err => res.status(err.status).json({
                message: err.message
            }));
    });
}
