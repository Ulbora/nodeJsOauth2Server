/*     
 Copyright (C) 2016 Ulbora Labs LLC. (www.ulboralabs.com)
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

var refreshTokenDelegate = require("./refreshTokenDelegate");
var accessTokenDelegate = require("./accessTokenDelegate");
var config = require("../configuration");
var manager = require("../managers/manager");

var db;

exports.init = function (database) {
    db = database;
    refreshTokenDelegate.init(db);
    accessTokenDelegate.init(db);
};


exports.createAuthorizationCode = function (json, scopes, callback) {
    var rtn = {
        authorizationCode: null,
        codeString: null,
        success: false,
        message: null
    };
    var clientId = json.clientId;
    var userId = json.userId;
    var userIdHashed = manager.hashUser(userId);
    // create refresh token
    var refreshPayload = {
        sub: "code",
        userId: userIdHashed,
        clientId: clientId
    };
    //console.log("refresh token refreshPayload: " + JSON.stringify(refreshPayload));
    refreshTokenDelegate.generateRefreshToken(refreshPayload, function (refreshToken) {
        //console.log("refresh token: " + refreshToken);
        if (refreshToken) {
            var rftJson = {
                token: refreshToken
            };
            db.getClientRoleAllowedUriListByClientId(clientId, function (clientRoleUriList) {
                //console.log("clientRoleUriList: " + JSON.stringify(clientRoleUriList));
                if (clientRoleUriList) {
                    var roleUriList = [];
                    for (var cnt = 0; cnt < clientRoleUriList.length; cnt++) {
                        roleUriList.push(clientRoleUriList[cnt]);
                    }
                    var accessPayload = {
                        sub: "access",
                        grant: "code",
                        userId: userIdHashed,
                        clientId: clientId,
                        roleUris: roleUriList,
                        scopeList: scopes,
                        expiresIn: config.CODE_ACCESS_TOKEN_LIFE
                    };
                    accessTokenDelegate.generateAccessToken(accessPayload, function (accessToken) {
                        if (accessToken) {
                            var dateNow = new Date();
                            var acExpires = new Date(dateNow.getTime() + 300000);
                            var acTokenExpires = new Date(dateNow.getTime() + (config.CODE_ACCESS_TOKEN_LIFE * 60000));

                            var accessTknJson = {
                                token: accessToken,
                                expires: acTokenExpires
                            };
                            var randonCode = generateRandonAuthCode();
                            var authCodeJson = {
                                clientId: clientId,
                                userId: userId,
                                expires: acExpires,
                                randonAuthCode: randonCode,
                                alreadyUsed: false

                            };
                            db.addAuthorizationCode(authCodeJson, accessTknJson, rftJson, scopes, function (addAccessTknResult) {
                                if (addAccessTknResult.success) {
                                    var codeString = generateAuthCodeString(addAccessTknResult.authorizationCode, addAccessTknResult.codeString);
                                    var updateJson = {
                                        randonAuthCode: codeString,
                                        alreadyUsed: false,
                                        authorizationCode: addAccessTknResult.authorizationCode
                                    }
                                    db.updateAuthorizationCode(updateJson, function (authCodeUpdateResult) {
                                        if (authCodeUpdateResult.success) {
                                            rtn.authorizationCode = addAccessTknResult.authorizationCode;
                                            rtn.codeString = codeString;
                                            rtn.success = true;
                                            callback(rtn);
                                        } else {
                                            callback(rtn);
                                        }
                                    });
                                } else {
                                    callback(rtn);
                                }
                            });
                        } else {
                            callback(rtn);
                        }
                    });
                } else {
                    callback(rtn);
                }
            });
        } else {
            callback(rtn);
        }
    });
};



var generateRandonAuthCode = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};


var generateAuthCodeString = function (authCode, randonString) {
    var rtn = null;
    if (authCode && randonString) {
        var fpart = randonString.substring(0, 7);
        var spart = randonString.substring(8);
        rtn = fpart + authCode + spart;
    }
    return rtn;
};
    