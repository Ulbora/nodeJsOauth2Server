var assert = require('assert');
var manager = require("../../managers/manager");
var clientManager = require("../../managers/clientManager");
var clientGrantTypeManager = require("../../managers/clientGrantTypeManager");
var db = require("../../database/db");
var clientId;
describe('Manager', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                manager.init(db);
                clientManager.init(db);
                clientGrantTypeManager.init(db);
                done();
            }, 1000);
        });
    });
    
    
    describe('#generateClientSecret()', function () {
        it('should generate a client secret', function (done) {
            var secret = manager.generateClientSecret();
            console.log("client secret: " + secret);
            if (secret) {
                assert(true);
            } else {
                assert(false);
            }
            done();
        });
    });

    describe('#securityCheck()', function () {
        it('should do a security check on json with no issues', function (done) {
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
            var secure = manager.securityCheck(clientJson);            
            if (secure) {
                assert(true);
            } else {
                assert(false);
            }
            done();
        });
    });
    
    
    describe('#securityCheck()', function () {
        it('should do a security check on json and find an issue', function (done) {
            var clientJson = {
                secret: null,
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true,
                redirectUrls: [
                    {
                        uri: 'http://www.google.com',
                        clientId: "function(){}"
                    },
                    {
                        uri: 'http://www.ulboralabs.com',
                        clientId: null
                    }
                ]
            };
            var secure = manager.securityCheck(clientJson);            
            if (!secure) {
                assert(true);
            } else {
                assert(false);
            }
            done();
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
    
    
     describe('#addClientGrantType()', function () {
        it('should add a client grant type in db', function (done) {

            var json = {
                grantType: 'code',
                clientId: clientId
            };
            setTimeout(function () {
                clientGrantTypeManager.addClientGrantType(json, function (result) {
                    if (result.id > -1) {
                        clientGrantTypeId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);
        });
    });
    
    
    
     describe('#GrantTypeTurnedOn()', function () {
        it('should check that the client grant type is turned on', function (done) {            
            setTimeout(function () {
                manager.grantTypeTurnedOn(clientId, "code", function (result) {
                    if (result) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);
        });
    });
    
    
    describe('#deleteClientGrantType()', function () {
        it('should delete client grant type in db', function (done) {
            setTimeout(function () {
                clientGrantTypeManager.deleteClientGrantType(clientGrantTypeId, function (result) {
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
            }, 6000);
        });
    });

});



