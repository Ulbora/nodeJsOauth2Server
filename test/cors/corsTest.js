var assert = require('assert');
var cors = require("../../cors/cors");

describe('CORS', function () {
    this.timeout(20000);

    describe('#CORS()', function () {
        it('should get cors headers', function (done) {
            var req = {};
            req.get = function (val) {
                return "local";
            };
            req.url = "local";
            var res = {};
            var hit = 0;
            res.header = function (val1, val2) {
                if (val1 === undefined || val2 === null) {
                    assert(false);
                } else {
                    assert(true);
                }
                hit++;
                if(hit === 3){
                    done();
                }
            };
            var nxt = function () {};
            setTimeout(function () {
                cors.CORS(req, res, nxt);               
            }, 1000);
        });
    });
    
    
    describe('#CORS()', function () {
        it('should get cors headers in options', function (done) {
            var req = {};
            req.get = function (val) {
                return "local";
            };
            req.method = "OPTIONS";
            req.url = "local";
            var res = {};            
            res.header = function (val1, val2) {
                if (val1 === undefined || val2 === null) {
                    assert(false);
                } else {
                    assert(true);
                }                
            };
            res.send = function(val){
                if(val === 200){
                    assert(true);
                }else{
                    assert(false);
                }
                done();
            };
            var nxt = function () {};
            setTimeout(function () {
                cors.CORS(req, res, nxt);               
            }, 1000);
        });
    });
});



