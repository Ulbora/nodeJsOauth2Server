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
var config = require("../configuration");

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
        token_type: "bearer",
        expires_in: config.CODE_ACCESS_TOKEN_LIFE,
        refresh_token: null,
        scope: null
    };
    var isOk = manager.securityCheck(json);
    var clientId = json.clientId;
    var secret = json.secret;
    var code = json.code;
    var redirectUri = json.redirectUri;
    if (isOk && clientId && secret && code && redirectUri) {
        //validate client
        console.log("in authCodeToken req: " + JSON.stringify(json));
        db.getClient(clientId, function (clientResult) {
            console.log("in authCodeToken result: " + JSON.stringify(clientResult));
            if (clientResult && clientResult.clientId && clientResult.clientId === clientId &&
                    clientResult.secret === secret) {
                //validate redirect uri
                db.getClientRedirectUri(clientId, redirectUri, function (uriResult) {
                    if (uriResult && uriResult.id > 0) {
                        // get authCode and validate code
                        db.getAuthorizationCodeByCode(code, function (acResult) {
                            console.log("in authCodeToken ac result: " + JSON.stringify(acResult));                            
                            if(acResult.clientId === clientId){
                                // -- if already used, revoke token
                                // check that token is not revolked
                                //set authCode to used once
                                callback(rtn);
                            }else{
                                
                            }                        
                        });
                        
                    } else {
                        error.error = "invalid_grant";
                        callback(error);
                    }
                });
            } else {
                error.error = "invalid_client";
                callback(error);
            }
        });


    } else {
        error.error = "invalid_request";
        callback(error);
    }
};