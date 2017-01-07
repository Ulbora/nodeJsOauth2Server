var assert = require('assert');
var manager = require("../../managers/manager");
var clientId;
describe('Manager', function () {
    this.timeout(20000);

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
});



