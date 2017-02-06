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

exports.authCodeToken = function (json, callback) {
    var error = {
        error: null
    };
    var rtn = {
        access_token: null,
        token_type: null,
        expires_in: null,
        refresh_token: null,
        scope: null
    };
    var isOk = manager.securityCheck(json);
    var clientId = json.clientId;
    var clientSecret = json.clientSecret;
    var code = json.code;
    var redirectUri = json.redirectUri;
    if (isOk && clientId && clientSecret && code && redirectUri) {
        //validate client
        
        //validate redirect uri
        
        // get authCode and validate code
        // -- if already used, revoke token
        
        //set authCode to used once
    } else {
        error.error = "invalid_request";
        callback(error);
    }    
};