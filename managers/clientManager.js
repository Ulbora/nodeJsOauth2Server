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

var manager = require("./manager");

var db;

exports.init = function (database) {
    db = database;
};


exports.addClient = function (json, callback) {
    var returnVal = {
        success: false,
        clientId: null,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var bodyJson = JSON.stringify(json);
        console.log("json: " + bodyJson);
        var redirectUrls = json.redirectUrls;
        if (redirectUrls) {
            json.secret = manager.generateClientSecret();
            db.addClient(json, redirectUrls, function (result) {
                if (result && result.success) {
                    returnVal.success = result.success;
                    returnVal.clientId = result.clientId;
                    callback(returnVal);
                } else {
                    callback(returnVal);
                }
            });
        } else {
            callback(returnVal);
        }
    } else {
        callback(returnVal);
    }
};

exports.updateClient = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        if (!json.secret) {
            json.secret = manager.generateClientSecret();
        }
        db.updateClient(json, function (result) {
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

exports.getClient = function (clientId, callback) {
    var isOk = manager.securityCheck(clientId);
    if (isOk) {
        db.getClient(clientId, function (result) {
            if (result) {
                db.getClientRedirectUriList(clientId, function (uriList) {
                    if (uriList) {
                        result.redirectUrls = uriList;
                    }
                    callback(result);
                });
            } else {
                callback({});
            }
        });
    } else {
        callback({});
    }
};


exports.getClientList = function (callback) {
    db.getClientList(callback);
};



exports.getClientSearchList = function (json, callback) {
    if(json && json.name){
        db.getClientSearchList(json.name, callback);
    }else{
        callback([]);
    }
    
};

exports.deleteClient = function (clientId, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(clientId);
    if (isOk) {
        db.deleteClient(clientId, callback);
    } else {
        callback(returnVal);
    }
};
