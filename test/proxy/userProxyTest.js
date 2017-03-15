var assert = require('assert');
var userProxy = require("../../proxies/userProxy");

describe('userProxy', function () {
    this.timeout(20000);



    describe('#login()', function () {
        it('should fail to login', function (done) {

            var json = {
                username: "tester2",
                password: "tester2"
            };
            setTimeout(function () {
                userProxy.login(json, function (result) {
                    console.log('login: ', JSON.stringify(result));
                    if (!result.valid) {
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



