var assert = require('assert');
var db = require("../../database/db");
//var service = require("../../../services/service");
var clientService = require("../../services/clientService");
var clientRoleService = require("../../services/clientRoleService");
var clientAllowedUriService = require("../../services/clientAllowedUriService");
var clientRoleUriService = require("../../services/clientRoleUriService");
var accessTokenDelegate = require("../../delegates/accessTokenDelegate");
var token;
var clientId;
var clientObj;
var clientRoleId;
var clientRoleUriId;
var clientAllowedUriId;

describe('clientRoleUriService', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientService.init(db);
                accessTokenDelegate.init(db);
                clientRoleService.init(db);
                clientRoleUriService.init(db);
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
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "https://abc.com/rs/addClient", "clientId": 421}
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

    describe('#addClientRole()', function () {
        it('should add clientRole', function (done) {
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
                    role: 'tester',
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
                        clientRoleId = val.id;
                        console.log("add clientRole reaponse: " + JSON.stringify(val));
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                clientRoleService.add(req, res);
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


    describe('#addClientRoleUri()', function () {
        it('should add clientRoleUri', function (done) {
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
                    clientRoleId: clientRoleId,
                    clientAllowedUriId: clientAllowedUriId
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
                        console.log("add clientRoleUri reaponse: " + JSON.stringify(val));
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                clientRoleUriService.add(req, res);
            }, 1000);
        });
    });



    describe('#ClientRoleUriList()', function () {
        it('should get ClientRoleUriList', function (done) {
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
                req.params.clientRoleId = clientRoleId;
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
                        console.log("get ClientRoleUriList reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientRoleUriService.list(req, res);
            }, 1000);
        });
    });



    describe('#deleteClientRoleUri()', function () {
        it('should delete ClientRoleUri', function (done) {
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
                    clientRoleId: clientRoleId,
                    clientAllowedUriId: clientAllowedUriId
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
                        console.log("delete ClientRoleUri reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientRoleUriService.delete(req, res);
            }, 1000);
        });
    });


    describe('#deleteClientRole()', function () {
        it('should delete ClientRole', function (done) {
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
                req.params.id = clientRoleId;
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
                        console.log("delete ClientRole reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientRoleService.delete(req, res);
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


