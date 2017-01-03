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

var credentialsGrantQueries = require("../queries/credentialsGrantQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//access token --------------------------
exports.addCredentialsGrant = function (con, json, callback) {
    var args = {
        client_id: json.clientId,              
        access_token_id: json.accessTokenId
    };
    console.log("json in add credentials grant :" + JSON.stringify(json));
    crud.insert(con, credentialsGrantQueries.CREDENTIALS_GRANT_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.getCredentialsGrant = function (clientId, callback) {
    var queryId = [clientId];
    crud.get(credentialsGrantQueries.CREDENTIALS_GRANT_GET_BY_ID_QUERY, queryId, function (result) {
        //console.log("get refresh token:" +JSON.stringify(result));
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0 ) {
            var rtn = {
                id: result.data[0].id,
                clientId: result.data[0].client_id,                          
                accessTokenId: result.data[0].access_token_id
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.deleteCredentialsGrant = function (con, clientId, callback) {
    var queryId = [clientId];
    crud.delete(con, credentialsGrantQueries.CREDENTIALS_GRANT_DELETE_QUERY, queryId, callback);
};


