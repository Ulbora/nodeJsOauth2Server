/*     
 Copyright (C) 2016 Ulbora Labs Inc. (www.ulboralabs.com)
 All rights reserved.
 
 Copyright (C) 2016 Ken Williamson
 All rights reserved.
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published
 by the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


var manager = require("../managers/manager");
var config = require("../configuration");

var db;

exports.init = function (database) {
    db = database;
};

exports.authCodeToken = function (json, callback) {
    var error = {
        error: null
    };
    var rtn = {
        access_token: null,
        token_type: "bearer",
        expires_in: config.CODE_ACCESS_TOKEN_LIFE
    };
    var isOk = manager.securityCheck(json);
    var clientId = json.clientId;
    var secret = json.secret;
    var code = json.code;
    var redirectUri = json.redirectUri;
    if (isOk && clientId && secret && code && redirectUri) {
        //validate client
        console.log("in authCodeToken req: " + JSON.stringify(json));
        db.getClient(clientId, function (clientResult) {
            console.log("in authCodeToken result: " + JSON.stringify(clientResult));
            if (clientResult && clientResult.clientId && clientResult.clientId === clientId &&
                    clientResult.secret === secret && clientResult.enabled) {
                //validate redirect uri
                db.getClientRedirectUri(clientId, redirectUri, function (uriResult) {
                    if (uriResult && uriResult.id > 0) {
                        // get authCode and validate code
                        db.getAuthorizationCodeByCode(code, function (acResult) {
                            console.log("in authCodeToken ac result: " + JSON.stringify(acResult));
                            if (acResult.clientId === clientId) {
                                // check that token is not revolked
                                db.getAuthCodeRevoke(acResult.authorizationCode, function (revokeResult) {
                                    if (revokeResult && revokeResult.authorizationCode === acResult.authorizationCode) {
                                        error.error = "invalid_client";
                                        callback(error);
                                    } else {
                                        if (acResult.alreadyUsed) {
                                            // -- if already used, revoke token
                                            var revokeJson = {
                                                authorizationCode: acResult.authorizationCode
                                            };
                                            db.addAuthCodeRevoke(revokeJson, function (newRevokeResult) {
                                                error.error = "invalid_client";
                                                callback(error);
                                            });
                                        } else {
                                            //set authCode to used once
                                            var usedJson = {
                                                randonAuthCode: acResult.codeString,
                                                alreadyUsed: true,
                                                authorizationCode: acResult.authorizationCode
                                            };
                                            db.updateAuthorizationCode(usedJson, function (updateResult) {
                                                if (updateResult.success) {
                                                    //get access token
                                                    db.getAccessToken(acResult.accessTokenId, function (tokenResult) {
                                                        console.log("accesstoken result: " + JSON.stringify(tokenResult));
                                                        if (tokenResult && tokenResult.id > 0) {
                                                            //get refresh token      
                                                            rtn.access_token = tokenResult.token;
                                                            if (tokenResult.refreshTokenId) {
                                                                db.getRefreshToken(tokenResult.refreshTokenId, function (refreshResult) {
                                                                    rtn.refresh_token = refreshResult.token;
                                                                    callback(rtn);
                                                                });
                                                            } else {
                                                                callback(rtn);
                                                            }
                                                        } else {
                                                            error.error = "invalid_grant";
                                                            callback(error);
                                                        }
                                                    });
                                                } else {
                                                    error.error = "invalid_grant";
                                                    callback(error);
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                error.error = "invalid_client";
                                callback(error);
                            }
                        });
                    } else {
                        error.error = "invalid_grant";
                        callback(error);
                    }
                });
            } else {
                error.error = "invalid_client";
                callback(error);
            }
        });
    } else {
        error.error = "invalid_request";
        callback(error);
    }
};