var constants = require("../constants/constants");
var request = require('request');

exports.login = function (loginJson, callback) {
    var rtn = {
        valid: false,
        message: ""
    };
    var url = process.env.AUTHENTICATION_SERVICE || constants.AUTHENTICATION_SERVICE_LOCAL;
    var options = {
        method: 'post',
        body: loginJson,
        json: true,
        forever: true,
        timeout: 120000,
        url: url
    };
    request(options, function (err, res, body) {
        if (!err && body) {
            var statusCode = res.statusCode;
            if (statusCode === 200) {
                //console.log('body: ', body);
                //console.log('body.valid: ', body.valid);
                if (body.valid) {
                    rtn.valid = true;
                }
                callback(rtn);
            } else {
                callback(rtn);
            }
        } else {
            console.error('error posting json: ', err);
            callback(rtn);
        }
    });
};