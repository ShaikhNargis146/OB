module.exports = _.cloneDeep(require("sails-wohlig-controller"));
const baseURL = "https://apisandbox.openbankproject.com/";
var controller = {
    index: function (req, res) {
        /* POST */
        var k = request.post({
                url: 'https://apisandbox.openbankproject.com/my/logins/direct',
                // timeout: 10000,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'DirectLogin username="nargis",  password="%LetmeBank9",  consumer_key="3sjjdzmdgvutecrqzfusxqgwns2aym41cygi5d5m"'
                }
            },
            function (err, response, body) {
                console.log("body", body, "---response---");

                var token = JSON.parse(body)["token"];
                console.log("token", token);
                // send payment here
                // var bodyObject = {
                //     "to": {
                //         "bank_id": "rbs",
                //         "account_id": "224488"
                //     },
                //     "value": {
                //         "currency": "EUR",
                //         "amount": "3.55"
                //     },
                //     "description": "A description for the transaction to be created"
                // };
                // request.post({
                //     url: "https://apisandbox.openbankproject.com/obp/v2.0.0/banks/rbs/accounts/224466/owner/transaction-request-types/SANDBOX_TAN/transaction-requests",
                //     timeout: 10000,
                //     json: true,

                //     headers: {
                //         "Content-Type": "application/json",
                //         "Authorization": 'DirectLogin token="' + token + '"'
                //     },
                //     body: bodyObject


                // }, function (err, res, body) {
                //     cb(body);

                // });
            });
    },
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
        async.waterfall([
            function getToken(callback) {
                request.post({
                        url: baseURL + 'my/logins/direct',
                        // timeout: 10000,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": 'DirectLogin username="nargis",  password="%LetmeBank9",  consumer_key="3sjjdzmdgvutecrqzfusxqgwns2aym41cygi5d5m"'
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
                    url: baseURL + "obp/v2.0.0/git reset --hard",
                    timeout: 10000,
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
                console.log("inside getAccountDetails", token);
                var accountList = [];
                async.each(data, function (value, callback1) {
                    request.get({
                        url: value._links.detail.href,
                        timeout: 10000,
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
}
module.exports = _.assign(module.exports, controller);