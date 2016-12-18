var assert = require('assert');
var db = require("../../../../database/mysql/crud/mysqlCrud");
var insertId;
describe('MYSQLCrud', function () {
    this.timeout(6000);
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

    describe('#insert()', function () {
        it('should insert into db', function (done) {
            var q = "INSERT INTO client Set ?";
            var args = {
                secret: '1234',
                redirect_uri: 'http://ulboralabs.com',
                name: 'ulbora',
                web_site: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            setTimeout(function () {
                db.insert(q, args, function (result) {
                    if (result.id > -1) {
                        insertId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    describe('#update()', function () {
        it('should update row from db', function (done) {
            var q = "UPDATE client SET name = ? WHERE client_id = ?";
            var args = ['ulbora labs', insertId];
            setTimeout(function () {
                db.update(q, args, function (result) {
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
    
    describe('#get()', function () {
        it('should read row from db', function (done) {
            var q = "SELECT secret, name, enabled FROM client WHERE client_id = ?";
            var queryId = [insertId];
            setTimeout(function () {
                db.get(q, queryId, function (result) {
                    if (result.success && result.data[0].name === 'ulbora labs') {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 3000);           
        });
    });
    
    describe('#getList()', function () {
        it('should read row from db', function (done) {
            var q = "SELECT * FROM client";            
            setTimeout(function () {
                db.getList(q, function (result) {
                    if (result.success && result.data.length > 0) {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 4000);           
        });
    });
    
    describe('#delete()', function () {
        it('should delete row from db', function (done) {
            var q = "DELETE FROM client WHERE client_id = ?";
            var queryId = [insertId];
            setTimeout(function () {
                db.delete(q, queryId, function (result) {
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

