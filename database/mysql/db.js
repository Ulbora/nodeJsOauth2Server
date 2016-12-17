var crud = require("./crud/mysqlCrud");
var clientProcessor = require("./processors/clientProcessor");
var clientAllowedUriProcessor = require("./processors/clientAllowedUriProcessor");
exports.connect = function (host, user, pw, db, cpnum) {
    crud.connect(host, user, pw, db, cpnum);
    clientProcessor.init(crud);
    clientAllowedUriProcessor.init(crud);
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

exports.deleteClientAllowedUri = function (id, callback) {
    clientAllowedUriProcessor.deleteClientAllowedUri(id, callback);
};
// end client allowed URI ------------------------------