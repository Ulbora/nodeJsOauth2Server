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



var accessTokenDelegate = require("../delegates/accessTokenDelegate");
var manager = require("./manager");

var db;

exports.init = function (database) {
    db = database;
    manager.init(db);
    accessTokenDelegate.init(db);
};

exports.validateAccessToken = function (json, callback) {
    var rtn = {
        valid: false
    };
    //console.log("json: " + JSON.stringify(json));
    if (json) {
        var isOk = manager.securityCheck(json);
        var accessToken = json.accessToken;
        var userId;
        if(json.hashed !== true && json.userId){
            userId = manager.hashUser(json.userId);
        }else{
            userId = json.userId;
        }        
        var clientId = json.clientId;
        var role = json.role;
        var uri = json.uri;
        var scope = json.scope;
        if (isOk && accessToken && clientId) {
            var claims = {
                clientId: clientId
            };
            if (userId) {
                claims.userId = userId;
            }
            if (role) {
                claims.role = role;
            }
            if (uri) {
                claims.uri = uri;
            }
            if (scope) {
                claims.scope = scope;
            }
            accessTokenDelegate.validateAccessToken(accessToken, claims, function (valid) {
                if (valid) {
                    rtn.valid = true;
                }
                callback(rtn);
            });
        } else {
            callback(rtn);
        }
    } else {
        callback(rtn);
    }
};