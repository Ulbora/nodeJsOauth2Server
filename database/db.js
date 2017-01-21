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

var db = require("./mysql/db");

exports.connect = function (host, user, pw, database, cpnum) {
    db.connect(host, user, pw, database, cpnum);
};

//client operations---------------------------------------
exports.addClient = function (clientJson, redirectUrls, callback) {
    db.addClient(clientJson, redirectUrls, callback);
};

exports.updateClient = function (json, callback) {
    db.updateClient(json, callback);
};

exports.getClient = function (clientId, callback) {
    db.getClient(clientId, callback);
};

exports.getClientList = function (callback) {
    db.getClientList(callback);
};

exports.deleteClient = function (clientId, callback) {
    db.deleteClient(clientId, callback);
};
//end client operations ---------------------------------


//client allowed URI --------------------------
exports.addClientAllowedUri = function (json, callback) {
    db.addClientAllowedUri(json, callback);
};

exports.getClientAllowedUriList = function (clientId, callback) {
    db.getClientAllowedUriList(clientId, callback);
};

exports.getClientAllowedUri = function (clientId, uri, callback) {
    db.getClientAllowedUri(clientId, uri, callback);
};

exports.deleteClientAllowedUri = function (id, callback) {
    db.deleteClientAllowedUri(id, callback);
};
// end client allowed URI ------------------------------

//client redirect uri
exports.addClientRedirectUri = function (json, callback) {
    db.addClientRedirectUri(json, callback);
};

exports.getClientRedirectUriList = function (clientId, callback) {
    db.getClientRedirectUriList(clientId, callback);
};

exports.getClientRedirectUri = function (clientId, uri, callback) {
    db.getClientRedirectUri(clientId, uri, callback);
};

exports.deleteClientRedirectUri = function (id, callback) {
    db.deleteClientRedirectUri(id, callback);
};

exports.deleteAllClientRedirectUri = function (clientId, callback) {
    db.deleteAllClientRedirectUri(clientId, callback);
};
//end client redirect uri


//client role
exports.addClientRole = function (json, callback) {
    db.addClientRole(json, callback);
};

exports.getClientRoleList = function (clientId, callback) {
    db.getClientRoleList(clientId, callback);
};

exports.deleteClientRole = function (id, callback) {
    db.deleteClientRole(id, callback);
};
//end client role

//client scope
exports.addClientScope = function (json, callback) {
    db.addClientScope(json, callback);
};

exports.getClientScopeList = function (clientId, callback) {
    db.getClientScopeList(clientId, callback);
};

exports.deleteClientScope = function (id, callback) {
    db.deleteClientScope(id, callback);
};
//end client scope

//client role uri
exports.addClientRoleUri = function (json, callback) {
    db.addClientRoleUri(json, callback);
};

exports.getClientRoleAllowedUriList = function (clientRoleId, callback) {
    db.getClientRoleAllowedUriList(clientRoleId, callback);
};

exports.getClientRoleAllowedUriListByClientId = function (clientId, callback) {
    db.getClientRoleAllowedUriListByClientId(clientId, callback);
};

exports.deleteClientRoleUri = function (json, callback) {
    db.deleteClientRoleUri(json, callback);
};
//end client role uri

//refresh token
exports.addRefreshToken = function (json, callback) {
    db.addRefreshToken(json, callback);
};

exports.updateRefreshToken = function (json, callback) {
    db.updateRefreshToken(json, callback);
};

exports.getRefreshToken = function (id, callback) {
    db.getRefreshToken(id, callback);
};

exports.deleteRefreshToken = function (id, callback) {
    db.deleteRefreshToken(id, callback);
};
//end refresh token

//access token
exports.addAccessToken = function (json, callback) {
    db.addAccessToken(json, callback);
};

exports.updateAccessToken = function (json, callback) {
    db.updateAccessToken(json, callback);
};

exports.getAccessToken = function (id, callback) {
    db.getAccessToken(id, callback);
};

exports.deleteAccessToken = function (id, callback) {
    db.deleteAccessToken(id, callback);
};
//end access token

//authorization code
exports.addAuthorizationCode = function (authCodeJson, accessTokenJson, refreshTokenJson, scopeList, callback) {
    db.addAuthorizationCode(authCodeJson, accessTokenJson, refreshTokenJson, scopeList, callback);
};


exports.getAuthorizationCode = function (clientId, userId, callback) {
    db.getAuthorizationCode(clientId, userId, callback);
};

exports.updateAuthorizationCode = function (json, callback) {
    db.updateAuthorizationCode(json, callback);
};

exports.deleteAuthorizationCode = function (clientId, userId, callback) {
    db.deleteAuthorizationCode(clientId, userId, callback);
};
//end authorization code

//authorization code scope
exports.addAuthorizationCodeScope = function (json, callback) {
    db.addAuthorizationCodeScope(json, callback);
};

exports.getAuthorizationCodeScopeList = function (authorizationCode, callback) {
    db.getAuthorizationCodeScopeList(authorizationCode, callback);
};

exports.deleteAuthorizationCodeScope = function (id, callback) {
    db.deleteAuthorizationCodeScope(id, callback);
};

exports.deleteAuthorizationCodeScopeList = function (authorizationCode, callback) {
    db.deleteAuthorizationCodeScopeList(authorizationCode, callback);
};
//end authorization code scope

// allowed grant types
exports.addClientGrantType = function (json, callback) {
    db.addClientGrantType(json, callback);
};

exports.getClientGrantTypeList = function (clientId, callback) {
    db.getClientGrantTypeList(clientId, callback);
};

exports.deleteClientGrantType = function (id, callback) {
    db.deleteClientGrantType(id, callback);
};
//end grant types

//implicit grant
exports.addImplicitGrant = function (implicitJson, accessTokenJson, scope, callback) {
    db.addImplicitGrant(implicitJson, accessTokenJson, scope, callback);
};

exports.getImplicitGrant = function (clientId, userId, callback) {
    db.getImplicitGrant(clientId, userId, callback);
};


exports.deleteImplicitGrant = function (clientId, userId, callback) {
    db.deleteImplicitGrant(clientId, userId, callback);
};
//end implicit grant

// implicit grant scope
exports.addImplicitGrantScope = function (json, callback) {
    db.addImplicitGrantScope(json, callback);
};

exports.getImplicitGrantScopeList = function (implicitGrantId, callback) {
    db.getImplicitGrantScopeList(implicitGrantId, callback);
};

exports.deleteImplicitGrantScope = function (id, callback) {
    db.deleteImplicitGrantScope(id, callback);
};
//end implicit scope


//authorization code
exports.addPasswordGrant = function (pwgJson, accessTokenJson, refreshTokenJson, callback) {
    db.addPasswordGrant(pwgJson, accessTokenJson, refreshTokenJson, callback);
};

exports.getPasswordGrant = function (clientId, userId, callback) {
    db.getPasswordGrant(clientId, userId, callback);
};

exports.deletePasswordGrant = function (clientId, userId, callback) {
    db.deletePasswordGrant(clientId, userId, callback);
};
//end password grant

//credentials code
exports.addCredentialsGrant = function (credJson, accessTokenJson, callback) {
    db.addCredentialsGrant(credJson, accessTokenJson, callback);
};

exports.getCredentialsGrant = function (clientId, callback) {
    db.getCredentialsGrant(clientId, callback);
};

exports.deleteCredentialsGrant = function (clientId, callback) {
    db.deleteCredentialsGrant(clientId, callback);
};
//end credentials grant


//token keys

exports.getAccessTokenKey = function (callback) {    
    db.getAccessTokenKey(callback);
};


exports.getRefreshTokenKey = function (callback) {    
    db.getRefreshTokenKey(callback);
};
//end token keys