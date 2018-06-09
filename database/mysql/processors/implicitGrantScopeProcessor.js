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

var implicitGrantQueries = require("../queries/implicitGrantQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//access token --------------------------
exports.addImplicitGrantScope = function (con, json, callback) {
    var args = {
        scope: json.scope,
        implicit_grant_id: json.implicitGrantId
    };
    //console.log("json in add addImplicitGrantScope :" + JSON.stringify(json));
    crud.insert(con, implicitGrantQueries.IMPLICIT_GRANT_SCOPE_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.getImplicitGrantScopeList = function (implicitGrantId, callback) {
     var queryId = [implicitGrantId];
    crud.get(implicitGrantQueries.IMPLICIT_GRANT_SCOPE_GET_BY_CODE_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    id: result.data[cnt].id,
                    scope: result.data[cnt].scope,
                    implicitGrantId: result.data[cnt].implicit_grant_id
                };
                rtnList.push(rtn);
            }
            callback(rtnList);
        } else {
            callback(rtnList);
        }
    });
};

exports.deleteImplicitGrantScope = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, implicitGrantQueries.IMPLICIT_GRANT_SCOPE_DELETE_QUERY, queryId, callback);
};


exports.deleteImplicitGrantScopeList = function (con, implicitGrantId, callback) {
    var queryId = [implicitGrantId];
    crud.delete(con, implicitGrantQueries.IMPLICIT_GRANT_SCOPE_DELETE_ALL_QUERY, queryId, callback);
};



