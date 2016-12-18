var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var clintProcessor = require("../../../../database/mysql/processors/clientProcessor");
var clintScopeProcessor = require("../../../../database/mysql/processors/clientScopeProcessor");
var clientId;
var clientScopeId;
describe('ClientScopeProcessor', function () {
    this.timeout(6000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
                    clintProcessor.init(crud);
                    clintScopeProcessor.init(crud);
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
                redirectUri: 'http://ulboralabs.com',
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            setTimeout(function () {
                clintProcessor.addClient(json, function (result) {
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
    
   describe('#addClientRole()', function () {
        it('should add a client Scope', function (done) { 
            
           var json = {                
                scope: 'page',
                clientId: clientId
            };
            setTimeout(function () {
                clintScopeProcessor.addClientScope(json, function (result) {
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
        it('should read client scope list in processor', function (done) {           
            setTimeout(function () {                
                clintScopeProcessor.getClientScopeList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].scope === "page") {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });
    
    describe('#deleteClientRole()', function () {
        it('should delete client role', function (done) {           
            setTimeout(function () {                
                clintScopeProcessor.deleteClientScope( clientScopeId, function (result) {
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
                clintProcessor.deleteClient( clientId, function (result) {
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

