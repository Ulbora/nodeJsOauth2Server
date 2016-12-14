var crud = require("./crud/mysqlCrud");
var clientQueries = require("./queries/clientQueries");
exports.connect = function (host, user, pw, db, cpnum) {
    crud.connect(host, user, pw, db, cpnum);
};

exports.testConnection = function (callback) {
    crud.testConnection(callback);
};

//client operations---------------------------------------
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

exports.getClient = function (clientId, callback) {
    var queryId = [clientId];
    crud.get(clientQueries.CLIENT_GET_BY_ID_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtn = {
                clientId: result.data[0].client_id,
                redirectUri: result.data[0].redirect_uri,
                name: result.data[0].name,
                webSite: result.data[0].web_site,
                email: result.data[0].email,
                enabled: (result.data[0].enabled === 1) ? true : false
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.getClientList = function (callback) {
    crud.getList(clientQueries.CLIENT_LIST_QUERY, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    clientId: result.data[cnt].client_id,
                    redirectUri: result.data[cnt].redirect_uri,
                    name: result.data[cnt].name,
                    webSite: result.data[cnt].web_site,
                    email: result.data[cnt].email,
                    enabled: (result.data[cnt].enabled === 1) ? true : false
                };
                rtnList.push(rtn);
            }
            callback(rtnList);
        } else {
            callback(rtnList);
        }
    });
};

exports.deleteClient = function (clientId, callback) {
    var queryId = [clientId];
    crud.delete(clientQueries.CLIENT_DELETE_QUERY, queryId, callback);
};
//end client operations ---------------------------------


//client allowed URI --------------------------
exports.addClientAllowedUri = function (json, callback) {
    var args = {
        uri: json.uri,
        client_id: json.clientId
    };
    crud.insert(clientQueries.CLIENT_ALLOWED_URI_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

exports.deleteClientAllowedUri = function (id, callback) {
    var queryId = [id];
    crud.delete(clientQueries.CLIENT_ALLOWED_URI_DELETE_QUERY, queryId, callback);
};

// end client allowed URI ------------------------------