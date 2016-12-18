var clientQueries = require("../queries/clientQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//client allowed URI --------------------------
exports.addClientScope = function (con, json, callback) {
    var args = {
        scope: json.scope,
        client_id: json.clientId
    };
    crud.insert(con, clientQueries.CLIENT_SCOPE_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

exports.getClientScopeList = function (clientId, callback) {
     var queryId = [clientId];
    crud.get(clientQueries.CLIENT_SCOPE_LIST_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    id: result.data[cnt].id,
                    scope: result.data[cnt].scope,
                    clientId: result.data[cnt].client_id
                };
                rtnList.push(rtn);
            }
            callback(rtnList);
        } else {
            callback(rtnList);
        }
    });
};

exports.deleteClientScope = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, clientQueries.CLIENT_SCOPE_DELETE_QUERY, queryId, callback);
};


