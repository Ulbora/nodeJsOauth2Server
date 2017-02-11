var assert = require('assert');
var db = require("../../database/db");
var tokenId;
var clientId;
var acId;
var acScope;
var code;

describe('DB authorization code', function () {
    this.timeout(20000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                done();
            }, 1000);
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
                expires: new Date(),
                accessTokenId: null,
                randonAuthCode: "61656565dsdfd6sd6dsdf1dddsd15d",
                alreadyUsed: false
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
                //var scopeList = [];
                db.addAuthorizationCode(authCodeJson, accessTokenJson, refreshTokenJson, scopeList, function (result) {
                    console.log("authorization code in db: " + JSON.stringify(result));
                    if (result.authorizationCode > -1) {
                        acId = result.authorizationCode;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#getAuthorizationCode()', function () {
        it('should read AuthorizationCode in processor', function (done) {
            setTimeout(function () {
                db.getAuthorizationCode(clientId, "admin", function (result) {
                    if (result && result.userId === 'admin') {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#updateAuthorizationCode()', function () {
        it('should update an authorization code in db', function (done) {            
            var json = {
                randonAuthCode: "65165165651dsfdsf651dsf6d5s1dsf651ds61ds6ken",
                alreadyUsed: false,
                authorizationCode: acId
            };
            setTimeout(function () {
                db.updateAuthorizationCode(json, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });
    
    describe('#getAuthorizationCodeByCode()', function () {
        it('should read AuthorizationCode by code in processor', function (done) {
            setTimeout(function () {
                db.getAuthorizationCodeByCode("65165165651dsfdsf651dsf6d5s1dsf651ds61ds6ken", function (result) {
                    if (result && result.userId === 'admin') {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
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
            }, 1000);
        });
    });

    
    describe('#getAuthorizationCodeByScope()', function () {
        it('should read AuthorizationCodeScope in processor', function (done) {           
            setTimeout(function () {                
                db.getAuthorizationCodeByScope(clientId, "admin", "scopeTest", function (result) {
                    if (result && result.authorized) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    
    describe('#addAuthCodeRevoke()', function () {
        it('should revoke an authorization code db', function (done) {            
           var json = {
                authorizationCode: acId
            };
            setTimeout(function () {
                db.addAuthCodeRevoke(json, function (result) {
                    if (result.success && result.id > -1) {                       
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
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
            }, 1000);
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
            }, 1000);
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
            }, 1000);
        });
    });
});

