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

var authorizationCodeDelegate = require("../delegates/authorizationCodeDelegate");
var manager = require("./manager");
var grantTypeConstants = require("../constants/grantTypeConstants");

var db;

exports.init = function (database) {
    db = database;
    authorizationCodeDelegate.init(db);
    manager.init(db);
};


exports.authorize = function (json, callback) {
    var returnVal = {
        authorizationCode: null,
        codeString: null,
        error: null,
        redirectUri: json.redirectUri
    };
    var isOk = manager.securityCheck(json);
    var clientId = json.clientId;
    var userId = json.userId;
    var scope = json.scope;
    delete json.scope;
    if (isOk && clientId && userId && json.redirectUri) {
        db.getClientRedirectUri(clientId, json.redirectUri, function (redirectUriResults) {
            if (redirectUriResults && redirectUriResults.id > 0) {
                manager.grantTypeTurnedOn(clientId, grantTypeConstants.CODE_GRANT_TYPE, function (turnedOn) {
                    if (turnedOn) {
                        db.getAuthorizationCode(clientId, userId, function (codeResult) {
                            if (codeResult && codeResult.authorizationCode) {
                                db.getAuthorizationCodeScopeList(codeResult.authorizationCode, function (scopeList) {
                                    var scopeListToAdd = [];
                                    var scopeFound = false;
                                    for (var cnt = 0; cnt < scopeList.length; cnt++) {
                                        if (scope === scopeList[cnt].scope) {
                                            //returnVal.authorizationCode = codeResult.authorizationCode;
                                            scopeFound = true;
                                            break;
                                        }
                                    }
                                    //console.log("scope already exist: " + scopeFound);
                                    if (scopeFound) {
                                        // delete auth code
                                        for (var cnt = 0; cnt < scopeList.length; cnt++) {
                                            scopeListToAdd.push(scopeList[cnt].scope);
                                        }
                                        console.log("scopes before delete: " + JSON.stringify(scopeListToAdd));
                                        db.deleteAuthorizationCode(clientId, userId, function (codeDelResult) {
                                            if (codeDelResult.success) {
                                                // create new auth code
                                                authorizationCodeDelegate.createAuthorizationCode(json, scopeListToAdd, function (acodeResult) {
                                                    if (acodeResult.success) {
                                                        returnVal.authorizationCode = acodeResult.authorizationCode;
                                                        returnVal.codeString = acodeResult.codeString;
                                                        returnVal.success = true;
                                                    }
                                                    callback(returnVal);
                                                });
                                            } else {
                                                returnVal.error = "access_denied";
                                                callback(returnVal);
                                            }
                                        });
                                    } else {
                                        scopeListToAdd.push(scope);
                                        for (var cnt = 0; cnt < scopeList.length; cnt++) {
                                            scopeListToAdd.push(scopeList[cnt].scope);
                                        }
                                        console.log("scopes before delete: " + JSON.stringify(scopeListToAdd));
                                        // deleste all auth code
                                        db.deleteAuthorizationCode(clientId, userId, function (codeDelResult) {
                                            console.log("delete of old auth code :" + JSON.stringify(codeDelResult))
                                            if (codeDelResult.success) {
                                                authorizationCodeDelegate.createAuthorizationCode(json, scopeListToAdd, function (acodeResult) {
                                                    if (acodeResult.success) {
                                                        returnVal.authorizationCode = acodeResult.authorizationCode;
                                                        returnVal.codeString = acodeResult.codeString;
                                                        returnVal.success = true;
                                                    }
                                                    callback(returnVal);
                                                });
                                            } else {
                                                returnVal.error = "access_denied";
                                                callback(returnVal);
                                            }
                                        });
                                    }
                                });
                            } else {
                                //create auth code
                                var scopeListToAdd = [scope];
                                authorizationCodeDelegate.createAuthorizationCode(json, scopeListToAdd, function (acodeResult) {
                                    if (acodeResult.success) {
                                        returnVal.authorizationCode = acodeResult.authorizationCode;
                                        returnVal.codeString = acodeResult.codeString;
                                        returnVal.success = true;
                                    }
                                    callback(returnVal);
                                });
                            }
                        });
                    } else {
                        returnVal.error = "access_denied";
                        callback(returnVal);
                    }
                });
            } else {
                returnVal.error = "access_denied";
                callback(returnVal);
            }
        });
    } else {
        returnVal.error = "access_denied";
        callback(returnVal);
    }

};

exports.checkApplicationAuthorization = function (json, callback) {
    var returnVal = {
        authorized: false
    };
    var isOk = manager.securityCheck(json);
    var clientId = json.clientId;
    var userId = json.userId;
    var scope = json.scope;
    if (isOk && clientId && userId && scope) {
        db.getAuthorizationCodeByScope(clientId, userId, scope, function (result) {
            if (result && result.authorized) {
                returnVal.authorized = true;
            }
            callback(returnVal);
        });
    } else {
        callback(returnVal);
    }
};

exports.validateClientAndCallback = function (json, callback) {
    var returnVal = {
        valid: false
    };
    var isOk = manager.securityCheck(json);
    var clientId = json.clientId;
    var callbackUri = json.callbackUri;
    if (isOk && clientId && callbackUri) {
        console.log("validateClientAndCallback: " + JSON.stringify(json));
        db.getClientRedirectUri(clientId, callbackUri, function (uriResults) {
            //console.log("validateClientAndCallback getClientRedirectUri: " + JSON.stringify(uriResults));
            //console.log("uriResults.id > -1: " + (uriResults.id > -1));
            //console.log("uriResults.clientId === clientId: " + (uriResults.clientId === clientId));
            //console.log("uriResults.uri === callbackUri: " + (uriResults.uri === callbackUri));
            if (uriResults.id > -1 && uriResults.clientId === clientId && uriResults.uri === callbackUri) {
                db.getClient(clientId, function (cResult) {
                    console.log("getClient in validateClientAndCallback: " + JSON.stringify(cResult));
                    if (cResult && cResult.clientId > -1 && cResult.enabled) {
                        returnVal.valid = true;
                        returnVal.clientName = cResult.name;
                        returnVal.webSite = cResult.webSite;
                    }
                    callback(returnVal);
                });
            } else {
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }

};

exports.deleteAuthorizationCode = function (json, callback) {
    var returnVal = {
        success: false
    };
    var isOk = manager.securityCheck(json);
    var clientId = json.clientId;
    var userId = json.userId;
    if (isOk && clientId && userId) {
        db.deleteAuthorizationCode(clientId, userId, function (result) {
            returnVal.success = result.success;
            callback(returnVal);
        });
    } else {
        callback(returnVal);
    }

};
