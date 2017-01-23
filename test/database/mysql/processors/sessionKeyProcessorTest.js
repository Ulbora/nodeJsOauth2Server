var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var sessionKeyProcessor = require("../../../../database/mysql/processors/sessionKeyProcessor");

describe('SessionKeyProcessor', function () {
    this.timeout(7000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
                    sessionKeyProcessor.init(crud);                     
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });
        });
    });

    describe('#getSessionTokenKey()', function () {
        it('should get session key in processor', function (done) {           
            setTimeout(function () {                
                sessionKeyProcessor.getSessionKey(function (result) {
                    console.log("session token key result:" + JSON.stringify(result));
                    if (result && result.key) {                        
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

