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
        it('should get session key in processor', function (done) {
            db.getSessionKey(function (result) {
                console.log("session key result:" + JSON.stringify(result));
                if (result && result.key) {
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });

        });
    });


});

