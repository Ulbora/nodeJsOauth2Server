var assert = require('assert');
var db = require("../../../database/mysql/db");
var tokenId;
var clientId;
var acId;
var acScope;

describe('mysql DB authorization code scope', function () {
    this.timeout(20000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            db.testConnection(function (success) {
                if (success) {
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });
        });
    });


    describe('#addClient()', function () {
        it('should add a client', function (done) {

            var json = {
                secret: '12345',                
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            setTimeout(function () {
                db.addClient(json, [], function (result) {
                    if (result.clientId > -1) {
                        clientId = result.clientId;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#addAuthorizationCode()', function () {
        it('should add an authorization code in processor', function (done) {
            var today = new Date();
            today.setTime(today.getTime() + (8 * 60 * 60 * 1000));
            var authCodeJson = {
                clientId: clientId,
                userId: "admin",
                expires: null,
                accessTokenId: null
            };
            var accessTokenJson = {
                token: 'djfjoiqjldktrtryrtyrytrsflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf',
                expires: today
            };
            var refreshTokenJson = {
                token: 'djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf'
            };
            setTimeout(function () {
                var scopeList = ["admin", "read"];
                db.addAuthorizationCode(authCodeJson, accessTokenJson, refreshTokenJson, scopeList, function (result) {
                    if (result.authorizationCode > -1) {
                        acId = result.authorizationCode;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);
        });
    });

    describe('#addAuthorizationCodeScope()', function () {
        it('should add an authorization code scope in db', function (done) {
            var json = {
                scope: "scopeTest",
                authorizationCode: acId
            };
            setTimeout(function () {
                db.addAuthorizationCodeScope(json, function (result) {
                    if (result.id > -1) {
                        acScope = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);
        });
    });

    describe('#addAuthorizationCodeScopeAgain()', function () {
        it('should add another authorization code scope in db', function (done) {
            var json = {
                scope: "scopeTest2",
                authorizationCode: acId
            };
            setTimeout(function () {
                db.addAuthorizationCodeScope(json, function (result) {
                    if (result.id > -1) {
                        //acScope2 = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);
        });
    });

    describe('#getAuthorizationCodeScopeList()', function () {
        it('should read AuthorizationCodeScope in db', function (done) {
            setTimeout(function () {
                db.getAuthorizationCodeScopeList(acId, function (result) {
                    if (result && result.length > 1 && result[2].scope === "scopeTest") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 5000);
        });
    });

    describe('#deleteAuthorizationCodeScope()', function () {
        it('should delete authorization code scopes in db', function (done) {
            setTimeout(function () {
                db.deleteAuthorizationCodeScope(acScope, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 6000);
        });
    });

    describe('#deleteAuthorizationCodeScopeList()', function () {
        it('should delete authorization code scope list in db', function (done) {
            setTimeout(function () {
                db.deleteAuthorizationCodeScopeList(acId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 7000);
        });
    });



    describe('#deleteAuthorizationCode()', function () {
        it('should delete authorization code', function (done) {
            setTimeout(function () {
                db.deleteAuthorizationCode(clientId, "admin", function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 8000);
        });
    });


    describe('#deleteClient()', function () {
        it('should delete client', function (done) {
            setTimeout(function () {
                db.deleteClient(clientId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 9000);
        });
    });
});

