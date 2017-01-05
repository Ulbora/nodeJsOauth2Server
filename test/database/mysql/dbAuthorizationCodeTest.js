var assert = require('assert');
var db = require("../../../database/mysql/db");
var tokenId;
var clientId;
var acId;

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
            }, 2000);           
        });
    });
    
    describe('#addAuthorizationCode()', function () {
        it('should add an authorization code in processor', function (done) { 
           var today = new Date();
           today.setTime(today.getTime() + (8*60*60*1000)); 
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
                db.addAuthorizationCode(authCodeJson, accessTokenJson, refreshTokenJson, function (result) {
                    if (result.authorizationCode > -1) {
                        acId = result.authorizationCode;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);           
        });
    });
    
    describe('#getAuthorizationCode()', function () {
        it('should read AuthorizationCode in processor', function (done) {           
            setTimeout(function () {                
                db.getAuthorizationCode( clientId, "admin", function (result) {
                    if (result && result.userId === 'admin') {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 5000);           
        });
    });
    
    describe('#updateAuthorizationCode()', function () {
        it('should update an authorization code in db', function (done) { 
           var today = new Date();
           today.setTime(today.getTime() + (8*60*60*1000)); 
           var json = {                
                expires: today,
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
            }, 6000);           
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
            }, 7000);           
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
            }, 8000);           
        });
    });   
});

