var assert = require('assert');
var db = require("../../../database/mysql/db");
var clientId;
var clientRoleId;

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
                db.addClient(null, json, function (result) {
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
        it('should add a client role', function (done) { 
            
           var json = {                
                role: 'superuser',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientRole(null, json, function (result) {
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
    
    describe('#getClientRoleList()', function () {
        it('should read client role list', function (done) {           
            setTimeout(function () {                
                db.getClientRoleList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].role === "superuser") {                        
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
                db.deleteClientRole(null, clientRoleId, function (result) {
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
                db.deleteClient(null, clientId, function (result) {
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

