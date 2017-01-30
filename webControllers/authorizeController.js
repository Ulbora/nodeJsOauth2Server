var authorizationCodeManager = require("../managers/authorizationCodeManager");
exports.init = function (db) {
    authorizationCodeManager.init(db);
};
exports.authorize = function (req, res) {
    var loggedIn = req.session.loggedIn;
    var user = req.session.user;
    console.log("user: " + user + " logged in: " + loggedIn)
    var responseType = req.query.response_type;
    var clientIdStr = req.query.client_id;
    var clientId;
    if(clientIdStr){
        try{
            clientId = parseInt(clientIdStr)
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
                            var cb = redirectUri + "?code=" + result.authorizationCode;
                            res.redirect(cb);
                        } else {
                            res.render('oauthError', {error: result.error});
                        }
                    });
                } else {
                    req.session.oauthCodeObj = oauthCodeObj;
                    res.redirect('/authorizeApp');
                }
            });
        } else if (responseType === "token") {

        } else if (responseType) {
            res.render('oauthError', {error: "invalid_grant"});
        } else {
            res.render('oauthError', {error: "invalid_grant"});
        }
    }
};

exports.authorizeApp = function (req, res) {
    var params = {
        title: "authorize application"
    };
    var oauthCodeObj = req.session.oauthCodeObj;
    if (!oauthCodeObj) {
        res.render('oauthError', {error: "Invalid Request"});
    } else {
        var cbJson = {
            clientId: oauthCodeObj.clientId,
            callbackUri: oauthCodeObj.redirectUri
        };
        authorizationCodeManager.validateClientAndCallback(cbJson, function (results) {
            if (results.valid) {
                params.clientName = results.clientName;
                params.webSite = results.webSite;
                params.scope = oauthCodeObj.scope;
                res.render("authorizeApp", params);
            } else {
                res.render('oauthError', {error: "Invalid redirect URI"});
            }
        });
    }


};

exports.applicationAuthorization = function (req, res) {
    var authorize = req.query.authorize;
    console.log("authorize: " + authorize);
    var oauthCodeObj = req.session.oauthCodeObj;
    req.session.oauthCodeObj = undefined;
    var user = req.session.user;
    if (authorize === "true") {
        var json = {
            clientId: oauthCodeObj.clientId,
            userId: user,
            scope: oauthCodeObj.scope,
            redirectUri: oauthCodeObj.redirectUri
        };
        console.log("authorization code json: " + JSON.stringify(json));
        authorizationCodeManager.authorize(json, function (result) {
            console.log("authorization code: " + JSON.stringify(result));
            if (result.success && result.authorizationCode && result.authorizationCode > -1) {
                var cb = oauthCodeObj.redirectUri + "?code=" + result.authorizationCode;
                res.redirect(cb);
            } else {
                res.render('oauthError', {error: result.error});
            }
        });
    } else {
        res.redirect(oauthCodeObj.redirectUri + "?error=access_denied");
    }
};

