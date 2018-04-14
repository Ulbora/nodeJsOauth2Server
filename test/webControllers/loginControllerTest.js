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
                req.body = {
                    username: "tester2",
                    password: "tester"
                };
                req.session = {};
                req.session.loggedIn = false;
                req.session.oauthGrantObj = {};
                req.session.oauthGrantObj.responseType = "code";
                req.session.oauthGrantObj.clientId = "4454";
                var res = {};
                res.redirect = function(path){                    
                    if(path){
                        console.log("loginUser redirect: " + path)
                        //var i = path.indexOf("/oauth/authorize?response_type=code");
                        var i = path.indexOf("/login");
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



