var assert = require('assert');
var db = require("../../database/db");
var clientManager = require("../../managers/clientManager");
var clientAllowedUriManager = require("../../managers/clientAllowedUriManager");
var clientId;
var clientObj;
var clientAllowedUriId;
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
            }, 2000);
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
            }, 3000);
        });
    });

    describe('#getClientAllowedUriList()', function () {
        it('should read client allowed uri list', function (done) {
            setTimeout(function () {
                clientAllowedUriManager.getClientAllowedUriList(clientId, function (result) {
                    if (result && result.length > 0 && result[0].uri === "http://www.google.com") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);
        });
    });
    
    
    describe('#getClientAllowedUri', function () {
        it('should read client uri in processor', function (done) {           
            setTimeout(function () {                
                clientAllowedUriManager.getClientAllowedUri(clientId, 'http://www.google.com', function (result) {
                    if (result && result.uri === "http://www.google.com") {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 5000);           
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



