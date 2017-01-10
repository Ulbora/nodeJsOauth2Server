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


var jwt = require('jsonwebtoken');
var config = require("../configuration");

var db;

exports.init = function (database) {
    db = database;
};

exports.generateAccessToken = function (json, callback) {
    if (json) {
        db.getAccessTokenKey(function (result) {
            if (result && result.key) {
                json.iat = Math.floor(Date.now() / 1000);
                json.tokenType = "access";
                //options
                var options = {};
                options.expiresIn = json.expiresIn, //config.REFRESH_TOKEN_LIFE;
                options.issuer = config.TOKEN_ISSUER;
                jwt.sign(json, result.key, options, function (err, token) {
                    if (err) {
                        console.log("access token error :" + err);
                    }
                    callback(token);
                });
            } else {
                callback();
            }
        });
    } else {
        callback();
    }
};

exports.validateAccessToken = function (refreshToken, claims, callback) {
    var valid = false;
    console.log("access token: " + refreshToken);
    db.getAccessTokenKey(function (result) {
        if (result && result.key) {
            jwt.verify(refreshToken, result.key, function (err, decoded) {
                if (err) {
                    console.log("AccessToken verify err: " + err);
                }
                if (decoded && decoded.tokenType === "access" && decoded.userId === claims.userId &&
                        decoded.clientId === claims.clientId && decoded.iss === config.TOKEN_ISSUER) {
                    //console.log("decoded access token: " + JSON.stringify(decoded));
                    //console.log("claims: " + JSON.stringify(claims));                    
                    var foundRoleUri = false;                    
                    var roleUris = decoded.roleUris;
                    var checkUris = [];
                    if(roleUris && roleUris.length > 0){                        
                        for(var cnt = 0; cnt < roleUris.length; cnt++){
                            checkUris.push(roleUris[cnt].uri);
                            if(roleUris[cnt].role === claims.role && roleUris[cnt].uri === claims.uri){
                                foundRoleUri = true;
                                break;
                            }
                        } 
                        if(!foundRoleUri){
                            //console.log("role uris not found fo far: ");
                            //uri not mapped so token is valid
                            //only uris that are mapped can be used to invalidate a token
                            //console.log("index of: " + (checkUris.indexOf(claims.uri)));
                            foundRoleUri = (checkUris.indexOf(claims.uri) === -1)? true: false;
                        }                        
                    }else{
                        foundRoleUri = true;
                    }                    
                    console.log("foundRoleUri: " + foundRoleUri );
                    if(foundRoleUri){
                        valid = true;
                    }  
                }
                callback(valid);
            });
        } else {
            callback(valid);
        }
    });
};

