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

var authorizationCodeQueries = require("../queries/authorizationCodeQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//access token --------------------------
exports.addAuthorizationCodeScope = function (con, json, callback) {
    var args = {
        scope: json.scope,
        authorization_code: json.authorizationCode
    };
    //console.log("json in add authorizationCodeScope :" + JSON.stringify(json));
    crud.insert(con, authorizationCodeQueries.AUTHORIZATION_CODE_SCOPE_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.getAuthorizationCodeScopeList = function (authorizationCode, callback) {
     var queryId = [authorizationCode];
    crud.get(authorizationCodeQueries.AUTHORIZATION_CODE_SCOPE_GET_BY_CODE_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    id: result.data[cnt].id,
                    scope: result.data[cnt].scope,
                    authorizationCode: result.data[cnt].authorization_code
                };
                rtnList.push(rtn);
            }
            callback(rtnList);
        } else {
            callback(rtnList);
        }
    });
};

exports.deleteAuthorizationCodeScope = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, authorizationCodeQueries.AUTHORIZATION_CODE_SCOPE_DELETE_QUERY, queryId, callback);
};


exports.deleteAuthorizationCodeScopeList = function (con, authorizationCode, callback) {
    var queryId = [authorizationCode];
    crud.delete(con, authorizationCodeQueries.AUTHORIZATION_CODE_SCOPE_DELETE_ALL_QUERY, queryId, callback);
};



