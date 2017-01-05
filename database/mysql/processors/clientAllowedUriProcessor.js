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
exports.init = function (c) {
    crud = c;
};

//client allowed URI --------------------------
exports.addClientAllowedUri = function (con, json, callback) {
    var args = {
        uri: json.uri,
        client_id: json.clientId
    };
    crud.insert(con, clientQueries.CLIENT_ALLOWED_URI_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

exports.getClientAllowedUriList = function (clientId, callback) {
    var queryId = [clientId];
    crud.get(clientQueries.CLIENT_ALLOWED_URI_LIST_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    id: result.data[cnt].id,
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

exports.getClientAllowedUri = function (clientId, uri, callback) {
    var queryId = [clientId, uri];
    crud.get(clientQueries.CLIENT_ALLOWED_URI_QUERY, queryId, function (result) {
        console.log("client uri: " + JSON.stringify(result));
        if (result.success && result.data.length > 0) {            
                var rtn = {
                    id: result.data[0].id,
                    uri: result.data[0].uri,
                    clientId: result.data[0].client_id
                };               
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.deleteClientAllowedUri = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, clientQueries.CLIENT_ALLOWED_URI_DELETE_QUERY, queryId, callback);
};

