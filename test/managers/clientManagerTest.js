var assert = require('assert');
var db = require("../../database/db");
var clientManager = require("../../managers/clientManager");
var clientId;
var clientObj;
var redirectUriId
describe('Client Manager', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientManager.init(db);
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

    describe('#getClient()', function () {
        it('should read client', function (done) {
            setTimeout(function () {
                clientManager.getClient(clientId, function (result) {
                    if (result && result.name === 'ulbora' && result.enabled === true) {
                        clientObj = result;
                        console.log("client: " + JSON.stringify(clientObj));
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#updateClient()', function () {
        it('should add a client', function (done) {
            setTimeout(function () {
                clientObj.enabled = false;
                clientManager.updateClient(clientObj, function (result) {
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


    describe('#getClient()', function () {
        it('should read client', function (done) {
            setTimeout(function () {
                clientManager.getClient(clientId, function (result) {
                    console.log("client after adding uri: " + JSON.stringify(result));
                    if (result && result.name === 'ulbora' && result.enabled === false && 
                            result.redirectUrls && result.redirectUrls.length === 2) {
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


    describe('#getClientList()', function () {
        it('should read client list', function (done) {
            setTimeout(function () {
                clientManager.getClientList(function (result) {
                    if (result && result.length > 0) {
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



