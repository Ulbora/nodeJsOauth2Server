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

var clientManager = require("../managers/clientManager");
var oauth2 = require("../oauth2/oauth2");

var db;

exports.init = function (database) {
    db = database;
    clientManager.init(db);
};

exports.add = function (req, res) {
    if (req.is('application/json')) {
        var me = {
            role: "superAdmin",
            uri: "/rs/client/add",
            scope: "write"
        };
        oauth2.authorize(req, res, me, function () {
            var reqBody = req.body;
            var bodyJson = JSON.stringify(reqBody);
            console.log("body: " + bodyJson);
            clientManager.addClient(reqBody, function (result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
};

exports.update = function (req, res) {
    if (req.is('application/json')) {
        var me = {
            role: "superAdmin",
            uri: "/rs/client/update",
            scope: "update"
        };
        oauth2.authorize(req, res, me, function () {
            var reqBody = req.body;
            var bodyJson = JSON.stringify(reqBody);
            console.log("body: " + bodyJson);
            clientManager.updateClient(reqBody, function (result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
};

exports.get = function (req, res) {
    console.log("in auth callback");
    var me = {
        role: "superAdmin",
        uri: "/rs/client/get",
        scope: "read"
    };
    oauth2.authorize(req, res, me, function () {
        var id = req.params.id;
        if (id !== null && id !== undefined) {
            clientManager.getClient(id, function (result) {
                res.send(result);
            });
        } else {
            res.send({});
        }
    });
};

exports.list = function (req, res) {
    var me = {
        role: "superAdmin",
        uri: "/rs/client/list",
        scope: "read"
    };
    oauth2.authorize(req, res, me, function () {
        console.log("in auth callback");
        clientManager.getClientList(function (result) {
            res.send(result);
        });
    });
};


exports.search = function (req, res) {
    if (req.is('application/json')) {
        var me = {
            role: "superAdmin",
            uri: "/rs/client/search",
            scope: "read"
        };
        oauth2.authorize(req, res, me, function () {
            var reqBody = req.body;
            var bodyJson = JSON.stringify(reqBody);
            console.log("body: " + bodyJson);
            clientManager.getClientSearchList(reqBody, function (result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
};

exports.delete = function (req, res) {
    console.log("in auth callback");
    var me = {
        role: "superAdmin",
        uri: "/rs/client/delete",
        scope: "write"
    };
    oauth2.authorize(req, res, me, function () {
        var id = req.params.id;
        if (id !== null && id !== undefined) {
            clientManager.deleteClient(id, function (result) {
                res.send(result);
            });
        } else {
            res.send({success: false});
        }
    });
};



