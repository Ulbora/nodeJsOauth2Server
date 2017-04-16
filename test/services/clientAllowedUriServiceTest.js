var assert = require('assert');
var db = require("../../database/db");
//var service = require("../../../services/service");
var clientService = require("../../services/clientService");
var clientAllowedUriService = require("../../services/clientAllowedUriService");
var accessTokenDelegate = require("../../delegates/accessTokenDelegate");
var token;
var clientId;
var clientObj;
var clientAllowedUriId;

describe('clientService', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientService.init(db);
                accessTokenDelegate.init(db);
                clientAllowedUriService.init(db);
                done();
            }, 1000);
        });
    });

    describe('#generateAccessToken()', function () {
        it('should generateAccessToken', function (done) {
            var payload = {
                sub: "access",
                grant: "code",
                userId: "admin",
                clientId: 5562,
                roleUris: [
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientAllowedUri/add", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/client/add", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/client/delete", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientAllowedUri/update", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientAllowedUri/get", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientAllowedUri/list", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientAllowedUri/delete", "clientId": 421}
                ],
                scopeList: ["read", "write", "update"],
                expiresIn: 500
            };
            setTimeout(function () {
                accessTokenDelegate.generateAccessToken(payload, function (accessToken) {
                    if (accessToken) {
                        token = accessToken;
                        console.log("access token: " + accessToken);
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#addClient()', function () {
        it('should addClient', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return "admin";
                    } else if (val === "clientId") {
                        return "5562";
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                req.body = {
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
                req.is = function (val) {
                    if (val === 'application/json') {
                        return true;
                    } else {
                        return false;
                    }
                };
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(false);
                    } else if (val && val.clientId) {
                        clientObj = val;
                        clientId = val.clientId;
                        console.log("add client reaponse: " + JSON.stringify(val));
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                clientService.add(req, res);
            }, 1000);
        });
    });


    describe('#addClientAllowedUri()', function () {
        it('should addClientAllowedUri', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return "admin";
                    } else if (val === "clientId") {
                        return "5562";
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                req.body = {
                    uri: 'http://www.google.com',
                    clientId: clientId
                };
                req.is = function (val) {
                    if (val === 'application/json') {
                        return true;
                    } else {
                        return false;
                    }
                };
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(false);
                    } else if (val && val.id) {
                        clientAllowedUriId = val.id;
                        console.log("add ClientAllowedUri reaponse: " + JSON.stringify(val));
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                clientAllowedUriService.add(req, res);
            }, 1000);
        });
    });

    describe('#updateClientAllowedUri()', function () {
        it('should updateClientAllowedUri', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return "admin";
                    } else if (val === "clientId") {
                        return "5562";
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                req.body = {
                    uri: 'http://www.google1.com',
                    id: clientAllowedUriId
                };
                req.is = function (val) {
                    if (val === 'application/json') {
                        return true;
                    } else {
                        return false;
                    }
                };
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(false);
                    } else if (val && val.success) {                        
                        console.log("update ClientAllowedUri reaponse: " + JSON.stringify(val));
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                clientAllowedUriService.update(req, res);
            }, 1000);
        });
    });

    
    describe('#getClientAllowedUri()', function () {
        it('should get ClientAllowedUri', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return "admin";
                    } else if (val === "clientId") {
                        return "5562";
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                req.params = {};
                req.params.id = clientAllowedUriId;
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(false);
                    } else if (val && val.uri === "http://www.google1.com") {
                        console.log("get ClientAllowedUri reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientAllowedUriService.get(req, res);
            }, 1000);
        });
    });
    
    describe('#getClientAllowedUriList()', function () {
        it('should get ClientAllowedUriList', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return "admin";
                    } else if (val === "clientId") {
                        return "5562";
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                req.params = {};
                req.params.clientId = clientId;
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(false);
                    } else if (val && val.length === 1) {
                        console.log("get List ClientAllowedUri reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientAllowedUriService.list(req, res);
            }, 1000);
        });
    });
    
    
    
    describe('#deleteClientAllowedUri()', function () {
        it('should delete ClientAllowedUri', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return "admin";
                    } else if (val === "clientId") {
                        return "5562";
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                req.params = {};
                req.params.id = clientAllowedUriId;
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(false);
                    } else if (val && val.success) {
                        console.log("delete ClientAllowedUri reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientAllowedUriService.delete(req, res);
            }, 1000);
        });
    });



    describe('#delete()', function () {
        it('should delete a client', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return "admin";
                    } else if (val === "clientId") {
                        return "5562";
                    }
                };
                req.header = header;
                req.protocol = "https";
                req.hostname = "abc.com";
                req.params = {};
                req.params.id = clientId;
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(false);
                    } else if (val && val.success) {
                        console.log("delete client reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientService.delete(req, res);
            }, 1000);
        });
    });



});


