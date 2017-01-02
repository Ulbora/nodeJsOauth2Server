var assert = require('assert');
var db = require("../../../database/mysql/db");
var clientId;
var clientRedirectUriId;

describe('mysql DB client roles', function () {
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
     
    describe('#addClientRedirectUri()', function () {
        it('should add a client redirect uri', function (done) { 
            
           var json = {                
                uri: 'http://www.google.com',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientRedirectUri(null, json, function (result) {
                    if (result.id > -1) {
                        clientRedirectUriId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);           
        });
    });
    
    
    describe('#addClientRedirectUri()', function () {
        it('should add another client redirect uri', function (done) { 
            
           var json = {                
                uri: 'http://www.ulboralaba.com',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientRedirectUri(null, json, function (result) {
                    if (result.id > -1) {
                        //clientRedirectUriId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });
    
    describe('#getClientRedirectUriList()', function () {
        it('should read client redirect uri list in processor', function (done) {           
            setTimeout(function () {                
                db.getClientRedirectUriList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].uri === 'http://www.google.com') {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);           
        });
    });
    
    describe('#deleteClientRedirectUri()', function () {
        it('should delete client redirect uri', function (done) {           
            setTimeout(function () {                
                db.deleteClientRedirectUri(null, clientRedirectUriId, function (result) {
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
    
    describe('#deleteAllClientRedirectUri()', function () {
        it('should delete client redirect uri', function (done) {           
            setTimeout(function () {                
                db.deleteAllClientRedirectUri(null, clientId, function (result) {
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
            }, 7000);           
        });
    });       
});

