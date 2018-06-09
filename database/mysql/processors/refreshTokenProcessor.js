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

var tokenQueries = require("../queries/tokenQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//refresh token --------------------------
exports.addRefreshToken = function (con, json, callback) {
    var args = {
        token: json.token
    };
    crud.insert(con, tokenQueries.REFRESH_TOKEN_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

exports.updateRefreshToken = function (con, json, callback) {
    var args = [        
        json.token,
        json.id
    ];
    crud.update(con, tokenQueries.REFRESH_TOKEN_UPDATE_QUERY, args, callback);
};

exports.getRefreshToken = function (id, callback) {
    var queryId = [id];
    crud.get(tokenQueries.REFRESH_TOKEN_GET_BY_ID_QUERY, queryId, function (result) {
        //console.log("get refresh token:" +JSON.stringify(result));
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0 && result.data[0].token.length > 0) {
            var rtn = {
                id: result.data[0].id,
                token: result.data[0].token.toString()
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.deleteRefreshToken = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, tokenQueries.REFRESH_TOKEN_DELETE_QUERY, queryId, callback);
};


