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

var authCodeRevokeQueries = require("../queries/authCodeRevokeQueries");
var crud;
exports.init = function(c){
    crud = c;
};

exports.addAuthCodeRevoke = function (con, json, callback) {
    var args = {
        authorization_code: json.authorizationCode
    };
    crud.insert(con, authCodeRevokeQueries.AUTH_CODE_REVOKE_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.getAuthCodeRevoke = function (authCode, callback) {
    var queryId = [authCode];
    crud.get(authCodeRevokeQueries.AUTH_CODE_REVOKE_GET_BY_AUTH_CODE_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtn = {
                id: result.data[0].client_id,  
                authorizationCode: result.data[0].authorization_code
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};


exports.deleteAuthCodeRevoke = function (con, authCode, callback) {
    var queryId = [authCode];
    crud.delete(con, authCodeRevokeQueries.AUTH_CODE_REVOKE_DELETE_QUERY, queryId, callback);
};
