var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var clintProcessor = require("../../../../database/mysql/processors/clientProcessor");
var clintRoleProcessor = require("../../../../database/mysql/processors/clientRoleProcessor");
var clintUriProcessor = require("../../../../database/mysql/processors/clientAllowedUriProcessor");
var clintRoleUriProcessor = require("../../../../database/mysql/processors/clientRoleUriProcessor");
var clientId;
var clientRoleId;
var clientAllowedUriId;
describe('ClientRoleUriProcessor', function () {
    this.timeout(20000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
                    clintProcessor.init(crud);
                    clintRoleProcessor.init(crud);
                    clintUriProcessor.init(crud);
                    clintRoleUriProcessor.init(crud);
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
                clintProcessor.addClient(null, json, function (result) {
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
                clintRoleProcessor.addClientRole(null, json, function (result) {
                    if (result.id > -1) {
                        clientRoleId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#addClientAllowedUri()', function () {
        it('should add a client allowed URI', function (done) { 
            
           var json = {                
                uri: 'http://ulboralabs.com',
                clientId: clientId
            };
            setTimeout(function () {
                clintUriProcessor.addClientAllowedUri(null, json, function (result) {
                    if (result.id > -1) {
                        clientAllowedUriId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#addClientRoleUri()', function () {
        it('should add a client Role Uri', function (done) { 
            
           var json = {                
                clientRoleId: clientRoleId,
                clientAllowedUriId: clientAllowedUriId
            };
            setTimeout(function () {
                clintRoleUriProcessor.addClientRoleUri(null, json, function (result) {
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
    
    describe('#getClientRoleUriList()', function () {
        it('should get a client Role Uri list', function (done) {                       
            setTimeout(function () {
                clintRoleUriProcessor.getClientRoleAllowedUriList(clientRoleId, function (result) {
                    if (result && result.length > 0 && result[0].clientAllowedUriId === clientAllowedUriId) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#getClientRoleUriListByClientId()', function () {
        it('should get a client Role Uri list by client id', function (done) {                       
            setTimeout(function () {
                clintRoleUriProcessor.getClientRoleAllowedUriListByClientId(clientId, function (result) {
                    console.log("role uris by client: " + JSON.stringify(result))
                    console.log("clientAllowedUriId: " + clientAllowedUriId)
                    if (result && result.length > 0 && result[0].uriId === clientAllowedUriId) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#deleteClientRoleUri()', function () {
        it('should delete a client Role Uri', function (done) {             
           var json = {                
                clientRoleId: clientRoleId,
                clientAllowedUriId: clientAllowedUriId
            };
            setTimeout(function () {
                clintRoleUriProcessor.deleteClientRoleUri(null, json, function (result) {
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
    
    describe('#deleteClientRole()', function () {
        it('should delete client role', function (done) {           
            setTimeout(function () {                
                clintRoleProcessor.deleteClientRole(null, clientRoleId, function (result) {
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
    
     describe('#deleteClientAllowedUri()', function () {
        it('should delete client allowed URI', function (done) {           
            setTimeout(function () {                
                clintUriProcessor.deleteClientAllowedUri(null, clientAllowedUriId, function (result) {
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
                clintProcessor.deleteClient(null, clientId, function (result) {
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

