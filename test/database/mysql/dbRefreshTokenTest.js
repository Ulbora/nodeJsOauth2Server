var assert = require('assert');
var db = require("../../../database/mysql/db");
var tokenId;

describe('mysql DB client allow uri', function () {
    this.timeout(20000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            db.testConnection(function (con) {
                if (con) {
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });
        });
    });
    
    describe('#addRefreshToken()', function () {
        it('should add a refresh token in db', function (done) {             
           var json = {
                token: 'djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf'
            };
            setTimeout(function () {
                db.addRefreshToken(json, function (result) {
                    if (result.id > -1) {
                        tokenId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
   
    describe('#getRefreshToken()', function () {
        it('should read refresh token in db', function (done) {           
            setTimeout(function () {                
                db.getRefreshToken( tokenId, function (result) {
                    console.log("refresh token value:" + result.token);
                    if (result && result.token === 'djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf') {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);           
        });
    });
    
    
    describe('#deleteRefreshToken()', function () {
        it('should delete refresh token in db', function (done) {           
            setTimeout(function () {                
                db.deleteRefreshToken( tokenId, function (result) {
                    if (result.success) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });    
});

