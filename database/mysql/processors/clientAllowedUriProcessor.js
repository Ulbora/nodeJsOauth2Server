var clientQueries = require("../queries/clientQueries");
var crud;
exports.init = function(c){
    crud = c;
};

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

