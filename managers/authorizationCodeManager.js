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

var db;

exports.init = function (database) {
    db = database;
    authorizationCodeDelegate.init(db);
};


exports.authorize = function (json, callback) {
    var returnVal = {
        authorizationCode: null,
        error: null,
        redirectUri: json.redirectUri
    };
    var isOk = manager.securityCheck(json);
    var clientId = json.clientId;
    var userId = json.userId;
    var scope = json.scope;
    if (isOk && clientId && userId) {
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
                    if (scopeFound) {
                        // delete auth code
                        for (var cnt = 0; cnt < scopeList.length; cnt++) {
                            scopeListToAdd.push(scopeList[cnt].scope);
                        }
                        db.deleteAuthorizationCode(codeResult.authorizationCode, function (codeDelResult) {
                            if (codeDelResult.success) {
                                // create new auth code
                            //callback(returnVal);
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
                        // deleste all auth code
                        db.deleteAuthorizationCode(codeResult.authorizationCode, function (codeDelResult) {
                            if (codeDelResult.success) {
                                // create new auth code
                            //callback(returnVal);
                            } else {
                                returnVal.error = "access_denied";
                                callback(returnVal);
                            }               
                            // create new auth code
                            //callback(returnVal);
                        });
                        //create auth code
                    }
                });
            } else {
                //create auth code
            }
        });
    } else {
        returnVal.error = "access_denied";
        callback(returnVal);
    }

};

exports.authorizeApplication = function (json, callback) {

};

