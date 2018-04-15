var assert = require('assert');
var db = require("../../database/db");
//var service = require("../../../services/service");
var tokenValidationService = require("../../services/tokenValidationService");
var accessTokenDelegate = require("../../delegates/accessTokenDelegate");
var btoa = require('btoa');
var token;

describe('tokenValidationService', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                tokenValidationService.init(db);
                done();
            }, 1000);
        });
    });

    describe('#generateAccessToken()', function () {
        it('should generateAccessToken', function (done) {
            var payload = {
                sub: "access",
                grant: "code",
                userId: "firns",
                clientId: "jdsldsldsldls",
                roleUris: [
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "https://abc.com/rs/addUser", "clientId": 421}
                ],
                scopeList: ["read", "write"],
                expiresIn: 500
            };
            setTimeout(function () {
                accessTokenDelegate.generateAccessToken(payload, function (accessToken) {
                    if (accessToken) {
                        token = accessToken;
                        console.log("access token: " + accessToken);
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#validateAccessToken()', function () {
        it('should fail to validateAccessToken', function (done) {
            setTimeout(function () {
                var req = {};
                var body = {};
                body.userId = "admin";
                body.clientId = "aaa";
                req.body = body;
                req.is = function (val) {
                    if (val === 'application/json') {
                        return true;
                    } else {
                        return false;
                    }
                }
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(false);
                    }
                    if (this.statusCode === 415) {
                        assert(false);
                    } else {
                        if (val.valid === false) {
                            assert(true);
                            //done();
                        }
                    }
                    done();
                };
                tokenValidationService.validateAccessToken(req, res);
            }, 1000);
        });
    });


    describe('#validateAccessToken()', function () {
        it('should validateAccessToken', function (done) {
            setTimeout(function () {
                var req = {};
                var body = {};
                body.userId = "admin";
                body.clientId = "jdsldsldsldls";
                body.role = "admin";
                body.uri = "https://abc.com/rs/addUser";
                body.scope = "read";
                body.accessToken = token;
                req.body = body;
                req.is = function (val) {
                    if (val === 'application/json') {
                        return true;
                    } else {
                        return false;
                    }
                }
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    console.log("send: " + JSON.stringify(val));
                    if (this.statusCode === 401) {
                        assert(false);
                    } else if (this.statusCode === 415) {
                        assert(false);
                    } else if (val.valid) {
                        assert(true);
                    } else {
                        assert(false);
                    }

                    done();
                };
                tokenValidationService.validateAccessToken(req, res);
            }, 1000);
        });
    });
});


