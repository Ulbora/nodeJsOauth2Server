var crud = require("./crud/mysqlCrud");
var clientProcessor = require("./processors/clientProcessor");
var clientAllowedUriProcessor = require("./processors/clientAllowedUriProcessor");
var clientRoleProcessor = require("./processors/clientRoleProcessor");
var clientScopeProcessor = require("./processors/clientScopeProcessor");
var clientRoleUriProcessor = require("./processors/clientRoleUriProcessor");
var refreshTokenProcessor = require("./processors/refreshTokenProcessor");
var accessTokenProcessor = require("./processors/accessTokenProcessor");
exports.connect = function (host, user, pw, db, cpnum) {
    crud.connect(host, user, pw, db, cpnum);
    clientProcessor.init(crud);
    clientAllowedUriProcessor.init(crud);
    clientRoleProcessor.init(crud);
    clientScopeProcessor.init(crud);
    clientRoleUriProcessor.init(crud);
    refreshTokenProcessor.init(crud);
    accessTokenProcessor.init(crud);
};
exports.testConnection = function (callback) {
    crud.testConnection(callback);
};

exports.getConnection = function (callback) {
    crud.getConnection(callback);
};

//client operations---------------------------------------
exports.addClient = function(con, json, callback){
    clientProcessor.addClient(con, json, callback);
};

exports.updateClient = function (con, json, callback) {
    clientProcessor.updateClient(con, json, callback);
};

exports.getClient = function (clientId, callback) {
    clientProcessor.getClient(clientId, callback);
};

exports.getClientList = function (callback) {
    clientProcessor.getClientList(callback);
};

exports.deleteClient = function (con, clientId, callback) {
    clientProcessor.deleteClient(con, clientId, callback);
};
//end client operations ---------------------------------


//client allowed URI --------------------------
exports.addClientAllowedUri = function (con, json, callback) {
    clientAllowedUriProcessor.addClientAllowedUri(con, json, callback);
};

exports.getClientAllowedUriList = function (clientId, callback) {
    clientAllowedUriProcessor.getClientAllowedUriList(clientId, callback);
};

exports.deleteClientAllowedUri = function (con, id, callback) {
    clientAllowedUriProcessor.deleteClientAllowedUri(con, id, callback);
};
// end client allowed URI ------------------------------

//client role
exports.addClientRole = function (con, json, callback) {
    clientRoleProcessor.addClientRole(con, json, callback);
};

exports.getClientRoleList = function (clientId, callback) {
    clientRoleProcessor.getClientRoleList(clientId, callback);
};

exports.deleteClientRole = function (con, id, callback) {
    clientRoleProcessor.deleteClientRole(con, id, callback);
};
//end client role

//client scope
exports.addClientScope = function (con, json, callback) {
    clientScopeProcessor.addClientScope(con, json, callback);
};

exports.getClientScopeList = function (clientId, callback) {
    clientScopeProcessor.getClientScopeList(clientId, callback);
};

exports.deleteClientScope = function (con, id, callback) {
    clientScopeProcessor.deleteClientScope(con, id, callback);
};
//end client scope

//client role uri
exports.addClientRoleUri = function (con, json, callback) {
    clientRoleUriProcessor.addClientRoleUri(con, json, callback);
};

exports.getClientRoleAllowedUriList = function (clientRoleId, callback) {
    clientRoleUriProcessor.getClientRoleAllowedUriList(clientRoleId, callback);
};

exports.deleteClientRoleUri = function (con, json, callback) {
    clientRoleUriProcessor.deleteClientRoleUri(con, json, callback);
};
//end client role uri

//refresh token
exports.addRefreshToken = function (con, json, callback) {
    refreshTokenProcessor.addRefreshToken(con, json, callback);
};

exports.getRefreshToken = function (id, callback) {
    refreshTokenProcessor.getRefreshToken(id, callback);
};

exports.deleteRefreshToken = function (con, id, callback) {
    refreshTokenProcessor.deleteRefreshToken(con, id, callback);
};
//end refresh token

//access token
exports.addAccessToken = function (con, json, callback) {
    accessTokenProcessor.addAccessToken(con, json, callback);
};

exports.getAccessToken = function (id, callback) {
    accessTokenProcessor.getAccessToken(id, callback);
};

exports.deleteAccessToken = function (con, id, callback) {
    accessTokenProcessor.deleteAccessToken(con, id, callback);
};
//end access token

//authorization code

//end authorization code