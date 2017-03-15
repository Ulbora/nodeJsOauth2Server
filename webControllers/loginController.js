var userProxy = require("../proxies/userProxy");

exports.login = function (req, res) {
    var loggedIn = req.session.loggedIn;
    //var u = "";
    // var p = "";
    //if (req.cookies.rememberme) {
    //u = req.cookies.username;
    // p = req.cookies.password;
    // }
    var title = "Ulbora Labs login";
    var params = {
        title: title
    };
    res.render("login", params);
};

exports.loginUser = function (req, res) {   
    var reqBody = req.body;
    //var bodyJson = JSON.stringify(reqBody);
    //console.log("body: " + bodyJson);
    //console.log("path " + req.path); 
    //console.log("req: " + JSON.stringify(req));
    //console.log('Username: ' + req.body.username);
    userProxy.login(reqBody, function (result) {
        if (result.valid) {
            req.session.loggedIn = true;
            req.session.user = reqBody.username;
            var oauthGrantObj = req.session.oauthGrantObj;
            //req.session.oauthCodeObj = undefined;
            console.log("oauthGrantObj: " + JSON.stringify(oauthGrantObj));
            if (req.session.loggedIn && oauthGrantObj && (oauthGrantObj.responseType === "code" || oauthGrantObj.responseType === "token")) {
                res.redirect("/oauth/authorize?response_type=" + oauthGrantObj.responseType + "&client_id=" + oauthGrantObj.clientId + "&redirect_uri=" + oauthGrantObj.redirectUri + "&scope=" + oauthGrantObj.scope + "&state=" + oauthGrantObj.state);
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }

    });

};

