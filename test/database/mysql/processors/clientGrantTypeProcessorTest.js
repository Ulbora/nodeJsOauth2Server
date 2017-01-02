var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var clintProcessor = require("../../../../database/mysql/processors/clientProcessor");
var clintGrantTypeProcessor = require("../../../../database/mysql/processors/clientGrantTypeProcessor");
var clientId;
var clientGrantTypeId;
describe('ClientGrantTypeProcessor', function () {
    this.timeout(6000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
                    clintProcessor.init(crud);
                    clintGrantTypeProcessor.init(crud);
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
    
   describe('#addClientGrantType()', function () {
        it('should add a client grant type', function (done) { 
            
           var json = {                
                grantType: 'code',
                clientId: clientId
            };
            setTimeout(function () {
                clintGrantTypeProcessor.addClientGrantType(null, json, function (result) {
                    if (result.id > -1) {
                        clientGrantTypeId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);           
        });
    });
    
    describe('#getClientGrantTypeList()', function () {
        it('should read client grant type list in processor', function (done) {           
            setTimeout(function () {                
                clintGrantTypeProcessor.getClientGrantTypeList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].grantType === "code") {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });
    
    describe('#deleteClientGrantType()', function () {
        it('should delete client grant type', function (done) {           
            setTimeout(function () {                
                clintGrantTypeProcessor.deleteClientGrantType(null, clientGrantTypeId, function (result) {
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
                clintProcessor.deleteClient(null, clientId, function (result) {
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

