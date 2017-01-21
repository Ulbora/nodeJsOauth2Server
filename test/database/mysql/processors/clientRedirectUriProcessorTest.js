var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var clintProcessor = require("../../../../database/mysql/processors/clientProcessor");
var clientRedirectUriProcessor = require("../../../../database/mysql/processors/clientRedirectUriProcessor");
var clientId;
var clientRedirectUriId;
describe('ClientRedirectUriProcessor', function () {
    this.timeout(9000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
                    clintProcessor.init(crud);
                    clientRedirectUriProcessor.init(crud);
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
    
   describe('#addClientRedirectUri()', function () {
        it('should add a client redirect uri', function (done) { 
            
           var json = {                
                uri: 'http://www.google.com',
                clientId: clientId
            };
            setTimeout(function () {
                clientRedirectUriProcessor.addClientRedirectUri(null, json, function (result) {
                    if (result.id > -1) {
                        clientRedirectUriId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    
    describe('#addClientRedirectUri()', function () {
        it('should add another client redirect uri', function (done) { 
            
           var json = {                
                uri: 'http://www.ulboralaba.com',
                clientId: clientId
            };
            setTimeout(function () {
                clientRedirectUriProcessor.addClientRedirectUri(null, json, function (result) {
                    if (result.id > -1) {
                        //clientRedirectUriId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#getClientRedirectUri()', function () {
        it('should get client redirect uri in processor', function (done) {           
            setTimeout(function () {       
                var toFindUri = "http://www.google.com";
                clientRedirectUriProcessor.getClientRedirectUri(clientId, toFindUri, function (result) {
                    if (result && result.id > 0) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    
    describe('#getClientRedirectUriList()', function () {
        it('should read client redirect uri list in processor', function (done) {           
            setTimeout(function () {                
                clientRedirectUriProcessor.getClientRedirectUriList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].uri === 'http://www.google.com') {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#deleteClientRedirectUri()', function () {
        it('should delete client redirect uri', function (done) {           
            setTimeout(function () {                
                clientRedirectUriProcessor.deleteClientRedirectUri(null, clientRedirectUriId, function (result) {
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
    
    describe('#deleteAllClientRedirectUri()', function () {
        it('should delete client redirect uri', function (done) {           
            setTimeout(function () {                
                clientRedirectUriProcessor.deleteAllClientRedirectUri(null, clientId, function (result) {
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

