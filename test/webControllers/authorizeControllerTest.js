var assert = require('assert');
var db = require("../../database/db");
var clientManager = require("../../managers/clientManager");
var clientAllowedUriManager = require("../../managers/clientAllowedUriManager");
var clientRoleManager = require("../../managers/clientRoleManager");
var clientRoleUriManager = require("../../managers/clientRoleUriManager");
var clientGrantTypeManager = require("../../managers/clientGrantTypeManager");
var authorizationCodeManager = require("../../managers/authorizationCodeManager");
var authorizeController = require("../../webControllers/authorizeController");
var clientId;
var clientObj;
var clientAllowedUriId;
var clientRoleId;
var ac;

describe('authorizeController', function () {
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
                authorizeController.init(db);
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
        it('should redirect to login page', function (done) {
            setTimeout(function () {
                var req = {};
                req.query = {};
                req.query.response_type = "code";
                req.query.client_id = clientId;
                req.query.redirect_uri = "http://www.google.com";
                req.query.scope = "read";
                req.session = {};
                req.session.loggedIn = false;
                var res = {};
                res.redirect = function (path) {
                    if (path === "/login") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                authorizeController.authorize(req, res);
            }, 1000);
        });
    });

    describe('#authorize()', function () {
        it('should send invalid_grant error', function (done) {
            setTimeout(function () {
                var req = {};
                req.query = {};
                req.query.response_type = "auth";
                req.query.client_id = clientId;
                req.query.redirect_uri = "http://www.google.com";
                req.query.scope = "read";
                req.query.state = "xyzz";
                req.session = {};
                req.session.loggedIn = true;
                req.session.user = "admin";
                var res = {};
                res.render = function (path, params) {
                    if (path === "oauthError" && params && params.error === "invalid_grant") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                res.redirect = function (path) {
                    console.log("authorizeApp path: " + path);                    
                    if (path === "/oauthError?error=invalid_grant") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                authorizeController.authorize(req, res);
            }, 1000);
        });
    });

    describe('#authorize()', function () {
        it('should send invalid_grant error', function (done) {
            setTimeout(function () {
                var req = {};
                req.query = {};
                //req.query.response_type = "auth";
                req.query.client_id = clientId;
                req.query.redirect_uri = "http://www.google.com";
                req.query.scope = "read";
                req.session = {};
                req.session.loggedIn = true;
                req.session.user = "admin";
                var res = {};
                res.render = function (path, params) {
                    if (path === "oauthError" && params && params.error === "invalid_grant") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                res.redirect = function (path) {
                    console.log("authorizeApp path: " + path);                    
                    if (path === "/oauthError?error=invalid_grant") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                authorizeController.authorize(req, res);
            }, 1000);
        });
    });

    describe('#authorize()', function () {
        it('should send to authorize application page', function (done) {
            setTimeout(function () {
                var req = {};
                req.query = {};
                req.query.response_type = "code";
                req.query.client_id = clientId;
                req.query.redirect_uri = "http://www.google.com";
                req.query.scope = "read";
                req.query.state = "xyzz";
                req.session = {};
                req.session.loggedIn = true;
                req.session.user = "admin";
                var res = {};
                res.redirect = function (path) {
                    if (path === "/authorizeApp" && req.session.oauthGrantObj) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                authorizeController.authorize(req, res);
            }, 1000);
        });
    });



    /*
     describe('#authorize()', function () {
     it('should authorize a user and client', function (done) {
     setTimeout(function () {
     var req = {};
     req.query = {};
     req.query.response_type = "code";
     req.query.client_id = clientId;
     req.query.redirect_uri = "http://www.google.com";
     req.query.scope = "read";
     req.session = {};
     req.session.loggedIn = true;
     req.session.user = "admin1";
     var res = {};
     authorizeController.authorize(req, res);
     }, 1000);
     });
     }); 
     */

    describe('#authorizeApp()', function () {
        it('should send to authorize application page', function (done) {
            setTimeout(function () {
                var req = {};
                req.session = {};
                req.session.oauthGrantObj = {};
                req.session.oauthGrantObj.responseType = "code";
                req.session.oauthGrantObj.clientId = clientId;
                req.session.oauthGrantObj.redirectUri = "http://www.google.com";
                req.session.oauthGrantObj.scope = "read";
                req.session.oauthGrantObj.state = "xyz";
                req.session.loggedIn = true;
                req.session.user = "admin";
                var res = {};
                res.render = function (path, params) {
                    console.log("authorizeApp path: " + path);
                    console.log("authorizeApp params: " + JSON.stringify(params));
                    if (path === "authorizeApp" && params.title === "authorize application" && params.clientName === "ulbora") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                res.redirect = function (path) {
                    console.log("authorizeApp path: " + path);                    
                    if (path === "/oauthError?error=invalid_grant") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                authorizeController.authorizeApp(req, res);
            }, 1000);
        });
    });

    describe('#authorizeApp()', function () {
        it('should send to invalid uri page', function (done) {
            setTimeout(function () {
                var req = {};
                req.session = {};
                req.session.oauthGrantObj = {};
                req.session.oauthGrantObj.responseType = "code";
                req.session.oauthGrantObj.clientId = clientId;
                req.session.oauthGrantObj.redirectUri = "http://www.google.org";
                req.session.oauthGrantObj.scope = "read";
                req.session.oauthGrantObj.state = "xyz";
                req.session.loggedIn = true;
                req.session.user = "admin";
                var res = {};
                res.render = function (path, params) {
                    console.log("authorizeApp bad redirect uri path: " + path);
                    if (path === "oauthError" && params.error === "Invalid redirect URI") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                authorizeController.authorizeApp(req, res);
            }, 1000);
        });
    });

    describe('#applicationAuthorization()', function () {
        it('should Authorization application', function (done) {
            setTimeout(function () {
                var req = {};
                req.session = {};
                req.session.oauthGrantObj = {};
                req.session.oauthGrantObj.responseType = "code";
                req.session.oauthGrantObj.clientId = clientId;
                req.session.oauthGrantObj.redirectUri = "http://www.google.com";
                req.session.oauthGrantObj.scope = "read";
                req.session.oauthGrantObj.state = "xyz";
                req.session.loggedIn = true;
                req.session.user = "admin";
                req.query = {};
                req.query.authorize = "true";
                var res = {};
                res.render = function (path, params) {
                    assert(false);
                    done();
                };
                res.redirect = function (path) {
                    console.log("redirect path: " + path);
                    var i = path.indexOf("http://www.google.com?code=");
                    if (i > -1) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                authorizeController.applicationAuthorization(req, res);
            }, 1000);
        });
    });

    describe('#applicationAuthorization()', function () {
        it('should fail to Authorization application with redirect error', function (done) {
            setTimeout(function () {
                var req = {};
                req.session = {};
                req.session.oauthGrantObj = {};
                req.session.oauthGrantObj.responseType = "code";
                req.session.oauthGrantObj.clientId = clientId;
                req.session.oauthGrantObj.redirectUri = "http://www.google.org";
                req.session.oauthGrantObj.scope = "read";
                req.session.oauthGrantObj.state = "xyz";
                req.session.loggedIn = true;
                req.session.user = "admin";
                req.query = {};
                req.query.authorize = "true";
                var res = {};
                res.render = function (path, params) {
                    if (path === "oauthError") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                res.redirect = function (path) {
                    console.log("redirect path: " + path);
                    var i = path.indexOf("http://www.google.org?code=");
                    if (i > -1) {
                        assert(false);
                    } else {
                        assert(true);
                    }
                    done();
                };
                authorizeController.applicationAuthorization(req, res);
            }, 1000);
        });
    });

    describe('#authorize()', function () {
        it('should send to authorize application page', function (done) {
            setTimeout(function () {
                var req = {};
                req.query = {};
                req.query.response_type = "code";
                req.query.client_id = clientId;
                req.query.redirect_uri = "http://www.google.com";
                req.query.scope = "read";
                req.query.state = "xyz";
                req.session = {};
                req.session.loggedIn = true;
                req.session.user = "admin";
                var res = {};
                res.redirect = function (path) {
                    console.log("redirect path: " + path);
                    var i = path.indexOf("http://www.google.com?code=");
                    var o = path.indexOf("state=xyz");
                    if (i > -1 && o > -1) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                };
                authorizeController.authorize(req, res);
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



