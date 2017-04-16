var assert = require('assert');
var db = require("../../database/db");
//var service = require("../../../services/service");
var oauth2 = require("../../oauth2/oauth2");
var accessTokenDelegate = require("../../delegates/accessTokenDelegate");
var btoa = require('btoa');
var token;

describe('oauth2', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                oauth2.init(db);
                accessTokenDelegate.init(db);
                done();
            }, 1000);
        });
    });

    describe('#generateAccessToken()', function () {
        it('should generateAccessToken', function (done) {
            var payload = {
                sub: "access",
                grant: "code",
                userId: "admin",
                clientId: 544,
                roleUris: [
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/addUser", "clientId": 421}
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

    describe('#authorize()', function () {
        it('should authorize a request', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return "admin";
                    } else if (val === "clientId") {
                        return "544";
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function () {
                    if (this.statusCode === 401) {
                        assert(false);
                    } else {
                        assert(true);
                    }
                    done();
                };
                var me = {
                    role: "admin",
                    uri: "/rs/addUser",
                    scope: "read"
                };
                oauth2.authorize(req, res, me, function () {
                    console.log("In authorization callback");
                    assert(true);
                    done();
                });
            }, 1000);
        });
    });


    describe('#authorize()', function () {
        it('should fail to authorize a request', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return undefined;
                    } else if (val === "userId") {
                        return undefined;
                    } else if (val === "clientId") {
                        return undefined;
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function () {
                    if (this.statusCode === 401) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                var me = {
                    role: "admin",
                    uri: "/rs/addUser",
                    scope: "read"
                };
                oauth2.authorize(req, res, me, function () {
                    console.log("In authorization callback");
                    assert(true);
                    done();
                });
            }, 1000);
        });
    });


    describe('#authorize()', function () {
        it('should fail to authorize a request with no clientId', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return undefined;
                    } else if (val === "clientId") {
                        return undefined;
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function () {
                    if (this.statusCode === 401) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                var me = {
                    role: "admin",
                    uri: "/rs/addUser",
                    scope: "read"
                };
                oauth2.authorize(req, res, me, function () {
                    console.log("In authorization callback");
                    assert(true);
                    done();
                });
            }, 1000);
        });
    });

});


