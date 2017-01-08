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

exports.generateRefreshToken = function (json, callback) {
    if (json) {
        db.getRefreshTokenKey(function (result) {
            if (result && result.key) {
                json.iat = Math.floor(Date.now() / 1000);
                json.tokenType = "refresh";
                //options
                var options = {};
                options.expiresIn = config.REFRESH_TOKEN_LIFE;
                options.issuer = config.TOKEN_ISSUER;
                jwt.sign(json, result.key, options, function (err, token) {
                    if (err) {
                        console.log("refresh token error :" + err);
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

exports.validateRefreshToken = function (refreshToken, claims, callback) {
    var valid = false;
    console.log("refresh token: " + refreshToken);
    db.getRefreshTokenKey(function (result) {
        if (result && result.key) {
            jwt.verify(refreshToken, result.key, function (err, decoded) {
                if (err) {
                    console.log("RefreshToken verify err: " + err);
                }
                if (decoded && decoded.tokenType === "refresh" && decoded.userId === claims.userId &&
                        decoded.clientId === claims.clientId && decoded.iss === config.TOKEN_ISSUER) {
                    console.log("decoded refresh token: " + JSON.stringify(decoded));
                    valid = true;
                }
                callback(valid);
            });
        } else {
            callback(valid);
        }
    });
};

