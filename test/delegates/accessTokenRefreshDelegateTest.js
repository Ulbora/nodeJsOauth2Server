var assert = require('assert');
var db = require("../../database/db");
var authorizationCodeManager = require("../../managers/authorizationCodeManager");
var accessTokenRefreshDelegate = require("../../delegates/accessTokenRefreshDelegate");
var clientManager = require("../../managers/clientManager");
var clientGrantTypeManager = require("../../managers/clientGrantTypeManager");
var clientId;
var clientObj;
var clientGrantTypeId;
var authorizationCode;
describe('Access Token Refresh Delegate', function () {
    this.timeout(40000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientManager.init(db);
                authorizationCodeManager.init(db);
                clientGrantTypeManager.init(db);
                accessTokenRefreshDelegate.init(db);
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
                db.addClientRole(json, function (result) {
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
        it('should add a client allowed URI', function (done) {

            var json = {
                uri: 'http://ulboralabs.com',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientAllowedUri(json, function (result) {
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
                db.addClientRoleUri(json, function (result) {
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
                        clientGrantTypeId = result.id;
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
        it('should fail to authorize a client user because redirect uri is not allowed', function (done) {
            var json = {
                clientId: clientId,
                userId: "admin",
                scope: "read",
                redirectUri: "http://www.google.org"
            };
            setTimeout(function () {
                authorizationCodeManager.authorize(json, function (result) {
                    console.log("authorization code: " + JSON.stringify(result));
                    if (result.authorizationCode === null) {
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
        it('should authorize a client user with the same scope ', function (done) {
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
        it('should authorize a second scope for a client user', function (done) {
            var json = {
                clientId: clientId,
                userId: "admin",
                scope: "addUser",
                redirectUri: "http://www.google.com"
            };
            setTimeout(function () {
                authorizationCodeManager.authorize(json, function (result) {
                    console.log("authorization code 2: " + JSON.stringify(result));
                    if (result.authorizationCode && result.authorizationCode > -1) {
                        authorizationCode = result.authorizationCode;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#getAuthorizationCodeScopeList()', function () {
        it('should read AuthorizationCodeScope in db', function (done) {
            setTimeout(function () {
                db.getAuthorizationCodeScopeList(authorizationCode, function (result) {
                    console.log("getAuthorizationCodeScopeList:" + JSON.stringify(result));
                    if (result && result.length > 1 && result[1].scope === "read") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#checkApplicationAuthorization()', function () {
        it('should checkApplicationAuthorization', function (done) {
            setTimeout(function () {
                var json = {
                    clientId: clientId,
                    userId: "admin",
                    scope: "addUser"
                }
                authorizationCodeManager.checkApplicationAuthorization(json, function (result) {
                    if (result && result.authorized) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#updateAuthorizationCodeAndTokens()', function () {
        it('should update an authorization code and token in manager', function (done) {
            db.getAuthorizationCode(clientId, "admin", function (acResult) {
                console.log("auth code: " + JSON.stringify(acResult));
                db.getAccessToken(acResult.accessTokenId, function (accessTokenResult) {
                    console.log("access token: " + JSON.stringify(accessTokenResult))
                    db.getClient(clientId, function (clientResult) {
                        console.log("client: " + JSON.stringify(clientResult))
                        db.getRefreshToken(accessTokenResult.refreshTokenId, function (refreshResult) {
                            console.log("refreshResult: " + JSON.stringify(refreshResult))
                            setTimeout(function () {
                                var json = {
                                    clientId: clientId,
                                    secret: clientResult.secret,
                                    refreshToken: refreshResult.token
                                };
                                accessTokenRefreshDelegate.refreshToken(json, function (refreshedTokenResult) {
                                    console.log("refreshedTokenResult:" + JSON.stringify(refreshedTokenResult));
                                    if (refreshedTokenResult.access_token) {
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
            });
        });
    });
    
    
    describe('#updateAuthorizationCodeAndTokens()', function () {
        it('should fail to update an authorization code and token in manager', function (done) {
            db.getAuthorizationCode(clientId, "admin", function (acResult) {
                db.getAccessToken(acResult.accessTokenId, function (accessTokenResult) {
                    db.getClient(clientId, function (clientResult) {
                        db.getRefreshToken(accessTokenResult.refreshTokenId, function (refreshResult) {
                            setTimeout(function () {
                                var json = {
                                    clientId: clientId,
                                    secret: "fff",
                                    refreshToken: refreshResult.token
                                };
                                accessTokenRefreshDelegate.refreshToken(json, function (refreshedTokenResult) {
                                    console.log("refreshedTokenResult:" + JSON.stringify(refreshedTokenResult));
                                    if (refreshedTokenResult.error === "invalid_client") {
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
            });
        });
    });

    describe('#validateClientCallback()', function () {
        it('should validateClientCallback', function (done) {
            setTimeout(function () {
                var json = {
                    clientId: clientId,
                    callbackUri: "http://www.google.com"
                }
                authorizationCodeManager.validateClientAndCallback(json, function (result) {
                    if (result && result.valid) {
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
                clientGrantTypeManager.deleteClientGrantType(clientGrantTypeId, function (result) {
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
                db.deleteClientRoleUri(json, function (result) {
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
                db.deleteClientRole(clientRoleId, function (result) {
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
                db.deleteClientAllowedUri(clientAllowedUriId, function (result) {
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



