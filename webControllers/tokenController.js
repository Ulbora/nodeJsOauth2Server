var authorizationCodeManager = require("../managers/authorizationCodeManager");
exports.init = function (db) {
    authorizationCodeManager.init(db);
};
exports.token = function (req, res) {
    var loggedIn = req.session.loggedIn;
    var user = req.session.user;
    console.log("user: " + user + " logged in: " + loggedIn);
    var responseType = req.query.response_type;
    var clientIdStr = req.query.client_id;
    var clientId;
    if(clientIdStr){
        try{
            clientId = parseInt(clientIdStr);
        }catch(err){
            clientId = clientIdStr;
        }
    }else{
        clientId = clientIdStr;
    }
    var redirectUri = req.query.redirect_uri;
    var scope = req.query.scope;
    var state = req.query.state;
    var oauthCodeObj = {
        responseType: responseType,
        clientId: clientId,
        redirectUri: redirectUri,
        scope: scope,
        state: state
    };
    if (!loggedIn || !user) {
        req.session.oauthCodeObj = oauthCodeObj;
        res.redirect('/login');
    } else {
        if (responseType === "code") {
            //must authorize before adding
            var authJson = {
                clientId: clientId,
                userId: user,
                scope: scope
            };
            authorizationCodeManager.checkApplicationAuthorization(authJson, function (result) {
                if (result && result.authorized) {
                    console.log("oauthCodeObj in authController: " + JSON.stringify(oauthCodeObj));
                    var json = {
                        clientId: clientId,
                        userId: user,
                        scope: scope,
                        redirectUri: redirectUri
                    };
                    authorizationCodeManager.authorize(json, function (result) {
                        console.log("authorization code: " + JSON.stringify(result));
                        if (result.success && result.authorizationCode && result.authorizationCode > -1) {
                            var cb = redirectUri + "?code=" + result.codeString+ "&state=" + oauthCodeObj.state;
                            console.log("authorization code cb: " + cb);
                            res.redirect(cb);
                        } else {
                            res.redirect('/oauthError?error=' + result.error);
                        }
                    });
                } else {
                    req.session.oauthCodeObj = oauthCodeObj;
                    res.redirect('/authorizeApp');
                }
            });
        } else if (responseType === "token") {

        } else if (responseType) {
            //res.render('oauthError', {error: "invalid_grant"});
            res.redirect('/oauthError?error=invalid_grant');
        } else {
            //res.render('oauthError', {error: "invalid_grant"});
            res.redirect('/oauthError?error=invalid_grant');
        }
    }
};

