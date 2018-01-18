var authorizationCodeManager = require("../managers/authorizationCodeManager");
var implicitGrantManager = require("../managers/implicitGrantManager");

exports.init = function (db) {
    authorizationCodeManager.init(db);
    implicitGrantManager.init(db);
};
exports.authorize = function (req, res) {
    var loggedIn = req.session.loggedIn;
    var user = req.session.user;
    //console.log("user: " + user + " logged in: " + loggedIn);
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
    var oauthGrantObj = {
        responseType: responseType,
        clientId: clientId,
        redirectUri: redirectUri,
        scope: scope,
        state: state
    };
    if (!loggedIn || !user) {
        req.session.oauthGrantObj = oauthGrantObj;
        res.redirect('/login');
    } else {
        //console.log("oauthGrantObj in authController before response type: " + JSON.stringify(oauthGrantObj));
        if (responseType === "code") {
            //must authorize before adding
            var authJson = {
                clientId: clientId,
                userId: user,
                scope: scope
            };
            authorizationCodeManager.checkApplicationAuthorization(authJson, function (result) {
                if (result && result.authorized) {
                    //console.log("oauthGrantObj in authController: " + JSON.stringify(oauthGrantObj));
                    var json = {
                        clientId: clientId,
                        userId: user,
                        scope: scope,
                        redirectUri: redirectUri
                    };
                    authorizationCodeManager.authorize(json, function (result) {
                        //console.log("authorization code: " + JSON.stringify(result));
                        if (result.success && result.authorizationCode && result.authorizationCode > -1) {
                            var cb = redirectUri + "?code=" + result.codeString+ "&state=" + oauthGrantObj.state;
                            //console.log("authorization code cb: " + cb);
                            res.redirect(cb);
                        } else {
                            res.redirect('/oauthError?error=' + result.error);
                        }
                    });
                } else {
                    req.session.oauthGrantObj = oauthGrantObj;
                    res.redirect('/authorizeApp');
                }
            });
        } else if (responseType === "token") {
            //must authorize before adding
            var authJson = {
                clientId: clientId,
                userId: user,
                scope: scope
            };
            implicitGrantManager.checkApplicationAuthorization(authJson, function (result) {
                if (result && result.authorized) {
                    //console.log("oauthGrantObj in authController: " + JSON.stringify(oauthGrantObj));
                    var json = {
                        clientId: clientId,
                        userId: user,
                        scope: scope,
                        redirectUri: redirectUri
                    };
                    implicitGrantManager.authorize(json, function (result) {
                        //console.log("implicit: " + JSON.stringify(result));
                        if (result.success && result.token) {
                            var cb = redirectUri + "?token=" + result.token+ "&token_type=bearer&state=" + oauthGrantObj.state;
                            //console.log("implicit cb: " + cb);
                            res.redirect(cb);
                        } else {
                            res.redirect('/oauthError?error=' + result.error);
                        }
                    });
                } else {
                    req.session.oauthGrantObj = oauthGrantObj;
                    res.redirect('/authorizeApp');
                }
            });
        } else if (responseType) {
            //res.render('oauthError', {error: "invalid_grant"});
            res.redirect('/oauthError?error=invalid_grant');
        } else {
            //res.render('oauthError', {error: "invalid_grant"});
            res.redirect('/oauthError?error=invalid_grant');
        }
    }
};

exports.authorizeApp = function (req, res) {
    var params = {
        title: "authorize application"
    };
    var oauthGrantObj = req.session.oauthGrantObj;
    if (!oauthGrantObj) {
        res.render('oauthError', {error: "Invalid Request"});
    }
    else if(oauthGrantObj.responseType === "code"){
        var cbJson = {
            clientId: oauthGrantObj.clientId,
            callbackUri: oauthGrantObj.redirectUri
        };
        authorizationCodeManager.validateClientAndCallback(cbJson, function (results) {
            if (results.valid) {
                params.clientName = results.clientName;
                params.webSite = results.webSite;
                params.scope = oauthGrantObj.scope;
                res.render("authorizeApp", params);
            } else {
                res.render('oauthError', {error: "Invalid redirect URI"});
            }
        });
    }else if(oauthGrantObj.responseType === "token"){
        var cbJson = {
            clientId: oauthGrantObj.clientId,
            callbackUri: oauthGrantObj.redirectUri
        };
        implicitGrantManager.validateClientAndCallback(cbJson, function (results) {
            if (results.valid) {
                params.clientName = results.clientName;
                params.webSite = results.webSite;
                params.scope = oauthGrantObj.scope;
                res.render("authorizeApp", params);
            } else {
                res.render('oauthError', {error: "Invalid redirect URI"});
            }
        });
    }else{
         res.render('oauthError', {error: "Invalid redirect URI"});
    }


};

exports.applicationAuthorization = function (req, res) {
    var authorize = req.query.authorize;
    //console.log("authorize: " + authorize);
    var oauthGrantObj = req.session.oauthGrantObj;
    req.session.oauthGrantObj = undefined;
    var user = req.session.user;
    if (authorize === "true" && oauthGrantObj.responseType === "code") {
        var json = {
            clientId: oauthGrantObj.clientId,
            userId: user,
            scope: oauthGrantObj.scope,
            redirectUri: oauthGrantObj.redirectUri
        };
        //console.log("authorization code json: " + JSON.stringify(json));
        authorizationCodeManager.authorize(json, function (result) {
            //console.log("authorization code: " + JSON.stringify(result));
            if (result.success && result.authorizationCode && result.authorizationCode > -1) {
                var cb = oauthGrantObj.redirectUri + "?code=" + result.codeString + "&state=" + oauthGrantObj.state;
                res.redirect(cb);
            } else {
                res.render('oauthError', {error: result.error});
            }
        });
    }else if(authorize === "true" && oauthGrantObj.responseType === "token"){
         var json = {
            clientId: oauthGrantObj.clientId,
            userId: user,
            scope: oauthGrantObj.scope,
            redirectUri: oauthGrantObj.redirectUri
        };
        //console.log("authorization code json: " + JSON.stringify(json));
        implicitGrantManager.authorize(json, function (result) {
            //console.log("implicit grant: " + JSON.stringify(result));
            if (result.success && result.token) {
                //var cb = oauthGrantObj.redirectUri + "?code=" + result.codeString + "&state=" + oauthGrantObj.state;
                var cb = oauthGrantObj.redirectUri + "?token=" + result.token+ "&token_type=bearer&state=" + oauthGrantObj.state;
                res.redirect(cb);
            } else {
                res.render('oauthError', {error: result.error});
            }
        });
    } else {
        res.redirect(oauthGrantObj.redirectUri + "?error=access_denied&state=" + oauthGrantObj.state);
    }
};


exports.oauthError = function (req, res) {
    var error = req.query.error;
    res.render('oauthError', {error: error});
};
