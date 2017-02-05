var assert = require('assert');
var db = require("../../../database/mysql/db");
var tokenId;
var clientId;
var acId;
var acScope;

describe('mysql DB authorization code', function () {
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
           today.setTime(today.getTime() + (8*60*60*1000)); 
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
                db.addAuthorizationCode(authCodeJson, accessTokenJson, refreshTokenJson, scopeList, function (result) {
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
    
    
    
    
    describe('#addAuthCodeRevoke()', function () {
        it('should revoke an authorization code mysql db', function (done) {            
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
    
    
    describe('#getAuthCodeRevoke()', function () {
        it('should get AuthCodeRevoke in mysql db', function (done) {           
            setTimeout(function () {                
                db.getAuthCodeRevoke( acId, function (result) {
                    if (result && result.authorizationCode === acId) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    
    describe('#deleteAuthCodeRevoke()', function () {
        it('should delete AuthCodeRevoke in mysql db', function (done) {
            setTimeout(function () {
                db.deleteAuthCodeRevoke(acId, function (result) {
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

