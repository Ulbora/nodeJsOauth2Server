var clientQueries = require("../queries/clientQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//client allowed URI --------------------------
exports.addClientRole = function (con, json, callback) {
    var args = {
        role: json.role,
        client_id: json.clientId
    };
    crud.insert(con, clientQueries.CLIENT_ROLE_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

exports.getClientRoleList = function (clientId, callback) {
     var queryId = [clientId];
    crud.get(clientQueries.CLIENT_ROLE_LIST_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    id: result.data[cnt].id,
                    role: result.data[cnt].role,
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

exports.deleteClientRole = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, clientQueries.CLIENT_ROLE_DELETE_QUERY, queryId, callback);
};


