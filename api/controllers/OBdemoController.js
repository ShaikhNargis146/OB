module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var express = require('express', template = require('pug'));
var session = require('express-session')
var util = require('util');
var oauth = require('oauth');
// Template engine (previously known as Jade)
var pug = require('pug');

// This loads your consumer key and secret from a file you create.
var config = require('./config.json');

// Used to validate forms
var bodyParser = require('body-parser')
const baseURL = "https://apisandbox.openbankproject.com/";


// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})


var _openbankConsumerKey = config.consumerKey;
var _openbankConsumerSecret = config.consumerSecret;
var _openbankRedirectUrl = config.redirectUrl;


// The location, on the interweb, of the OBP API server we want to use.
var apiHost = config.apiHost;
var accessToken;
var tokenSecret;
console.log("apiHost is: " + apiHost)
var consumer = new oauth.OAuth(
    apiHost + '/oauth/initiate',
    apiHost + '/oauth/token',
    _openbankConsumerKey,
    _openbankConsumerSecret,
    '1.0', //rfc oauth 1.0, includes 1.0a
    _openbankRedirectUrl,
    'HMAC-SHA1');
var controller = {

    connectFun: function (req, res) {
        consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
            if (error) {
                res.status(500).send("Error getting OAuth request token : " + util.inspect(error));
            } else {
                accessToken = oauthToken;
                tokenSecret = oauthTokenSecret;
                req.session.oauthRequestToken = oauthToken;
                req.session.oauthRequestTokenSecret = oauthTokenSecret;
                res.redirect(apiHost + "/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);
            }
        });
    },

    // index: function (req, res) {
    //     /* POST */
    //     var k = request.post({
    //             url: 'https://apisandbox.openbankproject.com/my/logins/direct',
    //             // timeout: 10000,
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": 'DirectLogin username="nargis",  password="%LetmeBank9",  consumer_key="3sjjdzmdgvutecrqzfusxqgwns2aym41cygi5d5m"'
    //             }
    //         },
    //         function (err, response, body) {
    //             console.log("body", body, "---response---");

    //             var token = JSON.parse(body)["token"];
    //             console.log("token", token);
    //             // send payment here
    //             // var bodyObject = {
    //             //     "to": {
    //             //         "bank_id": "rbs",
    //             //         "account_id": "224488"
    //             //     },
    //             //     "value": {
    //             //         "currency": "EUR",
    //             //         "amount": "3.55"
    //             //     },
    //             //     "description": "A description for the transaction to be created"
    //             // };
    //             // request.post({
    //             //     url: "https://apisandbox.openbankproject.com/obp/v2.0.0/banks/rbs/accounts/224466/owner/transaction-request-types/SANDBOX_TAN/transaction-requests",
    //             //     timeout: 10000,
    //             //     json: true,

    //             //     headers: {
    //             //         "Content-Type": "application/json",
    //             //         "Authorization": 'DirectLogin token="' + token + '"'
    //             //     },
    //             //     body: bodyObject


    //             // }, function (err, res, body) {
    //             //     cb(body);

    //             // });
    //         });
    // },
    ///banks
    getBanks: function (req, res) {
        /* POST */
        var k = request.post({
                url: baseURL + 'my/logins/direct',
                // timeout: 10000,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'DirectLogin username="nargis",  password="%LetmeBank9",  consumer_key="3sjjdzmdgvutecrqzfusxqgwns2aym41cygi5d5m"'
                }
            },
            function (err, response1, body) {
                console.log("body", body, "---response---");

                var token = JSON.parse(body)["token"];
                console.log("token", token);

                request.get({
                    url: "https://apisandbox.openbankproject.com/obp/v2.0.0/banks",
                    timeout: 10000,
                    json: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'DirectLogin token="' + token + '"'
                    }
                }, function (err, response2, body) {
                    console.log('body', body);
                    res.callback(null, body);
                });
            });
    },
    getMyAccounts: function (req, res) {
        console.log('req.body', req.body);
        var name = req.body.name;
        var password = req.body.password;

        async.waterfall([
            function getToken(callback) {
                request.post({
                        url: baseURL + 'my/logins/direct',
                        timeout: 100000,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": 'DirectLogin username=' + name + ',  password=' + password + ',  consumer_key="nemme3ipafwurdmchugxmvqnkyq3imxzj2osfc14"'
                        }
                    },
                    function (err, response1, body) {
                        if (err) {
                            callback(err, null);
                        } else {
                            console.log("body", body, "---response---");
                            var token = JSON.parse(body)["token"];
                            console.log("token", token);
                            callback(null, token);
                        }

                    });
            },
            function getAccounts(token, callback) {
                console.log("inside getAccounts", token);
                request.get({
                    url: baseURL + "obp/v2.0.0/my/accounts",
                    timeout: 100000,
                    json: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'DirectLogin token="' + token + '"'
                    }
                }, function (err, response2, body) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, token, body);
                    }
                });

            },
            function getAccountDetails(token, data, callback) {
                console.log("inside getAccountDetails", data);
                var accountList = [];
                async.each(data, function (value, callback1) {
                    request.get({
                        url: value._links.detail.href,
                        timeout: 100000,
                        json: true,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": 'DirectLogin token="' + token + '"'
                        }
                    }, function (err, response3, body) {
                        accountList.push(body);
                        callback1();
                    });

                }, function (err) {
                    if (err) {
                        console.log("error in async.each");
                        callback(err, null);
                    } else {
                        console.log("async.each completed");
                        callback(null, accountList);
                    }

                });

            }
        ], function asyncComplete(err, results) {
            if (err) {
                console.warn('Error updating file status', err);
                res.callback(err, null);
            } else {
                console.log("succefully completed the waterfall", results);
                res.callback(null, results);
            }
        });

    },

    ///////////////////////oauthDemo////////////////////
    callbackFun: function (req, res) {
        consumer.getOAuthAccessToken(
            req.session.oauthRequestToken,
            req.session.oauthRequestTokenSecret,
            req.query.oauth_verifier,
            function (error, accessToken, tokenSecret, result) {
                if (error) {
                    //oauthAccessToken, -Secret and result are now undefined
                    res.status(500).send("Error getting OAuth access token : " + util.inspect(error));
                } else {
                    //error is now undefined
                    req.session.oauthAccessToken = accessToken;
                    req.session.oauthAccessTokenSecret = tokenSecret;
                    res.redirect('http://localhost:8081/account');
                }
            }
        );
    },
    getMyAccountsOauth: function (req, res) {
        console.log("getMyAccountsOauth");
        consumer.get(apiHost + "/obp/v2.1.0/my/accounts",
            accessToken,
            tokenSecret,
            function (error, data, response) {
                var parsedData = JSON.parse(data);
                res.status(200).send(parsedData)
            });
    }
}
module.exports = _.assign(module.exports, controller);