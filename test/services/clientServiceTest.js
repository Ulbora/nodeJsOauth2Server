var assert = require('assert');
var db = require("../../database/db");
//var service = require("../../../services/service");
var clientService = require("../../services/clientService");
var accessTokenDelegate = require("../../delegates/accessTokenDelegate");
var token;
var clientId;
var clientObj;

describe('clientService', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientService.init(db);
                accessTokenDelegate.init(db);
                done();
            }, 1000);
        });
    });

    describe('#generateAccessToken()', function () {
        it('should generateAccessToken', function (done) {
            var payload = {
                sub: "access",
                grant: "code",
                userId: "firns",
                clientId: 5562,
                roleUris: [                    
                    {"clientRoleId": 11, "role": "superAdmin", "uriId": 95, "uri": "/ulbora/rs/client/add", "clientId": 421},
                    {"clientRoleId": 11, "role": "superAdmin", "uriId": 95, "uri": "/ulbora/rs/client/delete", "clientId": 421},
                    {"clientRoleId": 11, "role": "superAdmin", "uriId": 95, "uri": "/ulbora/rs/client/update", "clientId": 421},
                    {"clientRoleId": 11, "role": "superAdmin", "uriId": 95, "uri": "/ulbora/rs/client/get", "clientId": 421},
                    {"clientRoleId": 11, "role": "superAdmin", "uriId": 95, "uri": "/ulbora/rs/client/list", "clientId": 421},
                    {"clientRoleId": 11, "role": "admin", "uriId": 95, "uri": "/ulbora/rs/client/admin/get", "clientId": 421},
                    {"clientRoleId": 11, "role": "superAdmin", "uriId": 95, "uri": "/ulbora/rs/client/search", "clientId": 421}
                    
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
                    }else{
                        assert(false);
                    }
                    done();
                };
                clientService.add(req, res);
            }, 1000);
        });
    });


    describe('#addClient()', function () {
        it('should fail to add addClient because of bad token', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + "516dsfdfdsfdsf";
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
                }
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(true);
                    } else if (val && val.clientId) {
                        clientId = val.clientId;
                        console.log("add client reaponse: " + JSON.stringify(val));
                        assert(true);
                    }else{
                        assert(false);
                    }
                    done();
                };
                clientService.add(req, res);
            }, 1000);
        });
    });


     describe('#updateClient()', function () {
        it('should updateClient', function (done) {
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
                    clientId: clientId,
                    secret: null,
                    name: 'ulbora',
                    webSite: 'www.ulboralabs.com',
                    email: 'ulbora@ulbora.com',
                    enabled: false                   
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
                        console.log("update client reaponse: " + JSON.stringify(val));
                        assert(true);
                    }else{
                        assert(false);
                    }
                    done();
                };
                clientService.update(req, res);
            }, 1000);
        });
    });

    
    describe('#get()', function () {
        it('should get a client', function (done) {
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
                    } else if (val && val.clientId) {
                        console.log("get client reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientService.get(req, res);
            }, 1000);
        });
    });
    
    
    
    describe('#adminGet()', function () {
        it('should get a client for admin', function (done) {
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
                    } else if (val && val.clientId) {
                        console.log("get client reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientService.adminGet(req, res);
            }, 1000);
        });
    });
        
    
    describe('#adminGet()', function () {
        it('should fail get a client for admin', function (done) {
            setTimeout(function () {
                var req = {};
                var header = function (val) {
                    if (val === "Authorization") {
                        return "Bearer " + token;
                    } else if (val === "userId") {
                        return "admin";
                    } else if (val === "clientId") {
                        return null;
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
                        assert(true);
                    }
                    done();
                };
                clientService.adminGet(req, res);
            }, 1000);
        });
    });



    describe('#list()', function () {
        it('should get a list of clients', function (done) {
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
                
                var res = {};
                res.statusCode;
                res.status = function (val) {
                    this.statusCode = val;
                    console.log("res status: " + val);
                };
                res.send = function (val) {
                    if (this.statusCode === 401) {
                        assert(false);
                    } else if (val) {
                        console.log("get client list reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientService.list(req, res);
            }, 1000);
        });
    });
    
    

    describe('#search()', function () {
        it('should search a list of clients', function (done) {
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
                    } else if (val) {
                        console.log("get client search reaponse: " + JSON.stringify(val));
                        assert(true);
                    }
                    done();
                };
                clientService.search(req, res);
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


