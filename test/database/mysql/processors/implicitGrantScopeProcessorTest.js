var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var accessTokenProcessor = require("../../../../database/mysql/processors/accessTokenProcessor");
var clientProcessor = require("../../../../database/mysql/processors/clientProcessor");
var implicitGrantProcessor = require("../../../../database/mysql/processors/implicitGrantProcessor");
var implicitGrantScopeProcessor = require("../../../../database/mysql/processors/implicitGrantScopeProcessor");
var clientId;
var tokenId;
var imId;
var imScope;
//var acScope2

describe('authorizationCodeScopeProcessor', function () {
    this.timeout(15000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {
                    accessTokenProcessor.init(crud);
                    clientProcessor.init(crud);
                    implicitGrantProcessor.init(crud);
                    implicitGrantScopeProcessor.init(crud);
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });
        });
    });

    describe('#addClient()', function () {
        it('should add a client in clientProcessor', function (done) {

            var json = {
                secret: '12345',                
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            setTimeout(function () {
                clientProcessor.addClient(null, json, function (result) {
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

    describe('#addAccessToken()', function () {
        it('should add a access token in processor', function (done) {
            var today = new Date();
            today.setTime(today.getTime() + (8 * 60 * 60 * 1000));
            var json = {
                token: 'djfjoiqjldktrtryrtyrytrsflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf',
                expires: today
            };
            setTimeout(function () {
                accessTokenProcessor.addAccessToken(null, json, function (result) {
                    if (result.id > -1) {
                        tokenId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);
        });
    });
    

    describe('#addImplicitGrant()', function () {
        it('should add an ImplicitGrant in processor', function (done) {
            var today = new Date();
            today.setTime(today.getTime() + (8 * 60 * 60 * 1000));
            var json = {
                clientId: clientId,
                userId: "admin",                
                accessTokenId: tokenId
            };
            setTimeout(function () {
                implicitGrantProcessor.addImplicitGrant(null, json, function (result) {
                    if (result.id > -1) {
                        imId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);
        });
    });
    
    
    describe('#addImplicitGrantScope()', function () {
        it('should add an ImplicitGrant scope in processor', function (done) {            
            var json = {
                scope: "scopeTest",
                implicitGrantId: imId
            };
            setTimeout(function () {
                implicitGrantScopeProcessor.addImplicitGrantScope(null, json, function (result) {
                    if (result.id > -1) {
                        imScope = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);
        });
    });
    
    describe('#addImplicitGrantScopeAgain()', function () {
        it('should add another ImplicitGrant scope in processor', function (done) {            
            var json = {
                scope: "scopeTest2",
                implicitGrantId: imId
            };
            setTimeout(function () {
                implicitGrantScopeProcessor.addImplicitGrantScope(null, json, function (result) {
                    if (result.id > -1) {
                        //acScope2 = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 5000);
        });
    });
    
    
    describe('#getImplicitGrantScopeList()', function () {
        it('should read ImplicitGrantScope in processor', function (done) {           
            setTimeout(function () {                
                implicitGrantScopeProcessor.getImplicitGrantScopeList(imId, function (result) {
                    if (result && result.length > 1 && result[0].scope === "scopeTest") {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 6000);           
        });
    });

    describe('#deleteImplicitGrantScope()', function () {
        it('should delete ImplicitGrant scope', function (done) {
            setTimeout(function () {
                implicitGrantScopeProcessor.deleteImplicitGrantScope(null, imScope, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 7000);
        });
    });
    
    describe('#deleteImplicitGrantScopeList()', function () {
        it('should delete ImplicitGrant scope list', function (done) {
            setTimeout(function () {
                implicitGrantScopeProcessor.deleteImplicitGrantScopeList(null, imId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 8000);
        });
    });
    
    describe('#deleteImplicitGrant()', function () {
        it('should delete ImplicitGrant', function (done) {
            setTimeout(function () {
                implicitGrantProcessor.deleteImplicitGrant(null, clientId, "admin", function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 9000);
        });
    });

    
    describe('#deleteAccessToken()', function () {
        it('should delete access token', function (done) {
            setTimeout(function () {
                accessTokenProcessor.deleteAccessToken(null, tokenId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 10000);
        });
    });

    describe('#deleteClient()', function () {
        it('should delete client', function (done) {
            setTimeout(function () {
                clientProcessor.deleteClient(null, clientId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 11000);
        });
    });

});

