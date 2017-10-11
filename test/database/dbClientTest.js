var assert = require('assert');
var db = require("../../database/db");
var clientId;
describe('DB client', function () {
    this.timeout(20000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);   
            setTimeout(function () {
                done();
            }, 1000);
        });
    });

    describe('#addClient()', function () {
        it('should add a client', function (done) {

            var clientJson = {
                secret: '12345',
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            var uriList = [
                {
                    uri: 'http://www.google.com',
                    clientId: null
                },
                {
                    uri: 'http://www.ulboralabs.com',
                    clientId: null
                }
            ];
            setTimeout(function () {
                db.addClient(clientJson, uriList, function (result) {
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

    describe('#updateClient()', function () {
        it('should add a client', function (done) {

            var json = {
                secret: '123456',
                redirectUri: 'http://ulboralabs.com',
                name: 'Bob and Company 123',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: false,
                clientId: clientId
            };
            setTimeout(function () {
                db.updateClient(json, function (result) {
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
                db.getClient(clientId, function (result) {
                    if (result && result.name === 'Bob and Company 123' && result.enabled === false) {
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
                db.getClientList(function (result) {
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
    
    
    describe('#getClientSearchList()', function () {
        it('should read client list in search', function (done) {
            setTimeout(function () {
                db.getClientSearchList("Company 123" , function (result) {
                    console.log("name: " + result[0].name)
                    if (result && result.length > 0 && result[0].name === "Bob and Company 123" ) {
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
                db.deleteClient(clientId, function (result) {
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

