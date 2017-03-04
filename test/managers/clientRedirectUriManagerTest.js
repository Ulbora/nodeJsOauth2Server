var assert = require('assert');
var db = require("../../database/db");
var clientManager = require("../../managers/clientManager");
var clientRedirectUriManager = require("../../managers/clientRedirectUriManager");
var clientId;
var clientObj;
var redirectUriId
describe('Client Redirect URI Manager', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientManager.init(db);
                clientRedirectUriManager.init(db);
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

    

    describe('#addClientRedirectUri()', function () {
        it('should add a client redirect uri', function (done) { 
            
           var json = {                
                uri: 'http://www.google.com',
                clientId: clientId
            };
            setTimeout(function () {
                clientRedirectUriManager.addClientRedirectUri(json, function (result) {
                    if (result.id > -1) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });


    describe('#getClient()', function () {
        it('should read client', function (done) {
            setTimeout(function () {
                clientManager.getClient(clientId, function (result) {
                    console.log("client after adding uri: " + JSON.stringify(result));
                    if (result && result.name === 'ulbora' && result.enabled === true && 
                            result.redirectUrls && result.redirectUrls.length === 3) {
                        redirectUriId = result.redirectUrls[0].id;
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
        it('should read client redirect uri list in db', function (done) {           
            setTimeout(function () {                
                clientRedirectUriManager.getClientRedirectUriList(clientId, function (result) {
                    if (result && result.length === 3 && result[0].uri === 'http://www.google.com') {                        
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
                clientRedirectUriManager.deleteClientRedirectUri(redirectUriId, function (result) {
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



