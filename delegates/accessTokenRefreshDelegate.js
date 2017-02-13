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


//var authCodeTokenDelegate = require("./authCodeTokenDelegate");
var refreshTokenDelegate = require("../delegates/refreshTokenDelegate");
var accessTokenDelegate = require("../delegates/accessTokenDelegate");
var manager = require("../managers/manager");
var config = require("../configuration");

var db;

exports.init = function (database) {
    db = database;
    refreshTokenDelegate.init(db);
    accessTokenDelegate.init(db);
};

exports.refreshToken = function(json, callback){
     var error = {
        error: null
    };
    var rtn = {
        access_token: null,
        token_type: "bearer",
        expires_in: config.CODE_ACCESS_TOKEN_LIFE,
        refresh_token: null
    };
    var isOk = manager.securityCheck(json);
    var clientId = json.clientId;
    var secret = json.secret;
    var refTokenOld = json.refreshToken;
    var userId;
    if (isOk && clientId && secret) {
        // validate client
        db.getClient(clientId, function (clientResult) {
            if (clientResult && clientResult.clientId && clientResult.clientId === clientId &&
                    clientResult.secret === secret) {
                //decode refresh token and get client and userId sub: code or password
                refreshTokenDelegate.decodeRefreshToken(refTokenOld, function (decode) {
                    if (decode && decode.clientId === clientId) {
                        userId = decode.userId;
                        var sub = decode.sub;
                        var claim = {
                            userId: userId,
                            clientId: clientId
                        };
                        refreshTokenDelegate.validateRefreshToken(refTokenOld, claim, function (valid) {
                            //verify refresh token
                            if (valid) {
                                //if code
                                if (sub === "code") {
                                    // get authcode by client and user
                                    db.getAuthorizationCode(clientId, userId, function (authCodeResult) {
                                        var refreshPayload = {
                                            sub: "code",
                                            userId: userId,
                                            clientId: clientId
                                        };
                                        if (authCodeResult && authCodeResult.userId === userId) {
                                            // generate new refresh token 
                                            refreshTokenDelegate.generateRefreshToken(refreshPayload, function (refreshToken) {
                                                //get accessToken from db
                                                db.getAccessToken(authCodeResult.accessTokenId, function (accessTokenResult) {
                                                    if (accessTokenResult && accessTokenResult.id > 0) {

                                                        // decode access token
                                                        accessTokenDelegate.decodeAccessToken(accessTokenResult.token, function (decoded) {
                                                            if (decoded && decoded.userId === userId && decoded.clientId === clientId) {
                                                                var accessPayload = {
                                                                    sub: "access",
                                                                    userId: userId,
                                                                    clientId: clientId,
                                                                    roleUris: decoded.roleUris,
                                                                    scopeList: decoded.scopeList,
                                                                    expiresIn: config.CODE_ACCESS_TOKEN_LIFE
                                                                };
                                                                // generate new  access token
                                                                accessTokenDelegate.generateAccessToken(accessPayload, function (accessToken) {
                                                                    if (accessToken) {
                                                                        var dateNow = new Date();
                                                                        var acExpires = new Date(dateNow.getTime() + 300000);
                                                                        var acTokenExpires = new Date(dateNow.getTime() + (config.CODE_ACCESS_TOKEN_LIFE * 60000));
                                                                        var refreshTokenJson = {
                                                                            token: refreshToken,
                                                                            id: accessTokenResult.refreshTokenId
                                                                        };
                                                                        var accessTknJson = {
                                                                            token: accessToken,
                                                                            expires: acTokenExpires,
                                                                            refreshTokenId: accessTokenResult.refreshTokenId,
                                                                            id: authCodeResult.accessTokenId
                                                                        };
                                                                        var authCodeJson = {
                                                                            expires: acExpires,
                                                                            authorizationCode: authCodeResult.authorizationCode
                                                                        };
                                                                        //update auth code, refresh token and access token
                                                                        db.updateAuthorizationCodeAndTokens(authCodeJson, accessTknJson, refreshTokenJson, function (authCodeUpdateResult) {
                                                                            if (authCodeUpdateResult.success) {
                                                                                rtn.access_token = accessToken;
                                                                                rtn.refresh_token = refreshToken;
                                                                                callback(rtn);
                                                                            } else {
                                                                                error.error = "invalid_client";
                                                                                callback(error);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        error.error = "invalid_client";
                                                                        callback(error);
                                                                    }
                                                                });
                                                            } else {
                                                                error.error = "invalid_client";
                                                                callback(error);
                                                            }
                                                        });
                                                    } else {
                                                        error.error = "invalid_client";
                                                        callback(error);
                                                    }
                                                });
                                            });
                                        } else {
                                            error.error = "invalid_client";
                                            callback(error);
                                        }
                                    });
                                } else if (sub === "password") {
                                    error.error = "invalid_client";
                                    callback(error);
                                } else {
                                    error.error = "invalid_client";
                                    callback(error);
                                }
                            } else {
                                error.error = "invalid_client";
                                callback(error);
                            }
                        });
                    } else {
                        error.error = "invalid_client";
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
