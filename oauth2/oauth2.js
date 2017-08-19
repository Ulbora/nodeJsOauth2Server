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
var tokenValidationManager = require("../managers/tokenValidationManager");
var service = require("../services/service");
var db;

exports.init = function (database) {
    db = database;
    tokenValidationManager.init(db);
};

exports.authorize = function (req, res, me, callback) {
    var tokenHeader = req.header("Authorization");
    var userId = req.header("userId");
    var hashedStr = req.header("hashed");
    var hashed = (hashedStr === "true") ? true: false;
    var clientIdStr = req.header("clientId");
    var clientId = service.getClientId(clientIdStr);
    var prot = req.protocol;
    var host = req.hostname;
    //console.log("token:" + token);
    if (tokenHeader !== undefined && tokenHeader !== null) {
        var tokenArray = tokenHeader.split(' ');
        if (tokenArray !== undefined && tokenArray !== null && tokenArray.length === 2) {
            var token = tokenArray[1];            
            var role = me.role;
            //var uri = prot + "://" + host + me.uri;
            var uri = me.uri;
            console.log("uri: " + uri);
            var scope = me.scope;
            var authJson = {
                accessToken: token,
                userId: userId,
                hashed: hashed,
                clientId: clientId,
                role: role,
                uri: uri,
                scope: scope
            };
            tokenValidationManager.validateAccessToken(authJson, function (result) {
                if (result.valid) {
                    callback();
                } else {
                    res.status(401);
                    res.send();
                }
            });
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
};
