'use strict';

var crypto = require('crypto');
var patientData = require("../models/patientData")
var Tpa = require("../models/Tpa")
var bcSdk = require('../fabcar/invoke')


var fs = require("fs")
var jsonfile = require('jsonfile')
var file = require("../payerInsuree.json")
var file1 = require("../payer_provider.json")
var uniqid = require('uniqid');

var report;



exports.mock = (obj) => {
    console.log("1");
    return new Promise(async (resolve, reject) => {
        console.log("2");

        let result = await patientData.find({"status": "initiated"})

        console.log("result.length",result)
        for (let i = 0; i < result.length; i++) 
        {
            var str = (JSON.stringify(result[i]._doc.patientData));
            console.log("str=========================>", str);
            const rapidID = crypto.createHash('sha256').update(str).digest('base64');
            var submitID = uniqid();
            console.log("submitID", submitID)
            var HospitalName = result[i]._doc.HospitalName;


            //===========================if the total bill is less than preproposed amount then check of each hospital===========================//            
            if (result[i].TotalClaimedAmount <= file.CoverageAmt && result[i].TotalClaimedAmount <= file.preproposedAmt) {

                console.log("bill less than equal to preproposed amount", result[i].TotalClaimedAmount <= file.CoverageAmt && result[i].TotalClaimedAmount <= file.preproposedAmt)

                var transferObj = {
                    "id": result[i].id,
                    "rapidID": rapidID,
                    "submitID": submitID,
                    "message": "Auto Approved",
                    "status": "Auto Approved"
                }

                if (HospitalName == "Fortis") {

                    var string = JSON.stringify(transferObj)
                    console.log("string========================>", string)
                   
                    var data = new Tpa({
                        "transactionstring": result[i]._doc.patientData,
                        "HospitalName": result[i]._doc.HospitalName,
                        "status": "Auto approved",
                        "submitID": submitID,
                        "rapidID": rapidID,
                        "message": "Payment process initiated",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": result[i]._doc.TotalClaimedAmount * 0.8,
                        "AmountuserHavetopay": result[i]._doc.TotalClaimedAmount * 0.2,
                        created_at: new Date()
                    });

                    var recordhkj = {"TransactionDetails": {
                        "transactionstring": result[i]._doc.patientData,
                        "HospitalName": result[i]._doc.HospitalName,
                        "status": "Auto approved",
                        "submitID": submitID,
                        "rapidID": rapidID,
                        "message": "Payment process initiated",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": result[i]._doc.TotalClaimedAmount * 0.8,
                        "AmountuserHavetopay": result[i]._doc.TotalClaimedAmount * 0.2,
                        created_at: new Date(),
                        "userId": submitID
                    }}
                        console.log(recordhkj,"record123");
                    data.save()
                    .then(
                    bcSdk.savetransaction(recordhkj))
                    .then(
                    resolve(patientData.remove({
                            _id: result[i].id
                        })))
                        


                }


               

                if (HospitalName == "Apollo") {
                    var string = JSON.stringify(transferObj)
                    console.log("string in apollo========================>", string)
                        
                    
                   
                    var data = new Tpa({
                        "transactionstring": result[i]._doc.patientData,
                        "HospitalName": result[i]._doc.HospitalName,
                        "status": "Auto approved",
                        "submitID": submitID,
                        "rapidID": rapidID,
                        "userId": "",
                        "message": "Payment process initiated",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": result[i]._doc.TotalClaimedAmount * 0.8,
                        "AmountuserHavetopay": result[i]._doc.TotalClaimedAmount * 0.2,
                        created_at: new Date()
                    });

                    var recordhkj = {"TransactionDetails": {
                        "transactionstring": result[i]._doc.patientData,
                        "HospitalName": result[i]._doc.HospitalName,
                        "status": "Auto approved",
                        "submitID": submitID,
                        "rapidID": rapidID,
                        "message": "Payment process initiated",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": result[i]._doc.TotalClaimedAmount * 0.8,
                        "AmountuserHavetopay": result[i]._doc.TotalClaimedAmount * 0.2,
                        created_at: new Date(),
                        "userId": submitID
                    }}
                        console.log(recordhkj,"record123");
                    data.save()
                    .then(
                    bcSdk.savetransaction(recordhkj))
                    .then(
                    resolve(patientData.remove({
                            _id: result[i].id
                        })))
                   
                
                    resolve({
                        message: "Success"
                    })

                }


            }
            //===========================if patients data is 10% more than preproposed amount============================================================//
            if (result[i].TotalClaimedAmount <= file.CoverageAmt && ((result[i].TotalClaimedAmount) <= (file.preproposedAmt + file.preproposedAmt * 0.1)) && (result[i].TotalClaimedAmount > file.preproposedAmt)) {
                console.log("if the amt is greater but less than 10%", result[i].TotalClaimedAmount <= file.CoverageAmt && ((result[i].TotalClaimedAmount) <= (file.preproposedAmt + file.preproposedAmt * 0.1)) && (result[i].TotalClaimedAmount > file.preproposedAmt))

                if (HospitalName == "Fortis") {
                    var data = new Tpa({
                        "transactionstring": result[i]._doc.patientData,
                        "status": "Waiting for Tpa approval(24hr)",
                        "HospitalName": result[i]._doc.HospitalName,
                        "submitID": submitID,
                        "userId": "",
                        "rapidID": rapidID,
                        "message": "",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": file.preproposedAmt * 0.8,
                        "AmountuserHavetopay": file.preproposedAmt * 0.2 + (result[i]._doc.TotalClaimedAmount - file.preproposedAmt),

                        created_at: new Date()
                    });

                    var recordhkj = {"TransactionDetails": {
                        "transactionstring": result[i]._doc.transactionstring,
                        "HospitalName": result[i]._doc.HospitalName,
                        "status": "Auto approved",
                        "submitID": submitID,
                        "rapidID": rapidID,
                        "message": "Payment process initiated",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": result[i]._doc.TotalClaimedAmount * 0.8,
                        "AmountuserHavetopay": result[i]._doc.TotalClaimedAmount * 0.2,
                        created_at: new Date(),
                        "userId": submitID
                    }}
                        console.log(recordhkj,"record123");
                    data.save()
                    .then(
                    bcSdk.savetransaction(recordhkj))
                    .then(
                    resolve(patientData.remove({
                            _id: result[i].id
                        })))
                    
                }
                
                
                


                if (HospitalName == "Apollo") {
                    var data = new Tpa({
                        "transactionstring": result[i]._doc.patientData,
                        "HospitalName": result[i]._doc.HospitalName,
                        "status": "Waiting for Tpa approval(24hr)",
                        "submitID": submitID,
                        "userId": "",
                        "rapidID": rapidID,
                        "message": "",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": file.preproposedAmt,
                        "AmountuserHavetopay": (result[i]._doc.TotalClaimedAmount - file.preproposedAmt),
                        created_at: new Date()
                    });

               
                 }
                var recordhkj = {"TransactionDetails": {
                    "transactionstring": result[i]._doc.patientData,
                    "HospitalName": result[i]._doc.HospitalName,
                    "status": "Auto approved",
                    "submitID": submitID,
                    "rapidID": rapidID,
                    "message": "Payment process initiated",
                    "Expenses": result[i].TotalClaimedAmount,
                    "AmountPayerWouldPay": result[i]._doc.TotalClaimedAmount * 0.8,
                    "AmountuserHavetopay": result[i]._doc.TotalClaimedAmount * 0.2,
                    created_at: new Date(),
                    "userId": submitID
                }}
                    console.log(recordhkj,"record123");
                data.save()
                .then(
                bcSdk.savetransaction(recordhkj))
                .then(
                resolve(patientData.remove({
                        _id: result[i].id
                    })))

            }

            if (result[i].TotalClaimedAmount <= file.CoverageAmt && (result[i].TotalClaimedAmount > file.preproposedAmt)) {
                console.log("when amount is way out of range", (result[i].TotalClaimedAmount <= file.CoverageAmt && (result[i].TotalClaimedAmount > file.preproposedAmt)))
                if (HospitalName == "Fortis") {
                    var data = new Tpa({
                        "transactionstring": result[i]._doc.patientData,
                        "status": "Waiting for Tpa approval",
                        "HospitalName": result[i]._doc.HospitalName,
                        "submitID": submitID,
                        "rapidID": rapidID,
                        "userId": "",
                        "message": "",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": file.preproposedAmt * 0.8,
                        "AmountuserHavetopay": file.preproposedAmt * 0.2 + (result[i]._doc.TotalClaimedAmount - file.preproposedAmt),
                        created_at: new Date()
                    });

                    

                    var recordhkj = {"TransactionDetails": {
                        "transactionstring": result[i]._doc.patientData,
                        "HospitalName": result[i]._doc.HospitalName,
                        "status": "Auto approved",
                        "submitID": submitID,
                        "rapidID": rapidID,
                        "message": "Payment process initiated",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": result[i]._doc.TotalClaimedAmount * 0.8,
                        "AmountuserHavetopay": result[i]._doc.TotalClaimedAmount * 0.2,
                        created_at: new Date(),
                        "userId": submitID
                    }}
                        console.log(recordhkj,"record123");
                    data.save()
                    .then(
                    bcSdk.savetransaction(recordhkj))
                    .then(
                    resolve(patientData.remove({
                            _id: result[i].id
                        })))
                }


                if (HospitalName == "Apollo") {
                    var data = new Tpa({
                        "transactionstring": result[i]._doc.patientData,
                        "status": "Waiting for Tpa approval",
                        "HospitalName": result[i]._doc.HospitalName,
                        "submitID": submitID,
                        "userId": "",
                        "rapidID": rapidID,
                        "message": "",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": file.preproposedAmt,
                        "AmountuserHavetopay": (result[i]._doc.TotalClaimedAmount - file.preproposedAmt),
                        created_at: new Date()
                    });
                   

                    var recordhkj = {"TransactionDetails": {
                        "transactionstring": result[i]._doc.patientData,
                        "HospitalName": result[i]._doc.HospitalName,
                        "status": "Auto approved",
                        "submitID": submitID,
                        "rapidID": rapidID,
                        "message": "Payment process initiated",
                        "Expenses": result[i].TotalClaimedAmount,
                        "AmountPayerWouldPay": result[i]._doc.TotalClaimedAmount * 0.8,
                        "AmountuserHavetopay": result[i]._doc.TotalClaimedAmount * 0.2,
                        created_at: new Date(),
                        "userId": submitID
                    }
                        }
                        console.log(recordhkj,"record123");
                    data.save()
                    .then(
                    bcSdk.savetransaction(recordhkj))
                    .then(
                    resolve(patientData.remove({
                            _id: result[i].id
                        })))
                }

            }
        }

        resolve({
            "status": 200,
            "message": "dataset completed waiting for new dataset"
        })

    })

}



