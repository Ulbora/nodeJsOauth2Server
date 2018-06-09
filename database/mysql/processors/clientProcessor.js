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

//client operations---------------------------------------
var clientQueries = require("../queries/clientQueries");
var crud;
exports.init = function(c){
    crud = c;
};
exports.addClient = function (con, json, callback) {
    var args = {
        secret: json.secret,
        name: json.name,
        web_site: json.webSite,
        email: json.email,
        enabled: json.enabled
    };
    crud.insert(con, clientQueries.CLIENT_INSERT_QUERY, args, function (result) {
        var rtn = {
            clientId: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

exports.updateClient = function (con, json, callback) {
    var args = [
        json.secret,        
        json.name,
        json.webSite,
        json.email,
        json.enabled,
        json.clientId
    ];
    crud.update(con, clientQueries.CLIENT_UPDATE_QUERY, args, callback);
};


exports.getClient = function (clientId, callback) {
    var queryId = [clientId];
    crud.get(clientQueries.CLIENT_GET_BY_ID_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtn = {
                clientId: result.data[0].client_id,  
                secret: result.data[0].secret,
                name: result.data[0].name,
                webSite: result.data[0].web_site,
                email: result.data[0].email,
                enabled: (result.data[0].enabled === 1) ? true : false
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.getClientList = function (callback) {
    crud.getList(clientQueries.CLIENT_LIST_QUERY, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    clientId: result.data[cnt].client_id,                    
                    name: result.data[cnt].name,
                    webSite: result.data[cnt].web_site,
                    email: result.data[cnt].email,
                    enabled: (result.data[cnt].enabled === 1) ? true : false
                };
                rtnList.push(rtn);
            }
            callback(rtnList);
        } else {
            callback(rtnList);
        }
    });
};


exports.getClientSearchList = function (name, callback) {
    var queryId = ['%' + name + '%'];
    crud.get(clientQueries.CLIENT_SEARCH_LIST_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    clientId: result.data[cnt].client_id,                    
                    name: result.data[cnt].name,
                    webSite: result.data[cnt].web_site,
                    email: result.data[cnt].email,
                    enabled: (result.data[cnt].enabled === 1) ? true : false
                };
                rtnList.push(rtn);
            }
            callback(rtnList);
        } else {
            callback(rtnList);
        }
    });
};

exports.deleteClient = function (con, clientId, callback) {
    var queryId = [clientId];
    crud.delete(con, clientQueries.CLIENT_DELETE_QUERY, queryId, callback);
};