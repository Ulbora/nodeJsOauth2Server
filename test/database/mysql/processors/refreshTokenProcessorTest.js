var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var refreshTokenProcessor = require("../../../../database/mysql/processors/refreshTokenProcessor");
var tokenId;
describe('RefreshTokenProcessor', function () {
    this.timeout(6000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
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
                refreshTokenProcessor.addRefreshToken(null, json, function (result) {
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
    
    
    describe('#updateRefreshToken()', function () {
        it('should update a refresh token in processor', function (done) {             
           var json = {
                token: '111djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf',
                id: tokenId
            };
            setTimeout(function () {
                refreshTokenProcessor.updateRefreshToken(null, json, function (result) {
                    if (result.success) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 2000);           
        });
    });
   
    describe('#getRefreshToken()', function () {
        it('should read refresh token in processor', function (done) {           
            setTimeout(function () {                
                refreshTokenProcessor.getRefreshToken( tokenId, function (result) {
                    console.log("refresh token value:" + result.token);
                    if (result && result.token === '111djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf') {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });
    
    
    describe('#deleteRefreshToken()', function () {
        it('should delete refresh token', function (done) {           
            setTimeout(function () {                
                refreshTokenProcessor.deleteRefreshToken(null, tokenId, function (result) {
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
});

