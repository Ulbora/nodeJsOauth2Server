var assert = require('assert');
var db = require("../../../database/mysql/db");
var clientId;
var clientRoleId;

var clientId2;
var clientRoleId2;

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

    describe('#testTransaction()', function () {
        it('should add a client and role in a transaction and roll back', function (done) {
            db.getConnection(function (err, con) {
                if (!err && con) {
                    con.beginTransaction(function (err) {
                        if (err) {
                            assert(false);
                        } else {
                            var json = {
                                secret: '12345',
                                redirectUri: 'http://ulboralabs.com',
                                name: 'ulbora',
                                webSite: 'www.ulboralabs.com',
                                email: 'ulbora@ulbora.com',
                                enabled: true
                            };
                            setTimeout(function () {
                                db.addClient(con, json, function (result) {
                                    console.log("client result in transaction:" + JSON.stringify(result));
                                    if (result.clientId > -1) {
                                        clientId = result.clientId;
                                        var json = {
                                            role: 'superuser',
                                            clientId: clientId
                                        };
                                        setTimeout(function () {
                                            db.addClientRole(con, json, function (result2) {
                                                if (result2.id > -1) {
                                                    console.log("client result2 in transaction:" + JSON.stringify(result2));
                                                    clientRoleId = result2.id;
                                                    con.rollback();
                                                    setTimeout(function () {
                                                        db.getClient(clientId, function (result3) {
                                                            if (result3 === null) {
                                                                assert(true);
                                                            } else {
                                                                assert(false);
                                                            }
                                                            done();
                                                        });
                                                    }, 3000);
                                                } else {
                                                    assert(false);
                                                }
                                            });
                                        }, 2000);

                                    } else {
                                        assert(false);
                                    }
                                });
                            }, 1000);
                        }
                    });
                } else {
                    assert(false);
                }
            });
        });
    });


    describe('#testTransaction()', function () {
        it('should add a client and role in a transaction and commit', function (done) {
            db.getConnection(function (err, con) {
                if (!err && con) {
                    con.beginTransaction(function (err) {
                        if (err) {
                            assert(false);
                        } else {
                            var json = {
                                secret: '12345',
                                redirectUri: 'http://ulboralabs.com',
                                name: 'ulbora',
                                webSite: 'www.ulboralabs.com',
                                email: 'ulbora@ulbora.com',
                                enabled: true
                            };
                            setTimeout(function () {
                                db.addClient(con, json, function (result) {
                                    console.log("client result in transaction:" + JSON.stringify(result));
                                    if (result.clientId > -1) {
                                        clientId2 = result.clientId;
                                        var json = {
                                            role: 'superuser',
                                            clientId: clientId2
                                        };
                                        setTimeout(function () {
                                            db.addClientRole(con, json, function (result2) {
                                                if (result2.id > -1) {
                                                    console.log("client result2 in transaction:" + JSON.stringify(result2));
                                                    clientRoleId2 = result2.id;
                                                    con.commit(function (err) {
                                                        if (err) {
                                                            return con.rollback(function () {
                                                                assert(false);
                                                            });
                                                        } else {
                                                            setTimeout(function () {
                                                                db.getClient(clientId2, function (result3) {
                                                                    if (result3 && result3.name === "ulbora") {
                                                                        setTimeout(function () {
                                                                            db.deleteClientRole(null, clientRoleId2, function (result) {
                                                                                if (result.success) {
                                                                                    setTimeout(function () {
                                                                                        db.deleteClient(null, clientId2, function (result) {
                                                                                            if (result.success) {
                                                                                                assert(true);
                                                                                            } else {
                                                                                                assert(false);
                                                                                            }
                                                                                            done();
                                                                                        });
                                                                                    }, 5000);

                                                                                } else {
                                                                                    assert(false);
                                                                                }
                                                                            });
                                                                        }, 4000);
                                                                    } else {
                                                                        assert(false);
                                                                    }
                                                                });
                                                            }, 3000);
                                                        }
                                                    });
                                                } else {
                                                    assert(false);
                                                }
                                            });
                                        }, 2000);

                                    } else {
                                        assert(false);
                                    }
                                });
                            }, 1000);
                        }
                    });
                } else {
                    assert(false);
                }
            });
        });
    });
});

