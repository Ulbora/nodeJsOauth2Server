var crud = require("./crud/mysqlCrud");
var clientProcessor = require("./processors/clientProcessor");
var clientAllowedUriProcessor = require("./processors/clientAllowedUriProcessor");
var clientRoleProcessor = require("./processors/clientRoleProcessor");
var clientScopeProcessor = require("./processors/clientScopeProcessor");
var refreshTokenProcessor = require("./processors/refreshTokenProcessor");
exports.connect = function (host, user, pw, db, cpnum) {
    crud.connect(host, user, pw, db, cpnum);
    clientProcessor.init(crud);
    clientAllowedUriProcessor.init(crud);
    clientRoleProcessor.init(crud);
    clientScopeProcessor.init(crud);
    refreshTokenProcessor.init(crud);
};
exports.testConnection = function (callback) {
    crud.testConnection(callback);
};

//client operations---------------------------------------
exports.addClient = function(json, callback){
    clientProcessor.addClient(json, callback);
};

exports.updateClient = function (json, callback) {
    clientProcessor.updateClient(json, callback);
};

exports.getClient = function (clientId, callback) {
    clientProcessor.getClient(clientId, callback);
};

exports.getClientList = function (callback) {
    clientProcessor.getClientList(callback);
};

exports.deleteClient = function (clientId, callback) {
    clientProcessor.deleteClient(clientId, callback);
};
//end client operations ---------------------------------


//client allowed URI --------------------------
exports.addClientAllowedUri = function (json, callback) {
    clientAllowedUriProcessor.addClientAllowedUri(json, callback);
};

exports.getClientAllowedUriList = function (clientId, callback) {
    clientAllowedUriProcessor.getClientAllowedUriList(clientId, callback);
};

exports.deleteClientAllowedUri = function (id, callback) {
    clientAllowedUriProcessor.deleteClientAllowedUri(id, callback);
};
// end client allowed URI ------------------------------

//client role
exports.addClientRole = function (json, callback) {
    clientRoleProcessor.addClientRole(json, callback);
};

exports.getClientRoleList = function (clientId, callback) {
    clientRoleProcessor.getClientRoleList(clientId, callback);
};

exports.deleteClientRole = function (id, callback) {
    clientRoleProcessor.deleteClientRole(id, callback);
};
//end client role

//client scope
exports.addClientScope = function (json, callback) {
    clientScopeProcessor.addClientScope(json, callback);
};

exports.getClientScopeList = function (clientId, callback) {
    clientScopeProcessor.getClientScopeList(clientId, callback);
};

exports.deleteClientScope = function (id, callback) {
    clientScopeProcessor.deleteClientScope(id, callback);
};
//end client scope

//refresh token
exports.addRefreshToken = function (json, callback) {
    refreshTokenProcessor.addRefreshToken(json, callback);
};

exports.getRefreshToken = function (id, callback) {
    refreshTokenProcessor.getRefreshToken(id, callback);
};

exports.deleteRefreshToken = function (id, callback) {
    refreshTokenProcessor.deleteRefreshToken(id, callback);
};
//end refresh token