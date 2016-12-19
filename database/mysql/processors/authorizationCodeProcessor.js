var authorizationCodeQueries = require("../queries/authorizationCodeQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//access token --------------------------
exports.addAuthorizationCode = function (con, json, callback) {
    var args = {
        client_id: json.clientId,
        user_id: json.userId,
        expires: json.expires,
        access_token_id: json.accessTokenId
    };
    console.log("json in add authorizationCode :" + JSON.stringify(json));
    crud.insert(con, authorizationCodeQueries.AUTHORIZATION_CODE_INSERT_QUERY, args, function (result) {
        var rtn = {
            authorizationCode: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.getAuthorizationCode = function (id, callback) {
    var queryId = [id];
    crud.get(authorizationCodeQueries.AUTHORIZATION_CODE_GET_BY_ID_QUERY, queryId, function (result) {
        //console.log("get refresh token:" +JSON.stringify(result));
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0 ) {
            var rtn = {
                authorizationCode: result.data[0].authorization_code,
                clientId: result.data[0].client_id,
                userId: result.data[0].user_id,
                expires: result.data[0].expires,
                accessTokenId: result.data[0].access_token_id
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.deleteAuthorizationCode = function (con, id, callback) {
    var queryId = [id];
    crud.delete(con, authorizationCodeQueries.AUTHORIZATION_CODE_DELETE_QUERY, queryId, callback);
};


