var assert = require('assert');
var db = require("../../database/db");
var clientManager = require("../../managers/clientManager");
var clientAllowedUriManager = require("../../managers/clientAllowedUriManager");
var clientRoleManager = require("../../managers/clientRoleManager");
var clientRoleUriManager = require("../../managers/clientRoleUriManager");
var clientId;
var clientObj;
var clientAllowedUriId;
var clientRoleId;

describe('Client Role URI Manager', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientManager.init(db);
                clientAllowedUriManager.init(db);
                clientRoleManager.init(db);
                clientRoleUriManager.init(db);
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
            }, 2000);
        });
    });

     describe('#addClientRole()', function () {
        it('should add a client role', function (done) { 
            
           var json = {                
                role: 'superuser',
                clientId: clientId
            };
            setTimeout(function () {
                clientRoleManager.addClientRole(json, function (result) {
                    if (result.id > -1) {
                        clientRoleId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });

    describe('#addClientAllowedUri()', function () {
        it('should add a client allowed uri', function (done) {

            var json = {
                uri: 'http://www.google.com',
                clientId: clientId
            };
            setTimeout(function () {
                clientAllowedUriManager.addClientAllowedUri(json, function (result) {
                    if (result.id > -1) {
                        clientAllowedUriId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);
        });
    });

    
     describe('#addClientRoleUri()', function () {
        it('should add a client Role Uri', function (done) { 
            
           var json = {                
                clientRoleId: clientRoleId,
                clientAllowedUriId: clientAllowedUriId
            };
            setTimeout(function () {
                clientRoleUriManager.addClientRoleUri(json, function (result) {
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
    
    describe('#getClientRoleUriList()', function () {
        it('should get a client Role Uri list', function (done) {                       
            setTimeout(function () {
                clientRoleUriManager.getClientRoleAllowedUriList(clientRoleId, function (result) {
                    if (result && result.length > 0 && result[0].clientAllowedUriId === clientAllowedUriId) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 5000);           
        });
    });
    
    describe('#deleteClientRoleUri()', function () {
        it('should delete a client Role Uri', function (done) {             
           var json = {                
                clientRoleId: clientRoleId,
                clientAllowedUriId: clientAllowedUriId
            };
            setTimeout(function () {
                clientRoleUriManager.deleteClientRoleUri(json, function (result) {
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
            }, 7000);           
        });
    }); 
    
    
    describe('#deleteClientAllowedUri()', function () {
        it('should delete client allowed URI', function (done) {           
            setTimeout(function () {                
                clientAllowedUriManager.deleteClientAllowedUri(clientAllowedUriId, function (result) {
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
                clientManager.deleteClient(clientId, function (result) {
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



