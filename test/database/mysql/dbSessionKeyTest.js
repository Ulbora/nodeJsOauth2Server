var assert = require('assert');
var db = require("../../../database/mysql/db");


describe('mysql DB session key', function () {
    this.timeout(20000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            db.testConnection(function (success) {
                if (success) {                    
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });
        });
    });
    
    
    describe('#getSessionKey()', function () {
        it('should get session key in processor', function (done) {           
            setTimeout(function () {                
                db.getSessionKey(function (result) {
                    console.log("session key result:" + JSON.stringify(result));
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

