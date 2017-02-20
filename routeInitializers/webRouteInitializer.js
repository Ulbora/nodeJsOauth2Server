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

var loginController = require("../webControllers/loginController");
var authorizeController = require("../webControllers/authorizeController");
var tokenController = require("../webControllers/tokenController");
exports.init = function (app, db) {
    authorizeController.init(db);
    tokenController.init(db);
    app.get('/', function (req, res) {
        var sess = req.session;
        console.log("session: " + sess);
        req.session.user = "ken";
        console.log(req.session.user);
        var n = req.session.user;
        var title = "Ulbora Labs index";
        var params = {
            n: n,
            title: title
        };
        res.render('index', params);
    });
    app.get('/login', function (req, res) {
        loginController.login(req, res);
    });
    app.post('/login', function (req, res) {
        loginController.loginUser(req, res);
    });
    app.get('/oauth/authorize', function (req, res) {
        authorizeController.authorize(req, res);
    });    
    app.get('/authorizeApp', function (req, res) {
        authorizeController.authorizeApp(req, res);
    });
    app.get('/applicationAuthorize', function (req, res) {
        authorizeController.applicationAuthorization(req, res);
    });    
    app.post('/oauth/token', function (req, res) {
        tokenController.token(req, res);
    });
    
    app.get('/oauthError', function (req, res) {
        authorizeController.oauthError(req, res);
    });
};