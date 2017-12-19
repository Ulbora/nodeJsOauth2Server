var assert = require('assert');
var db = require("../../database/db");
var clientManager = require("../../managers/clientManager");
var clientRoleManager = require("../../managers/clientRoleManager");
var clientId;
var clientObj;
var clientRoleId;
var clientRoleId2;
describe('Client Role Manager', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientManager.init(db);
                clientRoleManager.init(db);
                done();
            }, 1000);
        });
    });

    describe('#addClient()', function () {
        it('should add a client', function (done) {

            var clientJson = {
                secret: null,
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true,
                redirectUrls: [
                    {
                        uri: 'http://www.google.com',
                        clientId: null
                    },
                    {
                        uri: 'http://www.ulboralabs.com',
                        clientId: null
                    }
                ]
            };

            setTimeout(function () {
                clientManager.addClient(clientJson, function (result) {
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
        it('should add a client role super', function (done) { 
            
           var json = {                
                role: 'superAdmin',
                clientId: clientId
            };
            setTimeout(function () {
                clientRoleManager.addClientRoleSuper(json, function (result) {
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
    
    
    describe('#addClientRole()', function () {
        it('should fail to add a client role', function (done) { 
            
           var json = {                
                role: 'superAdmin',
                clientId: clientId
            };
            setTimeout(function () {
                clientRoleManager.addClientRole(json, function (result) {
                    console.log("failed response: " + JSON.stringify(result))
                    if (result.id > -1) {                        
                        assert(false);
                    } else {
                        assert(true);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    
    describe('#addClientRole()', function () {
        it('should add a client role', function (done) { 
            
           var json = {                
                role: 'user',
                clientId: clientId
            };
            setTimeout(function () {
                clientRoleManager.addClientRole(json, function (result) {
                    if (result.id > -1) {
                        clientRoleId2 = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#getClientRoleList()', function () {
        it('should read client role list', function (done) {           
            setTimeout(function () {                
                clientRoleManager.getClientRoleList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].role === "superAdmin") {                        
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
                clientRoleManager.deleteClientRole(clientRoleId, function (result) {
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
                clientRoleManager.deleteClientRole(clientRoleId2, function (result) {
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
                clientManager.deleteClient(clientId, function (result) {
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



