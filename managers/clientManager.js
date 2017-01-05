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


exports.addClient = function (json, callback) {
    var returnVal = {
        success: false,
        clientId: null,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var redirectUrls = json.redirectUrls;
        if (redirectUrls) {
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
