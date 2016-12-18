var assert = require('assert');
var db = require("../../../database/mysql/db");
var tokenId;
var refreshTokenId;

describe('mysql DB client allow uri', function () {
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
    
    describe('#addRefreshToken()', function () {
        it('should add a refresh token in db', function (done) {             
           var json = {
                token: 'djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf'
            };
            setTimeout(function () {
                db.addRefreshToken(null, json, function (result) {
                    if (result.id > -1) {
                        refreshTokenId = result.id;
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
           today.setTime(today.getTime() + (8*60*60*1000)); 
           var json = {
                token: 'djfjoiqjldktrtryrtyrytrsflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf',
                expires: today,
                refreshTokenId: refreshTokenId
            };
            setTimeout(function () {
                db.addAccessToken(null, json, function (result) {
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
    
   
    describe('#getAccessToken()', function () {
        it('should read access token in processor', function (done) {           
            setTimeout(function () {                
                db.getAccessToken( tokenId, function (result) {
                    console.log("access token result:" + JSON.stringify(result));
                    if (result && result.token === 'djfjoiqjldktrtryrtyrytrsflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf') {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });
    
    describe('#deleteAccessToken()', function () {
        it('should delete access token', function (done) {           
            setTimeout(function () {                
                db.deleteAccessToken(null, tokenId, function (result) {
                    if (result.success) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);           
        });
    });    
    
    
    
    describe('#deleteRefreshToken()', function () {
        it('should delete refresh token in db', function (done) {           
            setTimeout(function () {                
                db.deleteRefreshToken(null, refreshTokenId, function (result) {
                    if (result.success) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 5000);           
        });
    });    
});

