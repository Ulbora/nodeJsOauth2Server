var tokenManager = require("../managers/tokenManager");
exports.init = function (db) {
    tokenManager.init(db);
};
exports.token = function (req, res) {
    var grantType = req.query.grant_type;

    if (grantType === "authorization_code") {
        var clientIdStr = req.query.client_id;
        var secret = req.query.client_secret;
        var code = req.query.code;
        var redirectUri = req.query.redirect_uri;
        var clientId = getClientId(clientIdStr);

        var tokenReq = {
            clientId: clientId,
            secret: secret,
            code: code,
            redirectUri: redirectUri
        };
        tokenManager.authCodeToken(tokenReq, function (tokenResult) {
            if (tokenResult.error) {
                res.status(401).send(tokenResult);
            } else {
                res.send(tokenResult);
            }
        });

    } else if (grantType === "password") {

    } else if (grantType === "client_credentials") {

    } else if (grantType === "refresh_token") {
        var clientIdStr = req.query.client_id;
        var secret = req.query.client_secret;
        var refToken = req.query.refresh_token;
        var clientId = getClientId(clientIdStr);
        var refTokenReq = {
            clientId: clientId,
            secret: secret,
            refreshToken: refToken
        };
        refreshToken(refTokenReq, function (refreshedToken) {
            if (refreshedToken.error) {
                res.status(401).send(refreshedToken);
            } else {
                res.send(refreshedToken);
            }
        });
    } else if (grantType) {
        //res.render('oauthError', {error: "invalid_grant"});
        res.redirect('/oauthError?error=invalid_grant');
    } else {
        //res.render('oauthError', {error: "invalid_grant"});
        res.redirect('/oauthError?error=invalid_grant');
    }

};

var refreshToken = function (json, callback) {
    tokenManager.refreshToken(json, callback);
};

var getClientId = function (clientIdStr) {
    var clientId;
    if (clientIdStr) {
        try {
            clientId = parseInt(clientIdStr);
        } catch (err) {
            clientId = clientIdStr;
        }
    } else {
        clientId = clientIdStr;
    }
    return clientId;
};
