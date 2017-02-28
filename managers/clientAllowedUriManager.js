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

var manager = require("./manager");

var db;

exports.init = function (database) {
    db = database;
};

exports.addClientAllowedUri = function (json, callback) {
    var returnVal = {
        success: false
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        db.addClientAllowedUri(json, callback);
    } else {
        callback(returnVal);
    }
};

exports.updateClientAllowedUri = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        if (!json.secret) {
            json.secret = manager.generateClientSecret();
        }
        db.updateClientAllowedUri(json, function (result) {
            if (result && result.success) {
                returnVal.success = result.success;
                callback(returnVal);
            } else {
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};


exports.getClientAllowedUriById = function (id, callback) {
    var idIsOk = manager.securityCheck(id);    
    if (idIsOk) {
        db.getClientAllowedUriById(id, callback);
    } else {
        callback({});
    }
};


exports.getClientAllowedUriList = function (clientId, callback) {
    var isOk = manager.securityCheck(clientId);
    if (isOk) {
        db.getClientAllowedUriList(clientId, callback);
    } else {
        callback([]);
    }
};

exports.getClientAllowedUri = function (clientId, uri, callback) {
    var idIsOk = manager.securityCheck(clientId);
    var uriIsOk = manager.securityCheck(uri);
    if (idIsOk && uriIsOk) {
        db.getClientAllowedUri(clientId, uri, callback);
    } else {
        callback({});
    }
};

exports.deleteClientAllowedUri = function (id, callback) {
    var returnVal = {
        success: false
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        db.deleteClientAllowedUri(id, callback);
    } else {
        callback(returnVal);
    }
};