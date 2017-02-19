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
            }, 1000);           
        });
    });
    
    describe('#addImplicitGrant()', function () {
        it('should add an addImplicitGrant in db', function (done) { 
           var today = new Date();
           today.setTime(today.getTime() + (8*60*60*1000)); 
           var impJson = {
                clientId: clientId,
                userId: "admin",                
                accessTokenId: null
            };
            var accessTokenJson = {
                token: 'djfjoiqjldktrtryrtyrytrsflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf',
                expires: today
            };
            
            setTimeout(function () {
                db.addImplicitGrant(impJson, accessTokenJson, ["read"], function (result) {
                    if (result.id > -1) {
                        acId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#getImplicitGrant()', function () {
        it('should read ImplicitGrant in db', function (done) {           
            setTimeout(function () {                
                db.getImplicitGrant( clientId, "admin", function (result) {
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
    
   describe('#getImplicitGrantByScope()', function () {
        it('should read getImplicitGrantByScope in db', function (done) {
            setTimeout(function () {
                db.getImplicitGrantByScope(clientId, "admin", "read", function (result) {
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
    
    describe('#deleteImplicitGrant()', function () {
        it('should delete ImplicitGrant in db', function (done) {           
            setTimeout(function () {                
                db.deleteImplicitGrant(clientId, "admin", function (result) {
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

