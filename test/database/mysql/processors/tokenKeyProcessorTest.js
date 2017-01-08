var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var tokenKeyProcessor = require("../../../../database/mysql/processors/tokenKeyProcessor");

describe('TokenKeyProcessor', function () {
    this.timeout(7000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
                    tokenKeyProcessor.init(crud);                     
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });
        });
    });

    describe('#getAccessTokenKey()', function () {
        it('should get access token key in processor', function (done) {           
            setTimeout(function () {                
                tokenKeyProcessor.getAccessTokenKey(function (result) {
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
                tokenKeyProcessor.getRefreshTokenKey(function (result) {
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

