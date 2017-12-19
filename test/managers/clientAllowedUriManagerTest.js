var assert = require('assert');
var db = require("../../database/db");
var clientManager = require("../../managers/clientManager");
var clientAllowedUriManager = require("../../managers/clientAllowedUriManager");
var clientId;
var clientObj;
var clientAllowedUriId;
var clientAllowedUriId2;
describe('Client Allowed URI Manager', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientManager.init(db);
                clientAllowedUriManager.init(db);
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
            }, 1000);
        });
    });
    
    
    describe('#addClientAllowedUri()', function () {
        it('should fail to add a client allowed uri', function (done) {

            var json = {
                uri: 'http://www.ulbora.google.com',
                clientId: clientId
            };
            setTimeout(function () {
                clientAllowedUriManager.addClientAllowedUri(json, function (result) {
                    console.log("failed respnose: " + JSON.stringify(result));
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
    
    
    describe('#addClientAllowedUriSuper()', function () {
        it('should add a client super allowed uri', function (done) {

            var json = {
                uri: 'http://www.ulbora.google.com',
                clientId: clientId
            };
            setTimeout(function () {
                clientAllowedUriManager.addClientAllowedUriSuper(json, function (result) {
                    if (result.id > -1) {
                        clientAllowedUriId2 = result.id;
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
        it('should a uri in manager', function (done) {           
            setTimeout(function () {                
                clientAllowedUriManager.getClientAllowedUriById(clientAllowedUriId, function (result) {
                    if (result && result.id && result.uri === "http://www.google.com") {                        
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
        it('should update a client allowed URI in manager', function (done) { 
            
           var json = {                
                uri: 'http://www.google1.com',
                id: clientAllowedUriId
            };
            setTimeout(function () {
                clientAllowedUriManager.updateClientAllowedUri(json, function (result) {
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
    
    
    describe('#updateClientAllowedUriSuper()', function () {
        it('should update a super client allowed URI in manager', function (done) { 
            
           var json = {                
                uri: 'http://www.ulbora.google1.com',
                id: clientAllowedUriId2
            };
            setTimeout(function () {
                clientAllowedUriManager.updateClientAllowedUriSuper(json, function (result) {
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
    
    
    describe('#updateClientAllowedUri()', function () {
        it('should fail to update a client allowed URI in manager', function (done) { 
            
           var json = {                
                uri: 'http://www.ulboragoogle1.com',
                id: clientAllowedUriId
            };
            setTimeout(function () {
                clientAllowedUriManager.updateClientAllowedUri(json, function (result) {
                    console.log("failed update respnose: " + JSON.stringify(result))
                    if (result.success) {                        
                        assert(false);
                    } else {
                        assert(true);
                    }
                    done();
                });
            }, 1000);           
        });
    });

    describe('#getClientAllowedUriList()', function () {
        it('should read client allowed uri list', function (done) {
            setTimeout(function () {
                clientAllowedUriManager.getClientAllowedUriList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].uri === "http://www.google1.com") {
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
                clientAllowedUriManager.getClientAllowedUri(clientId, 'http://www.google1.com', function (result) {
                    if (result && result.uri === "http://www.google1.com") {                        
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
                clientAllowedUriManager.deleteClientAllowedUri(clientAllowedUriId, function (result) {
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
                clientAllowedUriManager.deleteClientAllowedUri(clientAllowedUriId2, function (result) {
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



