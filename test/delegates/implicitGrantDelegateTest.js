var assert = require('assert');
var db = require("../../database/db");
var implicitGrantDelegate = require("../../delegates/implicitGrantDelegate");
var clientId;
var clientRoleId;
var clientAllowedUriId;

describe('Implicit Grant delegate', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                implicitGrantDelegate.init(db);
                done();
            }, 1000);
        });
    });
    
    
    describe('#addClient()', function () {
        it('should add a client', function (done) { 
            
           var json = {
                secret: '12345',                
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            setTimeout(function () {
                db.addClient(json, [], function (result) {
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
    
     describe('#createImplicitGrant()', function () {
        it('should createImplicitGrant', function (done) {
            var json = {
                clientId: clientId,
                userId: "user1"
            };
            setTimeout(function () {
                var scopes = ["read", "modify"];
                implicitGrantDelegate.createImplicitGrant(json, scopes, function (implicitResult) {
                    console.log("implicitResult: " + JSON.stringify(implicitResult));
                    if (implicitResult.success) { 
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });
    
    describe('#deleteImplicitGrant()', function () {
        it('should delete ImplicitGrant', function (done) {
            setTimeout(function () {
                db.deleteImplicitGrant(clientId, "user1", function (result) {
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



