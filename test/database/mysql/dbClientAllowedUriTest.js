var assert = require('assert');
var db = require("../../../database/mysql/db");
var clientId;
var clientAllowedUriId;

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
     
    describe('#addClientAllowedUri()', function () {
        it('should add a client allowed URI', function (done) { 
            
           var json = {                
                uri: 'http://ulboralabs.com',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientAllowedUri(json, function (result) {
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
    
    describe('#getClientAllowedUriById()', function () {
        it('should a uri in mysql db', function (done) {           
            setTimeout(function () {                
                db.getClientAllowedUriById(clientAllowedUriId, function (result) {
                    if (result && result.id && result.uri === "http://ulboralabs.com") {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#updateClientAllowedUri()', function () {
        it('should update a client allowed URI', function (done) { 
            
           var json = {                
                uri: 'http://ulboralabs1.com',
                id: clientAllowedUriId
            };
            setTimeout(function () {
                db.updateClientAllowedUri(json, function (result) {
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
    
    describe('#getClientAllowedUriList()', function () {
        it('should read client allowed uri list', function (done) {           
            setTimeout(function () {                
                db.getClientAllowedUriList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].uri === "http://ulboralabs1.com") {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#getClientAllowedUri', function () {
        it('should read client uri in processor', function (done) {           
            setTimeout(function () {                
                db.getClientAllowedUri(clientId, 'http://ulboralabs1.com', function (result) {
                    if (result && result.uri === "http://ulboralabs1.com") {                        
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
                db.deleteClientAllowedUri(clientAllowedUriId, function (result) {
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

