var assert = require('assert');
var db = require("../../database/db");
//var service = require("../../../services/service");
var clientService = require("../../services/clientService");
var clientRedirectUriService = require("../../services/clientRedirectUriService");
var accessTokenDelegate = require("../../delegates/accessTokenDelegate");
var token;
var clientId;
var clientObj;
var clientUriId;

describe('clientRedirectUriService', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientService.init(db);
                accessTokenDelegate.init(db);
                clientRedirectUriService.init(db);
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
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientRedirectUri/add", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/client/add", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/client/delete", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientRedirectUri/update", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientRedirectUri/get", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientRedirectUri/list", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/rs/clientRedirectUri/delete", "clientId": 421}
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


    describe('#clientRedirectUriService()', function () {
        it('should add clientRedirectUri', function (done) {
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
                        clientUriId = val.id;
                        console.log("add clientRedirectUriService reaponse: " + JSON.stringify(val));
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                clientRedirectUriService.add(req, res);
            }, 1000);
        });
    });
    
   
    
    describe('#getclientRedirectUriList()', function () {
        it('should get ClientRedirectUriList', function (done) {
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
                        console.log("get ClientRedirectUriList reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientRedirectUriService.list(req, res);
            }, 1000);
        });
    });
    
    
    
    describe('#deleteClientRedirectUri()', function () {
        it('should delete ClientRedirectUri', function (done) {
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
                req.params.id = clientUriId;
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
                        console.log("delete ClientRedirectUri reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientRedirectUriService.delete(req, res);
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


