var assert = require('assert');
var db = require("../../database/db");
var sessionDelegate = require("../../delegates/sessionDelegate");
var express = require('express');
var session = require('express-session');

describe('Session delegate', function () {
    this.timeout(20000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                sessionDelegate.init(db);
                done();
            }, 1000);
        });
    });
    describe('#createSessionStore()', function () {
        it('should createSessionStore', function (done) {
            setTimeout(function () {
                sessionDelegate.createSessionStore(session, function(result){
                    console.log("session success: " +result.success);
                    if(result.success && result.key.length > 1 && result.store){
                        assert(true);
                    }else{
                        assert(false);
                    }
                    done();
                });
                             
            }, 1000);
        });
    });

});



