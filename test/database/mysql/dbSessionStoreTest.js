var assert = require('assert');
var db = require("../../../database/mysql/db");
var session = require('express-session');
var sessionStore;

describe('mysql DB session store', function () {
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
    
    
    describe('#getSessionStore()', function () {
        it('should get session store in db', function (done) {           
            setTimeout(function () {                
                db.getSessionStore(session, function (result) {
                    console.log("session store result:" + JSON.stringify(result.options));
                    if (result) {  
                        sessionStore = result;
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

