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


exports.createImplicitGrant = function (json, scopes, callback) {
    var rtn = {
        id: null,
        success: false,
        message: null
    };
    var clientId = json.clientId;
    var userId = json.userId;
    var userIdHashed = manager.hashUser(userId);
    var isOk = manager.securityCheck(json);
    if (isOk && clientId && userId) {
        db.getClientRoleAllowedUriListByClientId(clientId, function (clientRoleUriList) {
            //console.log("clientRoleUriList: " + JSON.stringify(clientRoleUriList));
            if (clientRoleUriList) {
                var roleUriList = [];
                for (var cnt = 0; cnt < clientRoleUriList.length; cnt++) {
                    roleUriList.push(clientRoleUriList[cnt]);
                }
                var accessPayload = {
                    sub: "access",
                    grant: "implicit",
                    userId: userIdHashed,
                    clientId: clientId,
                    roleUris: roleUriList,
                    scopeList: scopes,
                    expiresIn: config.IMPLICIT_ACCESS_TOKEN_LIFE
                };
                accessTokenDelegate.generateAccessToken(accessPayload, function (accessToken) {
                    if (accessToken) {
                        var dateNow = new Date();
                        var acTokenExpires = new Date(dateNow.getTime() + (config.IMPLICIT_ACCESS_TOKEN_LIFE * 60000));
                        var accessTknJson = {
                            token: accessToken,
                            expires: acTokenExpires
                        };
                        // var randonCode = generateRandonAuthCode();
                        var implicitJson = {
                            clientId: clientId,
                            userId: userId

                        };
                        db.addImplicitGrant(implicitJson, accessTknJson, scopes, function (implicitResult) {
                            if (implicitResult.success) {
                                rtn.id = implicitResult.id;
                                rtn.token = accessToken;
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
};
