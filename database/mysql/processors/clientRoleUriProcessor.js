var clientQueries = require("../queries/clientQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//client allowed URI --------------------------
exports.addClientRoleUri = function (con, json, callback) {
    var args = {
        client_role_id: json.clientRoleId,
        client_allowed_uri_id: json.clientAllowedUriId
    };
    crud.insertNoId(con, clientQueries.CLIENT_ROLE_URI_INSERT_QUERY, args, function (result) {
        console.log("clientRoleUri insert: " + JSON.stringify(result));
        var rtn = {            
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

exports.getClientRoleAllowedUriList = function (clientRoleId, callback) {
     var queryId = [clientRoleId];
    crud.get(clientQueries.CLIENT_ROLE_URI_LIST_QUERY, queryId, function (result) {
        if (result.success && result.data.length > 0) {
            var rtnList = [];
            for (var cnt = 0; cnt < result.data.length; cnt++) {
                var rtn = {
                    clientRoleId: result.data[cnt].client_role_id,
                    clientAllowedUriId: result.data[cnt].client_allowed_uri_id
                };
                rtnList.push(rtn);
            }
            callback(rtnList);
        } else {
            callback(rtnList);
        }
    });
};

exports.deleteClientRoleUri = function (con, json, callback) {
    var queryId = [json.clientRoleId, json.clientAllowedUriId];
    crud.delete(con, clientQueries.CLIENT_ROLE_URI_DELETE_QUERY, queryId, callback);
};


