var assert = require('assert');
var db = require("../../database/db");
var clientManager = require("../../managers/clientManager");
var clientAllowedUriManager = require("../../managers/clientAllowedUriManager");
var clientRoleManager = require("../../managers/clientRoleManager");
var clientRoleUriManager = require("../../managers/clientRoleUriManager");
var clientGrantTypeManager = require("../../managers/clientGrantTypeManager");
var authorizationCodeManager = require("../../managers/authorizationCodeManager");
var tokenController = require("../../webControllers/tokenController");
var clientId;
var clientObj;
var clientAllowedUriId;
var clientRoleId;
var clientGrantTypeId1;
var clientGrantTypeId2;
var ac;
var code;

describe('tokenController', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientManager.init(db);
                clientAllowedUriManager.init(db);
                clientRoleManager.init(db);
                clientRoleUriManager.init(db);
                clientGrantTypeManager.init(db);
                tokenController.init(db);
                authorizationCodeManager.init(db);
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

    describe('#addClientRole()', function () {
        it('should add a client role', function (done) {

            var json = {
                role: 'superuser',
                clientId: clientId
            };
            setTimeout(function () {
                clientRoleManager.addClientRole(json, function (result) {
                    if (result.id > -1) {
                        clientRoleId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
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
            }, 1000);
        });
    });


    describe('#addClientRoleUri()', function () {
        it('should add a client Role Uri', function (done) {

            var json = {
                clientRoleId: clientRoleId,
                clientAllowedUriId: clientAllowedUriId
            };
            setTimeout(function () {
                clientRoleUriManager.addClientRoleUri(json, function (result) {
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


    describe('#getClientRoleUriList()', function () {
        it('should get a client Role Uri list', function (done) {
            setTimeout(function () {
                clientRoleUriManager.getClientRoleAllowedUriList(clientRoleId, function (result) {
                    if (result && result.length > 0 && result[0].clientAllowedUriId === clientAllowedUriId) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
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
                    console.log("addClientGrantType: " + JSON.stringify(result));
                    if (result.id > -1) {
                        clientGrantTypeId1 = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });
    
    describe('#addClientGrantType()', function () {
        it('should add a client grant type in db', function (done) {

            var json = {
                grantType: 'client_credentials',
                clientId: clientId
            };
            setTimeout(function () {
                clientGrantTypeManager.addClientGrantType(json, function (result) {
                    console.log("addClientGrantType: " + JSON.stringify(result));
                    if (result.id > -1) {
                        clientGrantTypeId2 = result.id;
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
                db.addClientRedirectUri(json, function (result) {
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

    describe('#authorize()', function () {
        it('should authorize a client user ', function (done) {
            var json = {
                clientId: clientId,
                userId: "admin",
                scope: "read",
                redirectUri: "http://www.google.com"
            };
            setTimeout(function () {
                authorizationCodeManager.authorize(json, function (result) {
                    console.log("authorization code: " + JSON.stringify(result));
                    if (result.authorizationCode && result.authorizationCode > -1) {
                        authorizationCode = result.authorizationCode;
                        code = result.codeString;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#token()', function () {
        it('get a token error', function (done) {
            setTimeout(function () {
                var req = {};
                req.query = {};
                req.query.grant_type = "authorization_code";
                req.query.client_id = clientId;
                req.query.client_secret = "";
                req.query.code = "";
                req.query.redirect_uri = "http://www.google.com";
                req.session = {};
                var unauth;
                var res = {};
                res.status = function (sCode) {
                    var self = {};
                    console.log("res.status:" + sCode);
                    if (sCode === 401) {
                        unauth = true;
                    }
                    var send = function (token) {
                        console.log("res.send:" + JSON.stringify(token));
                        if (token && unauth && token.error === "invalid_request") {
                            assert(true);
                        } else {
                            assert(false);
                        }
                        done();
                    };
                    self.send = send;
                    return self;
                };
                tokenController.token(req, res);
            }, 1000);
        });
    });

    describe('#token()', function () {
        it('get a token', function (done) {
            setTimeout(function () {
                db.getClient(clientId, function (clientResult) {
                    var secret = clientResult.secret;
                    var req = {};
                    req.query = {};
                    req.query.grant_type = "authorization_code";
                    req.query.client_id = clientId;
                    req.query.client_secret = secret;
                    req.query.code = code;
                    req.query.redirect_uri = "http://www.google.com";
                    req.session = {};
                    var res = {};
                    res.status = function (sCode) {
                        var self = {};
                        console.log("res.status:" + sCode);
                        if (sCode === 401) {
                            unauth = true;
                        }
                        var send = function (token) {
                            console.log("res.send:" + JSON.stringify(token));
                            if (token && unauth && token.error === "invalid_request") {
                                assert(true);
                            } else {
                                assert(false);
                            }
                            done();
                        };
                        self.send = send;
                        return self;
                    };
                    res.send = function (token) {
                        console.log("res.send:" + JSON.stringify(token));
                        if (token && token.access_token) {
                            assert(true);
                        } else {
                            assert(false);
                        }
                        done();
                    };
                    tokenController.token(req, res);
                });

            }, 1000);
        });
    });


    describe('#refreshToken()', function () {
        it('get a refreshToken', function (done) {
            setTimeout(function () {
                db.getClient(clientId, function (clientResult) {
                    db.getAuthorizationCode(clientId, "admin", function (acResult) {
                        db.getAccessToken(acResult.accessTokenId, function (accessTokenResult) {
                            db.getRefreshToken(accessTokenResult.refreshTokenId, function (refreshResult) {
                                var secret = clientResult.secret;
                                var req = {};
                                req.query = {};
                                req.query.grant_type = "refresh_token";
                                req.query.client_id = clientId;
                                req.query.client_secret = secret;
                                req.query.refresh_token = refreshResult.token;
                                req.session = {};
                                var res = {};
                                res.status = function (sCode) {
                                    var self = {};
                                    console.log("res.status:" + sCode);
                                    if (sCode === 401) {
                                        unauth = true;
                                    }
                                    var send = function (token) {
                                        console.log("res.send:" + JSON.stringify(token));
                                        if (token && unauth && token.error === "invalid_client") {
                                            assert(true);
                                        } else {
                                            assert(false);
                                        }
                                        done();
                                    };
                                    self.send = send;
                                    return self;
                                };
                                res.send = function (token) {
                                    console.log("res.send:" + JSON.stringify(token));
                                    if (token && token.access_token) {
                                        assert(true);
                                    } else {
                                        assert(false);
                                    }
                                    done();
                                };
                                tokenController.token(req, res);
                            });
                        });
                    });
                });
            }, 1000);
        });
    });

    describe('#refreshToken()', function () {
        it('fail to get a refreshToken', function (done) {
            setTimeout(function () {
                db.getClient(clientId, function (clientResult) {
                    db.getAuthorizationCode(clientId, "admin", function (acResult) {
                        db.getAccessToken(acResult.accessTokenId, function (accessTokenResult) {
                            db.getRefreshToken(accessTokenResult.refreshTokenId, function (refreshResult) {
                                var secret = clientResult.secret;
                                var req = {};
                                req.query = {};
                                req.query.grant_type = "refresh_token";
                                req.query.client_id = clientId;
                                req.query.client_secret = "fffff";
                                req.query.refresh_token = refreshResult.token;
                                req.session = {};
                                var res = {};
                                res.status = function (sCode) {
                                    var self = {};
                                    console.log("res.status:" + sCode);
                                    if (sCode === 401) {
                                        unauth = true;
                                    }
                                    var send = function (token) {
                                        console.log("res.send:" + JSON.stringify(token));
                                        if (token && unauth && token.error === "invalid_client") {
                                            assert(true);
                                        } else {
                                            assert(false);
                                        }
                                        done();
                                    };
                                    self.send = send;
                                    return self;
                                };
                                res.send = function (token) {
                                    console.log("res.send:" + JSON.stringify(token));
                                    if (token && token.access_token) {
                                        assert(true);
                                    } else {
                                        assert(false);
                                    }
                                    done();
                                };
                                tokenController.token(req, res);
                            });
                        });
                    });
                });
            }, 1000);
        });
    });


    describe('#clientGrantToken()', function () {
        it('get a clientGrantToken', function (done) {
            setTimeout(function () {
                db.getClient(clientId, function (clientResult) {                    
                    var secret = clientResult.secret;
                    var req = {};
                    req.query = {};
                    req.query.grant_type = "client_credentials";
                    req.query.client_id = clientId;
                    req.query.client_secret = secret;                   
                    req.session = {};
                    var res = {};
                    res.status = function (sCode) {
                        var self = {};
                        console.log("res.status:" + sCode);
                        if (sCode === 401) {
                            unauth = true;
                        }
                        var send = function (token) {
                            console.log("res.send:" + JSON.stringify(token));
                            if (token && unauth && token.error === "invalid_client") {
                                assert(true);
                            } else {
                                assert(false);
                            }
                            done();
                        };
                        self.send = send;
                        return self;
                    };
                    res.send = function (token) {
                        console.log("res.send:" + JSON.stringify(token));
                        if (token && token.access_token) {
                            assert(true);
                        } else {
                            assert(false);
                        }
                        done();
                    };
                    tokenController.token(req, res);                    
                });
            }, 1000);
        });
    });
    
    
    
    describe('#deleteCredentialsGrant()', function () {
        it('should delete CredentialsGrant in db', function (done) {           
            setTimeout(function () {                
                db.deleteCredentialsGrant(clientId, function (result) {
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

    describe('#deleteAuthorizationCode()', function () {
        it('should delete authorization code', function (done) {
            setTimeout(function () {
                var json = {
                    clientId: clientId,
                    userId: "admin"
                };
                authorizationCodeManager.deleteAuthorizationCode(json, function (result) {
                    console.log("deleteAuthorizationCode:" + JSON.stringify(result));
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



    describe('#deleteClientRedirectUri()', function () {
        it('should delete client redirect uri', function (done) {
            setTimeout(function () {
                db.deleteAllClientRedirectUri(clientId, function (result) {
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

    describe('#deleteClientGrantType()', function () {
        it('should delete client grant type', function (done) {
            setTimeout(function () {
                clientGrantTypeManager.deleteClientGrantType(clientGrantTypeId1, function (result) {
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
    
     describe('#deleteClientGrantType()', function () {
        it('should delete client grant type', function (done) {
            setTimeout(function () {
                clientGrantTypeManager.deleteClientGrantType(clientGrantTypeId2, function (result) {
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

    describe('#deleteClientRoleUri()', function () {
        it('should delete a client Role Uri', function (done) {
            var json = {
                clientRoleId: clientRoleId,
                clientAllowedUriId: clientAllowedUriId
            };
            setTimeout(function () {
                clientRoleUriManager.deleteClientRoleUri(json, function (result) {
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

    describe('#deleteClientRole()', function () {
        it('should delete client role', function (done) {
            setTimeout(function () {
                clientRoleManager.deleteClientRole(clientRoleId, function (result) {
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



