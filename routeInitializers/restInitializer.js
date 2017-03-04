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


var tokenValidationService = require("../services/tokenValidationService");
var clientService = require("../services/clientService");
var clientGrantTypeService = require("../services/clientGrantTypeService");
var clientAllowedUriService = require("../services/clientAllowedUriService");
var clientRedirectUriService = require("../services/clientRedirectUriService");

exports.init = function(app, db){
    //init
    tokenValidationService.init(db);
    clientService.init(db);
    clientGrantTypeService.init(db);
    clientAllowedUriService.init(db);
    clientRedirectUriService.init(db);
    
    // token validation
    app.post('/rs/token/validate', tokenValidationService.validateAccessToken);
    
    //client services
    app.post('/rs/client/add', clientService.add);      
    app.put('/rs/client/update', clientService.update);
    app.get('/rs/client/get/:id', clientService.get);
    app.delete('/rs/client/delete/:id', clientService.delete);
    app.get('/rs/client/list', clientService.list);  
    
    
     //client grant type services
    app.post('/rs/clientGrantType/add', clientGrantTypeService.add);
    app.delete('/rs/clientGrantType/delete/:id', clientGrantTypeService.delete);
    app.get('/rs/clientGrantType/list/:clientId', clientGrantTypeService.list);  
    
    
    //client allowed uri    
    app.post('/rs/clientAllowedUri/add', clientAllowedUriService.add);      
    app.put('/rs/clientAllowedUri/update', clientAllowedUriService.update);
    app.get('/rs/clientAllowedUri/get/:id', clientAllowedUriService.get);
    app.delete('/rs/clientAllowedUri/delete/:id', clientAllowedUriService.delete);
    app.get('/rs/clientAllowedUri/list/:clientId', clientAllowedUriService.list);  
    
    //client redirect uri    
    app.post('/rs/clientRedirectUri/add', clientRedirectUriService.add); 
    app.delete('/rs/clientRedirectUri/delete/:id', clientRedirectUriService.delete);
    app.get('/rs/clientRedirectUri/list/:clientId', clientRedirectUriService.list);  
    
};