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

var tokenQueries = require("../queries/tokenQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//access token --------------------------
exports.addAccessToken = function (con, json, callback) {
    var args = {
        token: json.token,
        expires: json.expires,
        refresh_token_id: json.refreshTokenId
    };
    console.log("json in add access token :" + JSON.stringify(json));
    crud.insert(con, tokenQueries.ACCESS_TOKEN_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.getAccessToken = function (id, callback) {
    var queryId = [id];
    crud.get(tokenQueries.ACCESS_TOKEN_GET_BY_ID_QUERY, queryId, function (result) {
        //console.log("get refresh token:" +JSON.stringify(result));
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0 && result.data[0].token.length > 0) {
            var rtn = {
                id: result.data[0].id,
                token: result.data[0].token.toString(),
                expires: result.data[0].expires,
                refreshTokenId: result.data[0].refresh_token_id
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.deleteAccessToken = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, tokenQueries.ACCESS_TOKEN_DELETE_QUERY, queryId, callback);
};


