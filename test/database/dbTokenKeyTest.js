var assert = require('assert');
var db = require("../../database/db");


describe('DB token key', function () {
    this.timeout(20000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                done();
            }, 1000);
        });
    });
    
    describe('#getAccessTokenKey()', function () {
        it('should get access token key in processor', function (done) {           
            setTimeout(function () {                
                db.getAccessTokenKey(function (result) {
                    console.log("access token key result:" + JSON.stringify(result));
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
    
       
    describe('#getRefreshTokenKey()', function () {
        it('should get refresh token key in processor', function (done) {           
            setTimeout(function () {                
                db.getRefreshTokenKey(function (result) {
                    console.log("refresh token key result:" + JSON.stringify(result));
                    if (result  && result.key) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);           
        });
    });
});

