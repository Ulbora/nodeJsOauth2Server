var assert = require('assert');
var db = require("../../../database/mysql/db");
var insertId;
describe('mysql DB', function () {
    this.timeout(5000);
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
    
    describe('#addClient()', function () {
        it('should add a client', function (done) {            
            var args = {
                secret: '12345',
                redirect_uri: 'http://ulboralabs.com',
                name: 'ulbora',
                web_site: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            setTimeout(function () {
                db.addClient(args, function (id) {
                    if (id > -1) {
                        insertId = id;
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

