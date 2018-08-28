'use strict';
var crypto = require('crypto');
var fs = require('fs');
var cors = require('cors');
const contractJs = require('./functions/contract');
var bcSdk = require('./fabcar/invoke');
const getpatientdetails = require('./functions/getpatientdetails');
var validate = require("./functions/validate.js");
const getHistory = require('./functions/getHistory');
const updatetpa = require('./functions/updatetpa');
const tpaapproval= require('./functions/tpaapproval');
const autotpa = require('./functions/autotpa');
const createpolicy = require('./functions/policy1');
const getpolicy1 = require('./functions/getpolicy1');
const savetransaction = require('./functions/savetransaction');
var cors = require('cors');
var mongoose = require('mongoose');
var Promises = require('promise');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
var uniqid = require('uniqid')
module.exports = router => {
    //=============================================create discharge summary==============================================================//
    router.post('/submitClaim', cors(), async function(req, res) {

        var NAME = req.body.NAME;
        var AGE = req.body.AGE;
        var DOA = req.body.DOA;
        var REF_DOC = req.body.REF_DOC;
        var IPD_No = req.body.IPD_No;
        var MLC = req.body.MLC;
        var SEX = req.body.SEX;
        var DOD = req.body.DOD;
        var DAIGONIS = req.body.DAIGONIS;
        var Cheif_Complaints_On_Admission = req.body.Cheif_Complaints_On_Admission;
        var Past_History_with_Allergy = req.body.Past_History_with_Allergy;
        var Personal_History = req.body.Personal_History;
        var Family_History = req.body.Family_History;
        var Menstrual_History = req.body.Menstrual_History;
        var Obstretric_History = req.body.Obstretric_History;
        var Genral_Examination = req.body.Genral_Examination;
        var Systematic_Examination = req.body.Systematic_Examination;
        var Investigations = req.body.Investigations;
        var BaBys_Details = req.body.BaBys_Details;
        var Course_in_Hospital_And_condition = req.body.Course_in_Hospital_And_condition;
        var Treatment_Given = req.body.Treatment_Given;
        var Treatment_Adviced = req.body.Treatment_Adviced;
        var Follow_Up_Visit = req.body.Follow_Up_Visit;
        var Procedure_done = req.body.Procedure_done;
        var HospitalName = req.body.HospitalName;
        var submitID = "";
        var status = req.body.status;
        const claimAmount = req.body.claimAmount;
        var policyId = req.body.policyId;
        console.log("claimAmount", claimAmount);
        var possible = "0123456789674736728367382772898366377267489457636736273448732432642326734"
        for (var i = 0; i < 3; i++)

            submitID += (possible.charAt(Math.floor(Math.random() * possible.length))).toString();
        console.log("submitId" + submitID)

         if (!NAME.trim() || !AGE || !DOA.trim() || !REF_DOC.trim() || !IPD_No || !MLC || !SEX.trim() || !DOD.trim() || !DAIGONIS.trim() || !Cheif_Complaints_On_Admission.trim() || !Past_History_with_Allergy.trim() || !Personal_History.trim() || !Family_History.trim() || !Menstrual_History.trim() || !Obstretric_History.trim() || !Genral_Examination.trim() || !Systematic_Examination.trim() || !Investigations.trim() || !BaBys_Details.trim() || !Course_in_Hospital_And_condition.trim() || !Treatment_Given.trim() || !Treatment_Adviced.trim() || !Follow_Up_Visit.trim() || !Procedure_done.trim() || !HospitalName.trim() || !status.trim() || !claimAmount || !policyId.trim()) {
         //   if (!NAME==""|| !AGE==undefined|| !DOA=="" || !REF_DOC=="" || !IPD_No==undefined || !MLC==undefined || !SEX=="" || !DOD=="" || !DAIGONIS=="" || !Cheif_Complaints_On_Admission=="" || !Past_History_with_Allergy=="" || !Personal_History=="" || !Family_History=="" || !Menstrual_History=="" || !Obstretric_History=="" || !Genral_Examination=="" || !Systematic_Examination=="" || !Investigations=="" || !BaBys_Details=="" || !Course_in_Hospital_And_condition=="" || !Treatment_Given=="" || !Treatment_Adviced=="" || !Follow_Up_Visit=="" || !Procedure_done=="" || !HospitalName=="" || !status=="" || !claimAmount==undefined || !policyId=="") {
            
            
            res
                .status(400)
                .json({
                    message: 'Please enter the details completely !'
                });

        } else {

            await contractJs.createContract(NAME, AGE, DOA, REF_DOC, IPD_No, MLC, SEX, DOD, DAIGONIS, Cheif_Complaints_On_Admission, Past_History_with_Allergy, Personal_History, Family_History, Menstrual_History, Obstretric_History, Genral_Examination, Systematic_Examination, Investigations, BaBys_Details, Course_in_Hospital_And_condition, Treatment_Given, Treatment_Adviced, Follow_Up_Visit, Procedure_done,  HospitalName, submitID, status, claimAmount, policyId)
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
                var expRep = expression.replace(/[^a-z]/g, "")
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
                        "value": [req.body.claimAmount,req.body.NAME, req.body.AGE, req.body.DOA, req.body.REF_DOC, req.body.IPD_No, req.body.MLC, req.body.SEX, req.body.DOD, req.body.DAIGONIS, req.body.Cheif_Complaints_On_Admission, req.body.Past_History_with_Allergy, req.body.Personal_History, req.body.Family_History, req.body.Menstrual_History, req.body.Obstretric_History, req.body.Genral_Examination, req.body.Systematic_Examination, req.body.Systematic_Examination, req.body.Investigations, req.body.BaBys_Details, req.body.Course_in_Hospital_And_condition, req.body.Treatment_Given, req.body.Treatment_Adviced, req.body.Follow_Up_Visit, req.body.Procedure_done, req.body.HospitalName, req.body.status, req.body.policyId ],
                        "params": ["claimAmount","NAME", "AGE", "DOA", "REF_DOC", "IPD_No", "MLC", "SEX", "DOD", "DAIGONIS", "Cheif_Complaints_On_Admission", "Past_History_with_Allergy", "Personal_History", "Family_History", "Menstrual_History", "Obstretric_History", "Genral_Examination", "Systematic_Examination", "Investigations", "BaBys_Details", "Course_in_Hospital_And_condition", "Treatment_Given", "Treatment_Adviced", "Follow_Up_Visit", "Procedure_done", "HospitalName", "status", "policyId"],
                        "function": "validatefunc"
                    }
                }
                var result2 = await savetransaction.evaluate(TransactionDetails)
                rs.push(result2);
                console.log("result", rs[0].result);
                var claimamount = rs[0].result;
            }
            await autotpa.autotpa(NAME, AGE, DOA, REF_DOC, IPD_No, MLC, SEX, DOD, DAIGONIS, Cheif_Complaints_On_Admission, Past_History_with_Allergy, Personal_History, Family_History, Menstrual_History, Obstretric_History, Genral_Examination, Systematic_Examination, Investigations, BaBys_Details, Course_in_Hospital_And_condition, Treatment_Given, Treatment_Adviced, Follow_Up_Visit, Procedure_done, submitID, policyId ,HospitalName, status, claimamount, claimAmount)
            res.send({
                "submitID": submitID,
                rs
            })
        }
    });



    //=================validateClaim=========================================//
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



    //==========================Tpa=====================================================================//
    router.get('/StatusSettlement', cors(), function(req, res) {

        tpaapproval.mock()
            .then(result => {
                console.log(result)
                res.status(result.status).json({
                    patients: result.patients
                });

            }).catch(err => res.status(err.status).json({
                message: err.message
            }))
    });




    //===================retrieveClaim=================================================// 


    router.post('/retrieveClaim', (req, res) => {
        console.log("requ...123>>>ui>>>", req.body);
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


                console.log("7", rulesids);
                policys.rules = rulesids;
                console.log("5");
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
    //=============================retrieveContract=======================//

    router.post("/retrieveContract", cors(), (req, res) => {


        console.log("requ...123>>>ui>>>", req.body);
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