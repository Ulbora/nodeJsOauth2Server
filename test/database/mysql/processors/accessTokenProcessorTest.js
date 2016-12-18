var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var accessTokenProcessor = require("../../../../database/mysql/processors/accessTokenProcessor");
var refreshTokenProcessor = require("../../../../database/mysql/processors/refreshTokenProcessor");
var tokenId;
var refreshTokenId;
describe('AccessTokenProcessor', function () {
    this.timeout(6000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (con) {
                if (con) {
                    accessTokenProcessor.init(crud); 
                    refreshTokenProcessor.init(crud);  
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });
        });
    });

    describe('#addRefreshToken()', function () {
        it('should add a refresh token in processor', function (done) {             
           var json = {
                token: 'djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf'
            };
            setTimeout(function () {
                refreshTokenProcessor.addRefreshToken(json, function (result) {
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
                accessTokenProcessor.addAccessToken(json, function (result) {
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
                accessTokenProcessor.getAccessToken( tokenId, function (result) {
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
                accessTokenProcessor.deleteAccessToken( tokenId, function (result) {
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
        it('should delete refresh token', function (done) {           
            setTimeout(function () {                
                refreshTokenProcessor.deleteRefreshToken( refreshTokenId, function (result) {
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

