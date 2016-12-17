var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var clintProcessor = require("../../../../database/mysql/processors/clientProcessor");
var clientId;
describe('ClientProcessor', function () {
    this.timeout(6000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (con) {
                if (con) {
                    clintProcessor.init(crud);
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
    
    describe('#updateClient()', function () {
        it('should add a client in processor', function (done) { 
            
           var json = {
                secret: '123456',
                redirectUri: 'http://ulboralabs.com',
                name: 'ulbora ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: false,
                clientId: clientId
            };
            setTimeout(function () {
                clintProcessor.updateClient(json, function (result) {
                    if (result.success) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);           
        });
    });
    
    describe('#getClient()', function () {
        it('should read client in processor', function (done) {           
            setTimeout(function () {                
                clintProcessor.getClient( clientId, function (result) {
                    if (result && result.name === 'ulbora ulbora' && result.enabled === false) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });
    
    
    describe('#getClientList()', function () {
        it('should read client list in processor', function (done) {           
            setTimeout(function () {                
                clintProcessor.getClientList(function (result) {
                    if (result && result.length > 0) {                        
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

