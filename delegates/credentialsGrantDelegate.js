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
var grantTypeConstants = require("../constants/grantTypeConstants");

var db;

exports.init = function (database) {
    db = database;
    refreshTokenDelegate.init(db);
    accessTokenDelegate.init(db);
    manager.init(db);
};


exports.createClientGrant = function (json, callback) {
    var rtn = {
        access_token: null,
        token_type: "bearer",
        expires_in: config.CLIENT_CREDENTIALS_ACCESS_TOKEN_LIFE
    };
    var error = {
        error: null
    };
    var clientId = json.clientId;
    var secret = json.secret;
    var isOk = manager.securityCheck(json);
    if (isOk && clientId && secret) {
       //console.log("in ClientGrant req: " + JSON.stringify(json));
        db.getClient(clientId, function (clientResult) {
            if (clientResult && clientResult.clientId && clientResult.clientId === clientId &&
                    clientResult.secret === secret && clientResult.enabled) {
                manager.grantTypeTurnedOn(clientId, grantTypeConstants.CLIENT_CRENDENTIAL_GRANT_TYPE, function (turnedOn) {
                    if (turnedOn) {
                        db.deleteCredentialsGrant(clientId, function (deleteResult) {
                            //console.log("deleteCredentialsGrant: " + JSON.stringify(deleteResult));
                            if (deleteResult.success) {
                                db.getClientRoleAllowedUriListByClientId(clientId, function (clientRoleUriList) {
                                    //console.log("clientRoleUriList: " + JSON.stringify(clientRoleUriList));
                                    if (clientRoleUriList) {
                                        var roleUriList = [];
                                        for (var cnt = 0; cnt < clientRoleUriList.length; cnt++) {
                                            roleUriList.push(clientRoleUriList[cnt]);
                                        }
                                        var accessPayload = {
                                            sub: "access",
                                            grant: "client_credentials",
                                            clientId: clientId,
                                            roleUris: roleUriList,
                                            expiresIn: config.CLIENT_CREDENTIALS_ACCESS_TOKEN_LIFE
                                        };
                                        accessTokenDelegate.generateAccessToken(accessPayload, function (accessToken) {
                                            if (accessToken) {
                                                var dateNow = new Date();
                                                var acTokenExpires = new Date(dateNow.getTime() + (config.CLIENT_CREDENTIALS_ACCESS_TOKEN_LIFE * 60000));
                                                var accessTknJson = {
                                                    token: accessToken,
                                                    expires: acTokenExpires
                                                };
                                                // var randonCode = generateRandonAuthCode();
                                                var clientGrantJson = {
                                                    clientId: clientId,
                                                    accessTokenId: null
                                                };
                                                db.addCredentialsGrant(clientGrantJson, accessTknJson, function (clientGrantResult) {
                                                    if (clientGrantResult.success) {
                                                        rtn.access_token = accessToken;
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
                                error.error = "access_denied";
                                callback(error);
                            }
                        });
                    } else {
                        error.error = "access_denied";
                        callback(error);
                    }
                });
            } else {
                error.error = "invalid_client";
                callback(error);
            }
        });
    } else {
        callback(rtn);
    }
};
