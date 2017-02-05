var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var accessTokenProcessor = require("../../../../database/mysql/processors/accessTokenProcessor");
var clientProcessor = require("../../../../database/mysql/processors/clientProcessor");
var authorizationCodeProcessor = require("../../../../database/mysql/processors/authorizationCodeProcessor");
var authorizationCodeScopeProcessor = require("../../../../database/mysql/processors/authorizationCodeScopeProcessor");
var authCodeRevokeProcessor = require("../../../../database/mysql/processors/authCodeRevokeProcessor");
var clientId;
var tokenId;
var acId;


describe('authorizationCodeProcessor', function () {
    this.timeout(10000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
                    accessTokenProcessor.init(crud); 
                    clientProcessor.init(crud); 
                    authorizationCodeProcessor.init(crud);
                    authorizationCodeScopeProcessor.init(crud);
                    authCodeRevokeProcessor.init(crud);
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });
        });
    });
   
    describe('#addClient()', function () {
        it('should add a client in clientProcessor', function (done) { 
            
           var json = {
                secret: '12345',                
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            setTimeout(function () {
                clientProcessor.addClient(null, json, function (result) {
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
    
   describe('#addAccessToken()', function () {
        it('should add a access token in processor', function (done) { 
           var today = new Date();
           today.setTime(today.getTime() + (8*60*60*1000)); 
           var json = {
                token: 'djfjoiqjldktrtryrtyrytrsflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf',
                expires: today
            };
            setTimeout(function () {
                accessTokenProcessor.addAccessToken(null, json, function (result) {
                    if (result.id > -1) {
                        tokenId = result.id;
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
           var json = {
                clientId: clientId,
                userId: "admin",
                expires: today,
                accessTokenId: tokenId,
                randonAuthCode: "61656565dsdfd6sd6dsdf1dddsd15d",
                alreadyUsed: false
            };
            setTimeout(function () {
                authorizationCodeProcessor.addAuthorizationCode(null, json, function (result) {
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
        it('should revoke an authorization code in processor', function (done) {            
           var json = {
                authorizationCode: acId
            };
            setTimeout(function () {
                authCodeRevokeProcessor.addAuthCodeRevoke(null, json, function (result) {
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
        it('should get AuthCodeRevoke in processor', function (done) {           
            setTimeout(function () {                
                authCodeRevokeProcessor.getAuthCodeRevoke( acId, function (result) {
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
        it('should delete AuthCodeRevoke in processor', function (done) {
            setTimeout(function () {
                authCodeRevokeProcessor.deleteAuthCodeRevoke(null, acId, function (result) {
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
                authorizationCodeProcessor.deleteAuthorizationCode(null, clientId, "admin", function (result) {
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
    
    describe('#deleteAccessToken()', function () {
        it('should delete access token', function (done) {           
            setTimeout(function () {                
                accessTokenProcessor.deleteAccessToken(null, tokenId, function (result) {
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
                clientProcessor.deleteClient(null, clientId, function (result) {
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

