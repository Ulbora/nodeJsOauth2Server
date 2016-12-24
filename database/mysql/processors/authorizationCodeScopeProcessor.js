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
exports.addAuthorizationCode = function (con, json, callback) {
    var args = {
        client_id: json.clientId,
        user_id: json.userId,
        expires: json.expires,
        access_token_id: json.accessTokenId
    };
    console.log("json in add authorizationCode :" + JSON.stringify(json));
    crud.insert(con, authorizationCodeQueries.AUTHORIZATION_CODE_INSERT_QUERY, args, function (result) {
        var rtn = {
            authorizationCode: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.getAuthorizationCode = function (id, callback) {
    var queryId = [id];
    crud.get(authorizationCodeQueries.AUTHORIZATION_CODE_GET_BY_ID_QUERY, queryId, function (result) {
        //console.log("get refresh token:" +JSON.stringify(result));
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0 ) {
            var rtn = {
                authorizationCode: result.data[0].authorization_code,
                clientId: result.data[0].client_id,
                userId: result.data[0].user_id,
                expires: result.data[0].expires,
                accessTokenId: result.data[0].access_token_id
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.deleteAuthorizationCode = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, authorizationCodeQueries.AUTHORIZATION_CODE_DELETE_QUERY, queryId, callback);
};


