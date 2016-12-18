var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var clintProcessor = require("../../../../database/mysql/processors/clientProcessor");
var clintRoleProcessor = require("../../../../database/mysql/processors/clientRoleProcessor");
var clientId;
var clientRoleId;
describe('ClientRoleProcessor', function () {
    this.timeout(6000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
                    clintProcessor.init(crud);
                    clintRoleProcessor.init(crud);
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
        it('should add a client Role', function (done) { 
            
           var json = {                
                role: 'user',
                clientId: clientId
            };
            setTimeout(function () {
                clintRoleProcessor.addClientRole(json, function (result) {
                    if (result.id > -1) {
                        clientRoleId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);           
        });
    });
    
    describe('#getClientRoleiList()', function () {
        it('should read client role list in processor', function (done) {           
            setTimeout(function () {                
                clintRoleProcessor.getClientRoleList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].role === "user") {                        
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
                clintRoleProcessor.deleteClientRole( clientRoleId, function (result) {
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

