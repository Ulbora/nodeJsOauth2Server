var assert = require('assert');
var loginController = require("../../webControllers/loginController");


describe('loginController', function () {
    this.timeout(20000);
    
    describe('#login()', function () {
        it('should send to login screen', function (done) {
            setTimeout(function () {
                var req = {};               
                req.session = {};
                req.session.loggedIn = false;                
                var res = {};
                res.render = function(path, params){
                    if(path === "login"){
                        assert(true);
                    }else{
                        assert(false);
                    }
                    done();
                };
                loginController.login(req, res);
            }, 1000);
        });
    });
    
    
    describe('#loginUser()', function () {
        it('should login a user', function (done) {
            setTimeout(function () {
                var req = {};               
                req.session = {};
                req.session.loggedIn = false;
                req.session.oauthGrantObj = {};
                req.session.oauthGrantObj.responseType = "code";
                var res = {};
                res.redirect = function(path){                    
                    if(path){
                        var i = path.indexOf("/oauth/authorize?response_type=code");
                        if(i > -1){
                            assert(true);
                        }else{
                            assert(false);
                        }                        
                    }else{
                        assert(false);
                    }
                    done();
                };
                loginController.loginUser(req, res);
            }, 1000);
        });
    });



});



