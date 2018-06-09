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

var clientQueries = require("../queries/clientQueries");
var crud;
exports.init = function (c) {
    crud = c;
};

//client allowed URI --------------------------
exports.addClientRole = function (con, json, callback) {
    var args = {
        role: json.role,
        client_id: json.clientId
    };
    crud.insert(con, clientQueries.CLIENT_ROLE_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

//add getClientRole //clientId, role

exports.getClientRoleList = function (clientId, callback) {
    var queryId = [clientId];
    crud.get(clientQueries.CLIENT_ROLE_LIST_QUERY, queryId, function (result) {
        var rtnList = [];
        if (result.success && result.data.length > 0) {
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    id: result.data[cnt].id,
                    role: result.data[cnt].role,
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

exports.deleteClientRole = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, clientQueries.CLIENT_ROLE_DELETE_QUERY, queryId, callback);
};


