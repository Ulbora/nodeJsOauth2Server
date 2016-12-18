var assert = require('assert');
var db = require("../../../database/mysql/db");
var clientId;
var clientScopeId;

describe('mysql DB client allow uri', function () {
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
                redirectUri: 'http://ulboralabs.com',
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            setTimeout(function () {
                db.addClient(json, function (result) {
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
     
    describe('#addClientScope()', function () {
        it('should add a client scope', function (done) { 
            
           var json = {                
                scope: 'system',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientScope(json, function (result) {
                    if (result.id > -1) {
                        clientScopeId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);           
        });
    });
    
    describe('#getClientScopeList()', function () {
        it('should read client scope list', function (done) {           
            setTimeout(function () {                
                db.getClientScopeList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].scope === "system") {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });
    
    describe('#deleteClientScope()', function () {
        it('should delete client scope', function (done) {           
            setTimeout(function () {                
                db.deleteClientScope( clientScopeId, function (result) {
                    if (result.success) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);           
        });
    });        
    
    describe('#deleteClient()', function () {
        it('should delete client', function (done) {           
            setTimeout(function () {                
                db.deleteClient( clientId, function (result) {
                    if (result.success) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 5000);           
        });
    });       
});

