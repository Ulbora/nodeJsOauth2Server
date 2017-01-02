var assert = require('assert');
var db = require("../../../database/mysql/db");
var clientId;
var clientGrantTypeId;

describe('mysql DB client grant types', function () {
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
     
     describe('#addClientGrantType()', function () {
        it('should add a client grant type in db', function (done) { 
            
           var json = {                
                grantType: 'code',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientGrantType(null, json, function (result) {
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
        it('should read client grant type list in db', function (done) {           
            setTimeout(function () {                
                db.getClientGrantTypeList(clientId, function (result) {
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
        it('should delete client grant type in db', function (done) {           
            setTimeout(function () {                
                db.deleteClientGrantType(null, clientGrantTypeId, function (result) {
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
                db.deleteClient(clientId, function (result) {
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

