var assert = require('assert');
var db = require("../../database/db");
var accessTokenDelegate = require("../../delegates/accessTokenDelegate");
var token;
var token2;
describe('Access token delegate', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
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
        it('should validateAccessToken', function (done) {
            var claims = {
                sub: "access",
                grant: "code",
                userId: "admin",
                clientId: "jdsldsldsldls",
                role: "admin",
                uri: "https://abc.com/rs/addUser",
                scope: "read"
            };
            setTimeout(function () {
                accessTokenDelegate.validateAccessToken(token, claims, function (valid) {
                    if (valid) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

/*
    describe('#validateAccessToken()', function () {
        it('should fail to validateAccessToken because of role', function (done) {
            var claims = {
                sub: "access",
                grant: "code",
                userId: "admin",
                clientId: "jdsldsldsldls",
                role: "admin1",
                uri: "https://abc.com/rs/addUser",                
                scope: "read"
            };
            setTimeout(function () {
                accessTokenDelegate.validateAccessToken(token, claims, function (valid) {
                    if (valid) {
                        assert(false);
                    } else {
                        assert(true);
                    }
                    done();
                });
            }, 1000);
        });
    });
*/
/*
    describe('#validateAccessToken()', function () {
        it('should pass because uri not mapped validateAccessToken because of uri', function (done) {
            var claims = {
                sub: "access",
                grant: "code",
                userId: "admin",
                clientId: "jdsldsldsldls",
                role: "admin",
                uri: "https://abc.com/rs/addUsers",
                scope: "read"
            };
            setTimeout(function () {
                accessTokenDelegate.validateAccessToken(token, claims, function (valid) {
                    if (valid) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });
    */
    describe('#decodeAccessToken()', function () {
        it('should decodeAccessToken', function (done) {            
            setTimeout(function () {
                accessTokenDelegate.decodeAccessToken(token, function (decoded) {
                    if (decoded && decoded.userId === "admin") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#generateAccessToken()', function () {
        it('should generateAccessToken', function (done) {
            var payload = {
                sub: "access",
                grant: "code",
                userId: "admin",
                clientId: "jdsldsldsldls",
                scopeList: ["read", "write"],

            };
            setTimeout(function () {
                accessTokenDelegate.generateAccessToken(payload, function (accessToken) {
                    if (accessToken) {
                        token2 = accessToken;
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

/*
    describe('#validateAccessToken()', function () {
        it('should validateAccessToken because no role uris mapped', function (done) {
            var claims = {
                sub: "access",
                grant: "code",
                userId: "admin",
                clientId: "jdsldsldsldls",
                role: "admin",
                uri: "https://abc.com/rs/addUsers",
                scope: "read"
            };
            setTimeout(function () {
                accessTokenDelegate.validateAccessToken(token2, claims, function (valid) {
                    if (valid) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });
*/
});



