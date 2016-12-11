var crud = require("./crud/mysqlCrud");
var clientQueries = require("./queries/clientQueries");
exports.connect = function (host, user, pw, db, cpnum) {
    crud.connect(host, user, pw, db, cpnum);
};

exports.testConnection = function (callback) {
    crud.testConnection(callback);
};

exports.addClient = function (json, callback) {
    var args = {
        secret: json.secret,
        redirect_uri: json.redirectUri,
        name: json.name,
        web_site: json.webSite,
        email: json.email,
        enabled: json.enabled
    };
    crud.insert(clientQueries.CLIENT_INSERT_QUERY, args, function (result) {
        var rtn = {
            clientId: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.updateClient = function (json, callback) {
    var rtn = {
        success: false,
        message: ""
    }
    var args = [
        json.secret,
        json.redirectUri,
        json.name,
        json.webSite,
        json.email,
        json.enabled,
        json.clientId
    ];
    crud.update(clientQueries.CLIENT_UPDATE_QUERY, args, callback);
};



