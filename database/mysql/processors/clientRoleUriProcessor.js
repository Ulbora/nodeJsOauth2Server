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

var clientQueries = require("../queries/clientQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//client allowed URI --------------------------
exports.addClientRoleUri = function (con, json, callback) {
    var args = {
        client_role_id: json.clientRoleId,
        client_allowed_uri_id: json.clientAllowedUriId
    };
    crud.insertNoId(con, clientQueries.CLIENT_ROLE_URI_INSERT_QUERY, args, function (result) {
        console.log("clientRoleUri insert: " + JSON.stringify(result));
        var rtn = {            
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

exports.getClientRoleAllowedUriList = function (clientRoleId, callback) {
     var queryId = [clientRoleId];
    crud.get(clientQueries.CLIENT_ROLE_URI_LIST_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    clientRoleId: result.data[cnt].client_role_id,
                    clientAllowedUriId: result.data[cnt].client_allowed_uri_id
                };
                rtnList.push(rtn);
            }
            callback(rtnList);
        } else {
            callback(rtnList);
        }
    });
};

exports.getClientRoleAllowedUriListByClientId = function (clientId, callback) {
     var queryId = [clientId];
    crud.get(clientQueries.CLIENT_ROLE_URI_JOIN_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    clientRoleId: result.data[cnt].role_id,
                    role: result.data[cnt].role,
                    uriId: result.data[cnt].uri_id,
                    uri: result.data[cnt].uri,
                    clientId: result.data[cnt].client_id
                };
                rtnList.push(rtn);
            }
            callback(rtnList);
        } else {
            callback(rtnList);
        }
    });
};

exports.deleteClientRoleUri = function (con, json, callback) {
    var queryId = [json.clientRoleId, json.clientAllowedUriId];
    crud.delete(con, clientQueries.CLIENT_ROLE_URI_DELETE_QUERY, queryId, callback);
};


