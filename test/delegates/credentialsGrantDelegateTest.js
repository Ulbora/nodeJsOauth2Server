var assert = require('assert');
var db = require("../../database/db");
var credentialsGrantDelegate = require("../../delegates/credentialsGrantDelegate");
var clientManager = require("../../managers/clientManager");
var clientGrantTypeManager = require("../../managers/clientGrantTypeManager");
var clientId;
var clientObj;
var clientGrantTypeId;
var authorizationCode;
var code;
describe('clientGrantDelegate', function () {
    this.timeout(40000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientManager.init(db);
                clientGrantTypeManager.init(db);
                credentialsGrantDelegate.init(db);
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
                grantType: 'client_credentials',
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




    describe('#createClientGrant()', function () {
        it('should get invalid_client in createClientGrant with wrong secret', function (done) {
            setTimeout(function () {
                db.getClient(clientId, function (clientResult) {
                    console.log("createClientGrant client: " + JSON.stringify(clientResult));
                    if (clientResult && clientResult.secret) {
                        //var clientSecret = clientResult.secret;
                        var clientGrantJson = {
                            clientId: clientId,
                            secret: "lsldjlkdj"
                        };
                        credentialsGrantDelegate.createClientGrant(clientGrantJson, function (result) {
                            console.log("createClientGrant token: " + JSON.stringify(result));
                            if (result && result.error && result.error === "invalid_client") {
                                assert(true);
                            } else {
                                assert(false);
                            }
                            done();
                        });
                    } else {
                        assert(false);
                    }
                });
            }, 1000);
        });
    });



    describe('#createClientGrant()', function () {
        it('should get token in createClientGrant', function (done) {
            setTimeout(function () {
                db.getClient(clientId, function (clientResult) {
                    if (clientResult && clientResult.secret) {
                        var secret = clientResult.secret;
                        var clientGrantJson = {
                            clientId: clientId,
                            secret: secret
                        };
                        credentialsGrantDelegate.createClientGrant(clientGrantJson, function (result) {
                            console.log("createClientGrant token: " + JSON.stringify(result));
                            if (result && result.token_type && result.token_type === "bearer" &&
                                    result.access_token) {
                                assert(true);
                            } else {
                                assert(false);
                            }
                            done();
                        });
                    } else {
                        assert(false);
                    }
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



    describe('#createClientGrant()', function () {
        it('should get invalid_client in createClientGrant with disabled client', function (done) {
            setTimeout(function () {
                db.getClient(clientId, function (clientResult) {
                    console.log("createClientGrant client: " + JSON.stringify(clientResult));
                    if (clientResult && clientResult.secret) {
                        var secret = clientResult.secret;
                        var clientGrantJson = {
                            clientId: clientId,
                            secret: secret
                        };
                        credentialsGrantDelegate.createClientGrant(clientGrantJson, function (result) {
                            console.log("createClientGrant token: " + JSON.stringify(result));
                            if (result && result.error && result.error === "invalid_client") {
                                assert(true);
                            } else {
                                assert(false);
                            }
                            done();
                        });
                    } else {
                        assert(false);
                    }
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



