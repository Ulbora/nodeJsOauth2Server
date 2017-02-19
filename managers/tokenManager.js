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


var authCodeTokenDelegate = require("../delegates/authCodeTokenDelegate");
var accessTokenRefreshDelegate = require("../delegates/accessTokenRefreshDelegate");
var credentialsGrantDelegate = require("../delegates/credentialsGrantDelegate");

var db;

exports.init = function (database) {
    db = database;
    authCodeTokenDelegate.init(db);
    accessTokenRefreshDelegate.init(db);
    credentialsGrantDelegate.init(db);
};

exports.authCodeToken = function (json, callback) {
    authCodeTokenDelegate.authCodeToken(json, callback);
};

exports.credentialsGrantToken = function (json, callback) {
    credentialsGrantDelegate.createClientGrant(json, callback);
};

exports.refreshToken = function (json, callback) {
    accessTokenRefreshDelegate.refreshToken(json, callback);    
};
