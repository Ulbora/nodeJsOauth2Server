exports.login = function (req, res) {
    var loggedIn = req.session.loggedIn;
    var u = "";
    var p = "";
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
    req.session.loggedIn = true;
    req.session.user = "ken";
    var oauthCodeObj = req.session.oauthCodeObj;
    //req.session.oauthCodeObj = undefined;
    console.log("oauthCodeObj: " + JSON.stringify(oauthCodeObj));
    if(req.session.loggedIn && oauthCodeObj && oauthCodeObj.responseType === "code"){
        res.redirect("/oauth/authorize?response_type=" + oauthCodeObj.responseType + "&client_id=" + oauthCodeObj.clientId +"&redirect_uri=" + oauthCodeObj.redirectUri + "&scope=" + oauthCodeObj.scope + "&state=" + oauthCodeObj.state);
    }else{
        res.redirect('/login');
    }
};

