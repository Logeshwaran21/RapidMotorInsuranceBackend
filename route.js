'use strict';


//const registerUser = require('./functions/registerUser');
const smartContract = require('./functions/smartContract');
var crypto = require('crypto');
var fs = require('fs');
var cors = require('cors');
var tpaApproval = require("./functions/Tpaapproval.js");
var validate = require("./functions/validate.js");
const contractJs = require('./functions/contract');
const payer = require("./functions/payer");
var bcSdk = require('./fabcar/invoke');
var config = require('./config.json')
var oneday = require('./functions/oneday')
const getpatientdetails = require('./functions/getpatientdetails');
const Policyrules = require('./functions/Policyrules');
const getHistory = require('./functions/getHistory');
const updatetpa = require('./functions/updatetpa');
const updatetransaction = require('./functions/updatetransaction');
const savetransaction = require('./functions/savetransaction');
//const readIndex = require('./functions/readIndex');
//const providerContract = require('./functions/provider');
const createpolicy = require('./functions/policy1');
const getpolicy1 = require('./functions/getpolicy1');


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
router.post('/providerContract', cors(), function(req, res) {
    console.log("enter");
    var providername = req.body.providername;
    // var HospitalName=req.body.HospitalName;
    var userId = req.body.providerid;
    var clauses = req.body.clauses;
    // var claimamount=req.body.claimamount;
    // var claimdate = req.body.claimdate;
    console.log("1");
    providerContract.provider(providername, userId, clauses)
        .then(result => {
            res.send({

                "userId": providerid,
                "message": "Claim Details uploaded Successfully"



            });

        })
        .catch(err => res.status(err.status).json({
            message: err.message
        }))
})
router.post('/submitClaim', cors(), function(req, res) {

    var conditions = req.body.patientData;
    var HospitalName = req.body.HospitalName;
    var submitID = " ";
    var status = req.body.status;
    var TotalClaimedAmount = req.body.TotalClaimedAmount;
    var possible = "0123456789674736728367382772898366377267489457636736273448732432642326734"
    for (var i = 0; i < 3; i++)

        submitID += (possible.charAt(Math.floor(Math.random() * possible.length))).toString();


    console.log("userId" + submitID)
    if (!conditions || !HospitalName.trim() || !status.trim() || !TotalClaimedAmount) {

        res
            .status(400)
            .json({
                message: 'Please enter the details completely !'
            });

    }
    else {

    contractJs.createContract(conditions, HospitalName, submitID, status, TotalClaimedAmount)
    .then(result => {
        res.send({
            "message": "Patient details saved",
            "status": true,
            
            "submitID":submitID
        });


              
            })
        .catch(err => res.status(err.status).json({
            message: err.message
        }))
    }
});

//============================================mock weather====================================================//         
router.post('/validate', (req, res) => {
    console.log("requ...123>>>ui>>>", req.body);
    const userId = req.body.userId;
    console.log("userId", userId);


    validate.validate(userId)
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

//=================validateClaim=========================================//
router.post('/validateClaim', cors(), async function (req, res)  {
    //console.log("requ...123>>>ui>>>",req.body);
    var userId = req.body.policyId;
    console.log("userId", userId);
    var exp = [];
    var rs=[];
     var result = await validate.validate(userId)
    console.log("re",result)
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
                        var TransactionDetails = {
                            "userid": "1",
                            "transactionstring": {
                                "exp": result1.docs[0].Records,
                                "value": req.body.value,
                                "params": req.body.params
                            }
                        }
                        
                    
                        var result2= await savetransaction.evaluate(TransactionDetails)
                        rs.push(result2);
                        console.log(rs);
            }
        res.send(rs)
           


})
//=========================================================================//

router.post('/Policy', (req, res) => {
    const policyId = req.body.policyId;
    const policydate_date = req.body.policydate_date;
    const provider = req.body.provider;
    var rules = req.body.rules;
    console.log("PolicyId", policyId);
    console.log("policydate_date", policydate_date);
    console.log("provider", provider);
    console.log("rules", rules);


    Policyrules.Policyrules(policyId, policydate_date, provider, rules)
        .then(result => {

            res.status(200).json({
                message: "conditions satisfied for the users below"
            });

        }).catch(err => res.status(err.status).json({
            message: err.message
        }))
});




router.get('/validate', cors(), function(req, res) {

    // var HospitalName= req.body.HospitalName;
    var jsonfile = require('jsonfile')
    var file = './payer_provider.json'
    jsonfile.readFile(file, function(err, obj) {
        if (err) {
            res.send({
                "code": 404,
                "message": "no contract created yet",
                "error": err
            })
        }


        smartContract.mock(obj)
            .then(result => {
                console.log(result)
                res.status(200).json({
                    message: "conditions satisfied for the users below"
                });

            }).catch(err => res.status(err.status).json({
                message: err.message
            }))
    })


});




//==========================Tpa=====================================================================//
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

//===========================tpa changing status=========================================================//
router.post('/Tpaupdate', cors(), function(req, res) {
    var status = req.body.status;
    var id = req.body.id;
    var message = req.body.message;

    tpaNem.mocknem(status, id, message)
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "dataset triggered "
            });
        }).catch(err => res.status(err.status).json({
            message: err.message
        }))
});

//====================================payer page=============================================//
router.get('/payerpay', cors(), function(req, res) {

    payer.mock()
        .then(result => {
            console.log(result)
            res.status(result.status).json({
                patients: result.message
            });

        }).catch(err => res.status(err.status).json({
            message: err.message
        }))
});
//=======================================fortis dashboard api====================================================//
router.post("/HospitalDashboard", cors(), function(req, res) {
    var HospitalName = req.body.HospitalName;
    Hospital.DashBoard(HospitalName).then(reports => {
        res.send({
            "status": 200,
            "patients": reports.message
        })
    })
})

//=========================================24hrs trigger===============================================//
router.get("/24hrs", cors(), (req, res) => {
    oneday.oneday().then((results) => {
        console.log(results)
        res.send({
            "status": 200,
            "message": results.message
        })
    })
})
//===============================history api==============================================================//
router.post("/history", cors(), (req, res) => {
    var id = req.body.id
    recordHistory.history(id).then(result => {

        console.log(result)
        res.status(result.status).json({
            history: result.message
        });

    }).catch(err => res.status(err.status).json({
        message: err.message
    }))
});
//=================update discharge summary=======================================//
router.post("/updateDischargeSummary", cors(), (req, res) => {
    var id = req.body.id
    updateDischargeSummary.update(id).then(result => {

        console.log(result)
        res.status(result.status).json({
            history: result.message
        });

    }).catch(err => res.status(err.status).json({
        message: err.message
    }))
});




router.post('/patientdetails', cors(), (req, res) => {
    console.log("body========>", req.body)
    const userId = req.body.userId;
    console.log("userId", userId);
    var transactionstring = req.body.transactionstring;
    console.log("line number 212-------->", transactionstring)



    savetransaction.savetransaction(userId, transactionstring)

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


router.post('/getHistory', (req, res) => {
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
    var userId = req.body.userId;
    var transactionstring = req.body.transactionstring;
    updatetpa.updatetpa(userId, transactionstring)
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "dataset triggered "
            });
        }).catch(err => res.status(err.status).json({
            message: err.message
        }))


    updatetransaction
        .updatetransaction(userId, transactionstring)
        .then(result => {
            console.log("result....", result)

        })
});



router.post("/HospitalDashboard", cors(), function(req, res) {
    var HospitalName = req.body.HospitalName;
    Hospital.DashBoard(HospitalName).then(reports => {
        res.send({
            "status": 200,
            "patients": reports.message
        })
    })
})




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




router.post('/updatetransaction', cors(), (req, res) => {

    console.log("entering in to the update trans.....ui", req.body);

    var body = req.body
    var userId = body.id;
    var transactionstring = body.transactionstring;


    console.log("entering in to the upda trans", userId, transactionstring);



    updatetransaction.updatetransaction(userId, transactionstring)


        .then(result => {
            if (!userId) {
                res
                    .status(400)
                    .json({
                        message: 'Invalid Request !'
                    });
            } else {
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

router.post('/patientdetails', cors(), (req, res) => {
    console.log("body========>", req.body)
    const userId = req.body.userId;
    console.log("userId", userId);
    var transactionstring = req.body.transactionstring;
    console.log("line number 212-------->", transactionstring)



    savetransaction.savetransaction(userId, transactionstring)

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
router.post('/createpolicy', cors(),async function(req, res) {

        
        var policys = req.body;
        console.log("UI",policys);
        var policyID = policys.policyID;
        var rulesids = [];
        for (var i = 0; i < policys.rules.length; i++) {
            var idasdd = "E" + uniqid();
            var idsObj = {
                "id":idasdd,
                "expression":policys.rules[i],
                  created_at: new Date()
                }
            console.log("idasdd",idasdd,idsObj);
            rulesids.push(idasdd);

            await createpolicy.policy1(idasdd,policys.rules[i])
                .then(result => {
                    console.log("SADASD",result);
                }).catch(err => res.status(err.status).json({
                    message: err.message
                }))
}
console.log("7",rulesids);
policys.rules = rulesids;
console.log("5");
var policyObj = {
        "policyID":policys.policyID,
        "policys":policys,
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
});

router.post("/retrieveContract", cors(), (req, res) => {


    console.log("requ...123>>>ui>>>", req.body);
    const userId = req.body.userId;
  //  console.log("userId", userId);


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
    var TransactionDetails = {"userid":"1",
    "transactionstring":{"exp":req.body.expression, "value":req.body.value,"params":req.body.params}}
    savetransaction.evaluate(TransactionDetails)
        .then(function(result) {
            console.log(result)
 
            res.send(result);
        }).catch(err => res.status(err.status).json({
            message: err.message
        }));
    });
}