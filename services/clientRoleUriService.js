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

var clientRoleUriManager = require("../managers/clientRoleUriManager");
var oauth2 = require("../oauth2/oauth2");

var db;

exports.init = function (database) {
    db = database;
    clientRoleUriManager.init(db);
};

exports.add = function (req, res) {
    if (req.is('application/json')) {
        var me = {
            role: "admin",
            uri: "/ulbora/rs/clientRoleUri/add",
            scope: "write"
        };
        oauth2.authorize(req, res, me, function () {
            var reqBody = req.body;
            //var bodyJson = JSON.stringify(reqBody);
            //console.log("body: " + bodyJson);
            clientRoleUriManager.addClientRoleUri(reqBody, function (result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
};



exports.list = function (req, res) {
    var me = {
        role: "admin",
        uri: "/ulbora/rs/clientRoleUri/list",
        scope: "read"
    };
    oauth2.authorize(req, res, me, function () {
        //console.log("in auth callback");
        var clientRoleId = req.params.clientRoleId;
        if (clientRoleId) {
            clientRoleUriManager.getClientRoleAllowedUriList(clientRoleId, function (result) {
                res.send(result);
            });
        } else {
            res.send([]);
        }

    });
};

exports.delete = function (req, res) {
    console.log("in auth callback");
    if (req.is('application/json')) {
        var me = {
            role: "admin",
            uri: "/ulbora/rs/clientRoleUri/delete",
            scope: "write"
        };
        var reqBody = req.body;
        //var bodyJson = JSON.stringify(reqBody);
        //console.log("body: " + bodyJson);
        oauth2.authorize(req, res, me, function () {
            clientRoleUriManager.deleteClientRoleUri(reqBody, function (result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
};


